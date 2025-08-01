/**
 * Script de Teste Completo - MercadoPago PIX
 * 
 * Este script testa toda a integração MercadoPago:
 * 1. Verifica se o token está configurado
 * 2. Testa a criação de pagamento PIX
 * 3. Verifica o status do pagamento
 * 4. Testa o cancelamento
 */

const SUPABASE_URL = 'https://umkizxftwrwqiiahjbrr.supabase.co';

// Dados de teste
const dadosTeste = {
  nome: 'João Silva Teste',
  cpf: '11144477735', // CPF válido para testes do MercadoPago
  email: 'teste@exemplo.com',
  valor: 50.00,
  livro: 'Livro Teste',
  ciclo: 'Ciclo Teste'
};

console.log('🚀 INICIANDO TESTE COMPLETO DO MERCADOPAGO\n');
console.log('📋 Dados de teste:', dadosTeste);
console.log('\n' + '='.repeat(60) + '\n');

async function testarCriacaoPagamento() {
  console.log('1️⃣ TESTANDO CRIAÇÃO DE PAGAMENTO PIX...\n');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-mercadopago-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVta2l6eGZ0d3J3cWlpYWhqYnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzEyNzIsImV4cCI6MjA2NDY0NzI3Mn0.6rGPdMiRcQ_plkkkHiwy73rOrSoGcLwAqZogNyQplTs'
      },
      body: JSON.stringify(dadosTeste)
    });

    const data = await response.json();
    
    console.log(`📊 Status HTTP: ${response.status}`);
    console.log(`📝 Headers:`, Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      console.log('✅ SUCESSO! Pagamento PIX criado:');
      console.log(`   💳 Payment ID: ${data.payment_id}`);
      console.log(`   📱 Status: ${data.status}`);
      console.log(`   🔗 QR Code: ${data.qr_code ? 'Gerado ✅' : 'Não gerado ❌'}`);
      console.log(`   🖼️ QR Code Base64: ${data.qr_code_base64 ? 'Gerado ✅' : 'Não gerado ❌'}`);
      console.log(`   🎫 Ticket URL: ${data.ticket_url ? 'Disponível ✅' : 'Não disponível ❌'}`);
      
      if (data.qr_code) {
        console.log(`   📏 Tamanho QR Code: ${data.qr_code.length} caracteres`);
        console.log(`   👀 Preview: ${data.qr_code.substring(0, 50)}...`);
      }
      
      return data;
    } else {
      console.log('❌ ERRO na criação do pagamento:');
      console.log(`   📄 Resposta: ${JSON.stringify(data, null, 2)}`);
      
      // Diagnóstico específico
      if (response.status === 401) {
        console.log('\n🔍 DIAGNÓSTICO:');
        console.log('   ⚠️ Erro 401 - Token não configurado ou inválido');
        console.log('   📝 Ação necessária: Configure o MERCADOPAGO_ACCESS_TOKEN no Supabase');
      } else if (response.status === 400) {
        console.log('\n🔍 DIAGNÓSTICO:');
        console.log('   ⚠️ Erro 400 - Dados inválidos');
        console.log('   📝 Verifique os dados enviados');
      }
      
      return null;
    }
  } catch (error) {
    console.log('❌ ERRO DE REDE:');
    console.log(`   📄 Erro: ${error.message}`);
    return null;
  }
}

async function testarStatusPagamento(paymentId) {
  console.log('\n2️⃣ TESTANDO VERIFICAÇÃO DE STATUS...\n');
  
  if (!paymentId) {
    console.log('⏭️ Pulando teste - Payment ID não disponível');
    return;
  }
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/check-payment-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVta2l6eGZ0d3J3cWlpYWhqYnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzEyNzIsImV4cCI6MjA2NDY0NzI3Mn0.6rGPdMiRcQ_plkkkHiwy73rOrSoGcLwAqZogNyQplTs'
      },
      body: JSON.stringify({ payment_id: paymentId })
    });

    const data = await response.json();
    
    console.log(`📊 Status HTTP: ${response.status}`);
    
    if (response.ok) {
      console.log('✅ SUCESSO! Status verificado:');
      console.log(`   📱 Status: ${data.status}`);
      console.log(`   💰 Valor: R$ ${data.transaction_amount}`);
      console.log(`   📅 Data: ${data.date_created}`);
    } else {
      console.log('❌ ERRO na verificação:');
      console.log(`   📄 Resposta: ${JSON.stringify(data, null, 2)}`);
    }
  } catch (error) {
    console.log('❌ ERRO DE REDE:');
    console.log(`   📄 Erro: ${error.message}`);
  }
}

async function testarCancelamento(paymentId) {
  console.log('\n3️⃣ TESTANDO CANCELAMENTO...\n');
  
  if (!paymentId) {
    console.log('⏭️ Pulando teste - Payment ID não disponível');
    return;
  }
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/cancel-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVta2l6eGZ0d3J3cWlpYWhqYnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzEyNzIsImV4cCI6MjA2NDY0NzI3Mn0.6rGPdMiRcQ_plkkkHiwy73rOrSoGcLwAqZogNyQplTs'
      },
      body: JSON.stringify({ payment_id: paymentId })
    });

    const data = await response.json();
    
    console.log(`📊 Status HTTP: ${response.status}`);
    
    if (response.ok) {
      console.log('✅ SUCESSO! Pagamento cancelado');
    } else {
      console.log('❌ ERRO no cancelamento:');
      console.log(`   📄 Resposta: ${JSON.stringify(data, null, 2)}`);
    }
  } catch (error) {
    console.log('❌ ERRO DE REDE:');
    console.log(`   📄 Erro: ${error.message}`);
  }
}

async function verificarConfiguracao() {
  console.log('0️⃣ VERIFICANDO CONFIGURAÇÃO...\n');
  
  // Teste básico de conectividade
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-mercadopago-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    console.log(`🌐 Conectividade Supabase: ${response.status === 401 || response.status === 400 ? 'OK ✅' : 'Problema ❌'}`);
    
    if (response.status === 500) {
      const data = await response.json();
      if (data.error && data.error.includes('MERCADOPAGO_ACCESS_TOKEN')) {
        console.log('🔑 Token MercadoPago: Não configurado ❌');
      }
    }
    
  } catch (error) {
    console.log('🌐 Conectividade Supabase: Erro de rede ❌');
    console.log(`   📄 Erro: ${error.message}`);
  }
}

async function executarTestes() {
  await verificarConfiguracao();
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  const pagamento = await testarCriacaoPagamento();
  
  if (pagamento && pagamento.payment_id) {
    await testarStatusPagamento(pagamento.payment_id);
    await testarCancelamento(pagamento.payment_id);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 TESTE COMPLETO FINALIZADO');
  
  if (pagamento && pagamento.qr_code) {
    console.log('\n✅ RESULTADO: Sistema funcionando corretamente!');
    console.log('   🎯 PIX e QR Code sendo gerados com sucesso');
  } else {
    console.log('\n❌ RESULTADO: Sistema com problemas');
    console.log('   🎯 PIX e QR Code NÃO estão sendo gerados');
    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('   1. Configure o MERCADOPAGO_ACCESS_TOKEN no Supabase Dashboard');
    console.log('   2. Acesse: https://umkizxftwrwqiiahjbrr.supabase.co/project/settings/functions');
    console.log('   3. Adicione a variável MERCADOPAGO_ACCESS_TOKEN com seu token do MercadoPago');
    console.log('   4. Execute este teste novamente');
  }
  
  console.log('='.repeat(60));
}

// Executar os testes
executarTestes().catch(console.error);