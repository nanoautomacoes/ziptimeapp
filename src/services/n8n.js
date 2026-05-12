import { formatToISO } from '../utils/formatters.js';

/**
 * Envia dados para n8n webhook para salvar/atualizar lead no Ziptime CRM
 * @param {Object} context - Contexto do Chatwoot (conversation, contact, currentAgent)
 * @param {Array} selectedMessages - Mensagens selecionadas
 * @throws {Error} - Se a requisição falhar
 */
export async function saveToCRM(context, selectedMessages) {
  const { conversation, contact, currentAgent } = context;

  const payload = {
    ziptime_lead_id: contact.custom_attributes?.ziptime_lead_id || '',
    chatwoot_conversation_id: conversation.id,
    chatwoot_contact_id: contact.id,
    contact_name: contact.name,
    contact_email: contact.email || '',
    contact_phone: contact.phone_number || '',
    agent_name: currentAgent.name,
    sent_at: new Date().toISOString(),
    selected_messages: selectedMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      message_type: msg.message_type,
      sender_name: msg.sender.name,
      sent_at: formatToISO(msg.created_at)
    }))
  };

  const webhookUrl = import.meta.env.VITE_N8N_SAVE_CRM_URL;

  if (!webhookUrl) {
    throw new Error('URL do webhook n8n não configurada. Adicione VITE_N8N_SAVE_CRM_URL ao .env');
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao enviar para n8n (${response.status}): ${errorText || response.statusText}`);
  }

  return response.json().catch(() => null);
}
