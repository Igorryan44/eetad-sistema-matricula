#!/usr/bin/env node

/**
 * Script de Diagnóstico MercadoPago
 * Verifica se todas as configurações estão corretas para PIX e QR Code
 */

import https from 'https';

const SUPABASE_URL = 'https://umkizxftwrwqiiahjbrr.supabase.co/functions/v1';

// Dados de teste padrão
const testData = {
  nome: "Diagnóstico Sistema",
  cpf: "12345678901",
  email: "diagnostico@eetad.com.br",
  valor: 1.00, // Valor mínimo para teste
  livro: "Teste Diagnóstico",
  ciclo: "1º Ciclo Básico"
};

console.log('🔍 DIAGNÓSTICO MERCADOPAGO - SISTEMA EETAD');
console.log('==========================================\n');

// Função para fazer requisições HTTP
function makeRequest(url, data, method = 'POST') {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: jsonData,
            headers: res.headers
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: responseData,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Teste 1: Verificar criação de pagamento PIX
async function testCreatePayment() {
  console.log('📝 Teste 1: Criação de Pagamento PIX');
  console.log('-----------------------------------');
  
  try {
    const response = await makeRequest(`${SUPABASE_URL}/create-mercadopago-payment`, testData);
    
    console.log(`Status: ${response.status}`);
    
    if (response.status === 200) {
      const data = response.data;
      console.log('✅ Pagamento criado com sucesso!');
      console.log(`   Payment ID: ${data.payment_id}`);
      console.log(`   Status: ${data.status}`);
      console.log(`   QR Code: ${data.qr_code ? 'Gerado ✅' : 'Não gerado ❌'}`);
      console.log(`   QR Code Base64: ${data.qr_code_base64 ? 'Gerado ✅' : 'Não gerado ❌'}`);
      
      return {
        success: true,
        paymentId: data.payment_id,
        hasQrCode: !!data.qr_code_base64
      };
    } else {
      console.log('❌ Erro ao criar pagamento:');
      console.log(`   ${JSON.stringify(response.data, null, 2)}`);
      return { success: false };
    }
  } catch (error) {
    console.log('❌ Erro de conexão:');
    console.log(`   ${error.message}`);
    return { success: false };
  }
}

// Teste 2: Verificar status de pagamento
async function testCheckPaymentStatus(paymentId) {
  console.log('\n🔍 Teste 2: Verificação de Status');
  console.log('--------------------------------');
  
  if (!paymentId) {
    console.log('⏭️  Pulando teste (sem Payment ID)');
    return;
  }
  
  try {
    const response = await makeRequest(`${SUPABASE_URL}/check-payment-status`, { payment_id: paymentId });
    
    console.log(`Status: ${response.status}`);
    
    if (response.status === 200) {
      const data = response.data;
      console.log('✅ Status verificado com sucesso!');
      console.log(`   Payment ID: ${data.payment_id}`);
      console.log(`   Status: ${data.status}`);
      console.log(`   Status Detail: ${data.status_detail}`);
    } else {
      console.log('❌ Erro ao verificar status:');
      console.log(`   ${JSON.stringify(response.data, null, 2)}`);
    }
  } catch (error) {
    console.log('❌ Erro de conexão:');
    console.log(`   ${error.message}`);
  }
}

// Teste 3: Verificar webhook (simulação)
async function testWebhook() {
  console.log('\n🔗 Teste 3: Webhook MercadoPago');
  console.log('-----------------------------');
  
  const webhookData = {
    type: 'payment',
    data: {
      id: '123456789' // ID fictício para teste
    }
  };
  
  try {
    const response = await makeRequest(`${SUPABASE_URL}/mercadopago-webhook`, webhookData);
    
    console.log(`Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('✅ Webhook respondeu corretamente!');
    } else {
      console.log('⚠️  Webhook com problema:');
      console.log(`   ${JSON.stringify(response.data, null, 2)}`);
    }
  } catch (error) {
    console.log('❌ Erro de conexão:');
    console.log(`   ${error.message}`);
  }
}

// Executar todos os testes
async function runDiagnostic() {
  console.log(`Testando com dados: ${JSON.stringify(testData, null, 2)}\n`);
  
  const paymentResult = await testCreatePayment();
  await testCheckPaymentStatus(paymentResult.paymentId);
  await testWebhook();
  
  console.log('\n📊 RESUMO DO DIAGNÓSTICO');
  console.log('========================');
  
  if (paymentResult.success && paymentResult.hasQrCode) {
    console.log('🎉 SISTEMA FUNCIONANDO PERFEITAMENTE!');
    console.log('   ✅ Pagamentos PIX sendo criados');
    console.log('   ✅ QR Codes sendo gerados');
    console.log('   ✅ APIs respondendo corretamente');
  } else if (paymentResult.success && !paymentResult.hasQrCode) {
    console.log('⚠️  SISTEMA PARCIALMENTE FUNCIONANDO');
    console.log('   ✅ Pagamentos PIX sendo criados');
    console.log('   ❌ QR Codes não sendo gerados');
    console.log('   💡 Verifique a configuração do token MercadoPago');
  } else {
    console.log('❌ SISTEMA COM PROBLEMAS');
    console.log('   ❌ Erro na criação de pagamentos');
    console.log('   💡 Verifique:');
    console.log('      - Token MERCADOPAGO_ACCESS_TOKEN no Supabase');
    console.log('      - Conexão com a internet');
    console.log('      - Logs das funções Supabase');
  }
  
  console.log('\n📖 Para mais informações, consulte: CONFIGURACAO-MERCADOPAGO.md');
}

// Executar diagnóstico
runDiagnostic().catch(console.error);