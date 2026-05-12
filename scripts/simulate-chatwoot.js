#!/usr/bin/env node

/**
 * Script para ajudar com testes locais da Chatwoot Dashboard App
 *
 * Uso:
 *   node scripts/simulate-chatwoot.js
 *
 * Este script fornece instruções para testar a app localmente usando o
 * arquivo scripts/test-postMessage.html
 */

const path = require('path');
const fs = require('fs');

console.log('\n🎯 Chatwoot Dashboard App - Teste Local\n');
console.log('='.repeat(60));

console.log('\n📝 INSTRUÇÕES DE TESTE:\n');

console.log('1. Inicie o servidor de desenvolvimento:');
console.log('   $ npm install');
console.log('   $ npm run dev\n');

console.log('   A app estará rodando em: http://localhost:5173\n');

console.log('2. Abra o arquivo de teste no browser:');

const testFilePath = path.join(__dirname, 'test-postMessage.html');
const absolutePath = path.resolve(testFilePath);

if (fs.existsSync(testFilePath)) {
  console.log(`   📂 ${absolutePath}\n`);
  console.log('   Ou abra diretamente no navegador:');
  console.log(`   file://${absolutePath}\n`);
} else {
  console.log('   ⚠️  Arquivo test-postMessage.html não encontrado\n');
}

console.log('3. Na página de teste, você pode:');
console.log('   ✓ Simular appContext COM Lead ID');
console.log('   ✓ Simular appContext SEM Lead ID (para testar banner de alerta)');
console.log('   ✓ Simular fetch-info (para testar listener)\n');

console.log('4. Teste a funcionalidade:');
console.log('   ✓ Selecione mensagens (clique nos cards)');
console.log('   ✓ Use "Selecionar tudo" e "Limpar seleção"');
console.log('   ✓ Clique em "Enviar ao Ziptime" para testar envio\n');

console.log('5. Para testar o webhook n8n:');
console.log('   a) Configure a URL em .env:');
console.log('      VITE_N8N_SAVE_CRM_URL=https://seu-webhook-n8n.com/path\n');
console.log('   b) Ou use um serviço como ngrok/webhook.site:');
console.log('      https://webhook.site - copie sua URL única\n');
console.log('   c) Abra DevTools (F12) e vá para a aba Network');
console.log('   d) Selecione mensagens e clique em "Enviar"');
console.log('   e) Verifique o request POST no Network tab\n');

console.log('6. Estrutura de testes:');
console.log('   ✓ LoadingSpinner: vê quando clica "Recarregar"');
console.log('   ✓ ErrorState: espere 10s sem enviar dados');
console.log('   ✓ ContactHeader: exibe nome, email, phone, status badge');
console.log('   ✓ ZiptimeAlert: simule SEM Lead ID');
console.log('   ✓ MessageList: filtra private=false, ordena por timestamp');
console.log('   ✓ MessageCard: clique para selecionar, checkbox aparece');
console.log('   ✓ SendButton: ativa quando messages selecionadas + Lead ID existe\n');

console.log('='.repeat(60));
console.log('\n💡 Dicas:\n');

console.log('   • Abra o DevTools (F12) para ver console.log em desenvolvimento');
console.log('   • Use a aba Network para inspeccionar requisições POST');
console.log('   • A app recarrega automaticamente com changes em src/');
console.log('   • Use "Tentar novamente" para testar retry logic\n');

console.log('📚 Variáveis de Ambiente (.env):\n');
console.log('   VITE_N8N_SAVE_CRM_URL=<sua-url-webhook-n8n>\n');

console.log('🚀 Para build e deploy:\n');
console.log('   npm run build          # Build para produção');
console.log('   npm run preview        # Preview da build');
console.log('   docker build .         # Build Docker');
console.log('   docker run -p 8080:80  # Executar container\n');

console.log('='.repeat(60) + '\n');
