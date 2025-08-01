/**
 * Teste Específico - Simulando CheckoutPage
 * 
 * Este script simula exatamente o que o CheckoutPage está fazendo
 */

const SUPABASE_URL = 'https://umkizxftwrwqiiahjbrr.supabase.co';

// Simulando dados que vêm do BookOrder (como no frontend)
const bookOrder = {
  studentName: 'João Silva Teste',
  cpf: '11144477735',
  email: 'teste@exemplo.com',
  bookName: 'Livro de Teologia',
  price: 50.00,
  cycle: '1º Ciclo Básico'
};

console.log('🔍 TESTE ESPECÍFICO - SIMULANDO CHECKOUTPAGE\n');
console.log('📋 BookOrder simulado:', bookOrder);
console.log('\n' + '='.repeat(60) + '\n');

async function testarComoCheckoutPage() {
  console.log('📤 ENVIANDO DADOS COMO O CHECKOUTPAGE...\n');
  
  try {
    // Exatamente como no CheckoutPage
    const paymentData = {
      nome: bookOrder.studentName,
      cpf: bookOrder.cpf,
      email: bookOrder.email || "aluno@eetad.com.br",
      valor: bookOrder.price,
      livro: bookOrder.bookName,
      ciclo: bookOrder.cycle || "1º Ciclo Básico"
    };

    console.log('[CheckoutPage] Enviando dados para criar PIX MercadoPago:', paymentData);

    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-mercadopago-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVta2l6eGZ0d3J3cWlpYWhqYnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzEyNzIsImV4cCI6MjA2NDY0NzI3Mn0.6rGPdMiRcQ_plkkkHiwy73rOrSoGcLwAqZogNyQplTs'
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();
    console.log('[CheckoutPage] Resposta create-mercadopago-payment:', result);

    console.log(`📊 Status HTTP: ${response.status}`);
    console.log(`📝 Response OK: ${response.ok}`);

    if (!response.ok) {
      console.log('❌ ERRO - Response não OK:');
      console.log(`   📄 Error: ${result?.error || "Erro ao criar pagamento PIX MercadoPago"}`);
      throw new Error(result?.error || "Erro ao criar pagamento PIX MercadoPago");
    }

    if (!result.qr_code_base64 || !result.qr_code) {
      console.log('❌ ERRO - QR Code não gerado:');
      console.log(`   🔗 QR Code: ${result.qr_code ? 'Presente' : 'Ausente'}`);
      console.log(`   🖼️ QR Code Base64: ${result.qr_code_base64 ? 'Presente' : 'Ausente'}`);
      throw new Error("QR Code do PIX não foi gerado pelo MercadoPago");
    }

    console.log('✅ SUCESSO! PIX criado como no CheckoutPage:');
    console.log(`   💳 Payment ID: ${result.payment_id}`);
    console.log(`   📱 Status: ${result.status}`);
    console.log(`   🔗 QR Code: ${result.qr_code ? 'Gerado ✅' : 'Não gerado ❌'}`);
    console.log(`   🖼️ QR Code Base64: ${result.qr_code_base64 ? 'Gerado ✅' : 'Não gerado ❌'}`);
    
    console.log('[CheckoutPage] PIX MercadoPago gerado com sucesso:', {
      payment_id: result.payment_id,
      qr_code_length: result.qr_code?.length,
      qr_code_base64_length: result.qr_code_base64?.length
    });

    return result;

  } catch (error) {
    console.log('❌ ERRO CAPTURADO (como no CheckoutPage):');
    console.log(`   📄 Error: ${error.message}`);
    console.log(`   🔍 Error Type: ${error.constructor.name}`);
    
    let errorMessage = "Tente novamente em alguns instantes.";
    
    if (error?.message?.includes("MERCADOPAGO_ACCESS_TOKEN")) {
      errorMessage = "Erro de configuração do sistema. Contate o suporte.";
    } else if (error?.message?.includes("unauthorized") || error?.message?.includes("401")) {
      errorMessage = "Token de acesso inválido. Contate o suporte.";
    } else if (error?.message?.includes("network") || error?.message?.includes("fetch")) {
      errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
    }
    
    console.log(`   💬 Mensagem para usuário: ${errorMessage}`);
    
    return null;
  }
}

async function testarComDadosProblematicos() {
  console.log('\n📤 TESTANDO COM DADOS PROBLEMÁTICOS...\n');
  
  // Teste com dados que podem causar problemas
  const dadosProblematicos = [
    {
      nome: '',
      cpf: '11144477735',
      email: 'teste@exemplo.com',
      valor: 50.00,
      livro: 'Livro de Teologia',
      ciclo: '1º Ciclo Básico'
    },
    {
      nome: 'João Silva',
      cpf: '',
      email: 'teste@exemplo.com',
      valor: 50.00,
      livro: 'Livro de Teologia',
      ciclo: '1º Ciclo Básico'
    },
    {
      nome: 'João Silva',
      cpf: '11144477735',
      email: 'teste@exemplo.com',
      valor: 0,
      livro: 'Livro de Teologia',
      ciclo: '1º Ciclo Básico'
    }
  ];

  for (let i = 0; i < dadosProblematicos.length; i++) {
    const dados = dadosProblematicos[i];
    console.log(`\n🧪 Teste ${i + 1}:`, dados);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-mercadopago-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados)
      });

      const result = await response.json();
      console.log(`   📊 Status: ${response.status}`);
      console.log(`   📄 Resultado: ${JSON.stringify(result, null, 2)}`);
      
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`);
    }
  }
}

async function executarTestes() {
  const resultado = await testarComoCheckoutPage();
  
  if (!resultado) {
    console.log('\n🔍 INVESTIGANDO POSSÍVEIS PROBLEMAS...');
    await testarComDadosProblematicos();
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 TESTE ESPECÍFICO FINALIZADO');
  
  if (resultado) {
    console.log('\n✅ RESULTADO: CheckoutPage deveria funcionar!');
    console.log('   🎯 O problema pode estar no frontend ou nos dados enviados');
  } else {
    console.log('\n❌ RESULTADO: Problema identificado na API');
    console.log('   🎯 Verifique os logs acima para detalhes');
  }
  
  console.log('='.repeat(60));
}

// Executar os testes
executarTestes().catch(console.error);