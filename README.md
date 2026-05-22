# Chatwoot Ziptime Dashboard App

Uma aplicação React que funciona como iframe embarcado no painel lateral do Chatwoot, permitindo que agentes selecionem mensagens de conversas e as enviem para atualizar cards de leads no Ziptime CRM via webhook n8n.

## 🚀 Features

- **Sincronização em tempo real** com contexto do Chatwoot via `postMessage`
- **Seleção múltipla** de mensagens com filtro automático de mensagens privadas
- **Status da conversa** com badges visuais (Aberta, Pendente, Resolvida)
- **Alerta visual** quando Lead ID do Ziptime não está configurado
- **Integração n8n** com payload estruturado e tratamento de erros
- **Offline graceful** com timeout 10s e opção de retry
- **Responsivo** para diferentes tamanhos de painel no Chatwoot
- **Sem dependências externas** de UI (React + Tailwind CSS puro)

---

## 📋 Pré-requisitos

- Node.js 18+ (para desenvolvimento)
- Docker (para deploy)
- Conta Chatwoot ativa
- Webhook n8n configurado (ou qualquer outro webhook compatível)

---

## 🛠️ Desenvolvimento Local

### 1. Instalação

```bash
# Clone ou extraia o projeto
cd chatwoot-ziptime-app

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env e adicione sua URL de webhook n8n
```

### 2. Iniciando o servidor

```bash
npm run dev
```

A app estará rodando em `http://localhost:5173`

### 3. Testando localmente

Abra o arquivo de teste no seu navegador:

```bash
node scripts/simulate-chatwoot.js
```

Ou navegue diretamente para:
```
file:///seu/caminho/até/chatwoot-ziptime-app/scripts/test-postMessage.html
```

Use os botões de simulação para testar diferentes cenários:
- ✅ appContext com Lead ID
- ⚠️ appContext sem Lead ID (testa o banner de alerta)
- ↻ Fetch-info (testa listener de postMessage)

### 4. Build para produção

```bash
npm run build
```

Arquivos compilados estarão em `dist/`

---

## 🐳 Deploy com Docker

### Build

```bash
docker build -t chatwoot-ziptime-app:latest .
```

### Executar

```bash
docker run -p 8080:80 \
  -e VITE_N8N_SAVE_CRM_URL="https://seu-webhook-n8n.com/path" \
  chatwoot-ziptime-app:latest
```

A app estará em `http://localhost:8080`

---

## ⚙️ Configuração no Chatwoot

### 1. Registrar o Dashboard App

1. Acesse **Chatwoot** → **Settings** → **Integrations** → **Dashboard Apps**
2. Clique em **Create App**
3. Configure:
   - **Name**: `Ziptime CRM Connector`
   - **URL**: `https://seu-dominio.com` (ou IP do Docker)
   - **Position**: `sidebar_left`

### 2. Configurar Lead ID nos Contatos

Cada contato precisa ter o `ziptime_lead_id` configurado em seus atributos personalizados:

1. Vá para um **Contato** → **Edit**
2. Em **Custom Attributes**, adicione:
   ```
   ziptime_lead_id: "LEAD_123456" (ou ID do seu lead no Ziptime)
   ```

Se não houver Lead ID, a app exibirá um banner de alerta e o botão de envio ficará desabilitado.

### 3. Alternativa: Sincronizar via API

Se você sincroniza contatos automaticamente do Ziptime, certifique-se de mapear o ID do lead para `custom_attributes.ziptime_lead_id`.

---

## 🔗 Configuração do Webhook n8n

### Exemplo de Workflow n8n

1. **Trigger**: Webhook (POST)
2. **Body esperado**:

```json
{
  "ziptime_lead_id": "LEAD_12345",
  "chatwoot_conversation_id": 123,
  "chatwoot_contact_id": 456,
  "contact_name": "João Silva",
  "contact_email": "joao@example.com",
  "contact_phone": "+55 11 98765-4321",
  "agent_name": "Maria Agente",
  "sent_at": "2025-02-10T14:30:45.123Z",
  "selected_messages": [
    {
      "id": 1,
      "content": "Mensagem de texto",
      "message_type": 0,
      "sender_name": "João Silva",
      "sent_at": "2025-02-10T14:25:00.000Z"
    }
  ]
}
```

3. **Próximos passos**: HTTP request ao Ziptime CRM API para criar/atualizar card do lead

### Exemplo simples com webhook.site (para testes)

1. Acesse https://webhook.site
2. Copie sua URL única (ex: `https://webhook.site/abc123...`)
3. Configure em `.env`:
   ```
   VITE_N8N_SAVE_CRM_URL=https://webhook.site/abc123...
   ```
4. Teste clicando "Enviar ao Ziptime"
5. Você verá a requisição POST na página webhook.site

---

## 📁 Estrutura do Projeto

```
chatwoot-ziptime-app/
├── .env.example                 # Template de variáveis de ambiente
├── .gitignore
├── Dockerfile                   # Multi-stage Docker build
├── nginx.conf                   # Configuração Nginx (SPA + CORS headers)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
├── scripts/
│   ├── test-postMessage.html    # Teste interativo no navegador
│   └── simulate-chatwoot.js     # Instruções de teste
└── src/
    ├── main.jsx                 # Entry point React
    ├── App.jsx                  # Componente principal
    ├── index.css                # Tailwind imports
    ├── hooks/
    │   └── useChatwootContext.js # Hook para postMessage listener
    ├── components/
    │   ├── LoadingSpinner.jsx   # Estado loading
    │   ├── ErrorState.jsx       # Timeout/erro
    │   ├── ContactHeader.jsx    # Nome, email, phone, status badge
    │   ├── ZiptimeAlert.jsx     # Banner se Lead ID ausente
    │   ├── MessageList.jsx      # Lista com select all/clear
    │   ├── MessageCard.jsx      # Card individual clicável
    │   └── SendButton.jsx       # Botão com 3 estados
    ├── services/
    │   └── n8n.js              # Requisição POST para webhook
    └── utils/
        └── formatters.js        # parseEventData, formatDate, formatToISO
```

---

## 🎯 Como Funciona

### 1. Inicialização

- App monta e dispara `window.parent.postMessage('chatwoot-dashboard-app:fetch-info', '*')`
- Chatwoot responde com `postMessage` contendo contexto (conversation, contact, currentAgent)
- App faz parse JSON seguro e renderiza a UI

### 2. Timeout e Retry

- Se após 10s não chegar contexto, exibe ErrorState com botão "Tentar novamente"
- Clicando retry, repetir processo de request

### 3. Seleção de Mensagens

- Apenas mensagens com `private === false` são exibidas
- Mensagens ordenadas por `created_at` (mais antigas primeiro)
- Clique no card para selecionar, checkbox aparece no hover
- Botões "Selecionar tudo" e "Limpar seleção"

### 4. Envio para n8n

- Botão desabilitado se: nenhuma mensagem selecionada OU Lead ID ausente
- Clique → fetch POST com payload completo
- Success: banner verde 3s, depois limpa seleção
- Error: banner vermelho com mensagem, opção de retry

---

## 🔐 Segurança

- **CORS permissivo** no nginx.conf (necessário para iframe)
- **X-Frame-Options: ALLOWALL** para funcionar dentro do Chatwoot
- **JSON.parse com try/catch** para validar dados do Chatwoot
- **Sem autenticação no webhook** (configure em seu servidor n8n conforme necessário)
- **HTTPS recomendado** em produção

---

## 📝 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_N8N_SAVE_CRM_URL` | URL do webhook n8n | `https://seu-n8n.com/webhook/save-crm` |

---

## 🧪 Testes

### Teste Manual com scripts/test-postMessage.html

```bash
npm run dev
# Abra scripts/test-postMessage.html no navegador
```

Cenários cobertos:
- ✅ Loading spinner
- ✅ Timeout 10s + retry
- ✅ Contact header com status badges
- ✅ Banner de alerta (sem Lead ID)
- ✅ Seleção múltipla
- ✅ Envio para webhook
- ✅ Estados de sucesso/erro

### Inspeção de Network

No DevTools → Network tab:
1. Clique "Enviar ao Ziptime"
2. Procure pelo POST request
3. Verifique o payload no Request body
4. Verifique a resposta (200 OK = sucesso)

---

## Deploy em Produção

### Variáveis de ambiente necessárias

- `VITE_N8N_SAVE_CRM_URL`: URL do webhook n8n (interna Docker em produção)
- `VITE_WEBHOOK_SECRET`: Secret compartilhado com o n8n (gerar com: `openssl rand -hex 32`)

### Build e deploy

1. Copiar `.env.example` para `.env` e preencher os valores
2. `docker build -t chatwoot-ziptime-app .`
3. `docker run -p 3000:80 chatwoot-ziptime-app`

### No EasyPanel

1. Criar novo serviço → App
2. Apontar para o repositório
3. Build command: (vazio — o Dockerfile já faz tudo)
4. Adicionar as variáveis de ambiente no painel do EasyPanel
5. A URL gerada pelo EasyPanel é a que deve ser registrada no Chatwoot
   em: Settings → Integrations → Dashboard Apps

### No n8n — validação do secret

Adicionar no início do workflow um Code node com:

```javascript
const secret = $input.first().json.headers['x-webhook-secret'];
const expected = $env.WEBHOOK_SECRET;
if (!secret || secret !== expected) {
  throw new Error('Unauthorized');
}
```

Configurar `WEBHOOK_SECRET` nas variáveis de ambiente do container n8n
com o mesmo valor do `VITE_WEBHOOK_SECRET` do frontend.

---

## 🚀 Deploy

### Com EasyPanel (Recomendado)

1. Faça push para seu repositório Git
2. Em EasyPanel → Apps → Add
3. Selecione "Docker"
4. Configure:
   - **Repository**: seu repo Git
   - **Dockerfile**: caminho do Dockerfile
   - **Port**: 80
   - **Environment**: adicione `VITE_N8N_SAVE_CRM_URL`

### Com Docker Compose

```yaml
version: '3'
services:
  chatwoot-app:
    build: .
    ports:
      - "8080:80"
    environment:
      - VITE_N8N_SAVE_CRM_URL=https://seu-webhook-n8n.com/path
```

```bash
docker-compose up -d
```

### Com Nginx Reverse Proxy

```nginx
location /chatwoot-ziptime {
    proxy_pass http://localhost:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

---

## 🐛 Troubleshooting

### "Não foi possível carregar os dados da conversa"

- Verifique se o iframe está habilitado no Chatwoot
- Confira se a URL está correta em Settings → Integrations → Dashboard Apps
- Verifique console.log (DevTools) para mais detalhes

### "Lead ID do Ziptime não encontrado"

- Edite o contato no Chatwoot
- Adicione `custom_attributes.ziptime_lead_id`
- Recarregue a conversa (botão ↻)

### Webhook não recebe requisição

- Confira `VITE_N8N_SAVE_CRM_URL` em `.env`
- Verifique Network tab (DevTools) para ver o request
- Certifique-se que webhook n8n está ativo
- Teste com webhook.site para debug

### Mensagens não aparecem

- Certifique-se que `private === false` nas mensagens
- Verifique se há mensagens na conversa (simulador mostra 5)

---

## 📄 Licença

MIT

---

## 💬 Suporte

Para dúvidas ou issues, verifique:
1. O arquivo `scripts/simulate-chatwoot.js` para instruções detalhadas
2. DevTools Console (F12) para erros
3. DevTools Network tab para inspeccionar requisições

---

## 🔄 Atualizações Futuras

Possíveis melhorias:
- [ ] Integração com API do Ziptime diretamente (sem n8n intermediário)
- [ ] Filtros avançados de mensagens (por tipo, data)
- [ ] Edição de atributos do contato
- [ ] Histórico de envios
- [ ] Autenticação OAuth no webhook

---

**Desenvolvido com ❤️ para integração Chatwoot ↔️ Ziptime CRM**
