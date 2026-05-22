const WEBHOOK_URL = import.meta.env.VITE_N8N_SAVE_CRM_URL;

export async function saveToCRM({
  ziptime_lead_id,
  chatwoot_conversation_id,
  chatwoot_contact_id,
  contact_name,
  contact_email,
  contact_phone,
  agent_name,
  sent_at,
  selected_messages,
  needs_chatwoot_update = false
}) {
  if (!WEBHOOK_URL) {
    throw new Error('URL do webhook n8n não configurada. Adicione VITE_N8N_SAVE_CRM_URL ao .env');
  }

  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Secret': import.meta.env.VITE_WEBHOOK_SECRET || ''
    },
    body: JSON.stringify({
      action: 'save_messages',
      ziptime_lead_id,
      needs_chatwoot_update,
      chatwoot_conversation_id,
      chatwoot_contact_id,
      contact_name,
      contact_email,
      contact_phone,
      agent_name,
      sent_at,
      selected_messages
    })
  });

  if (!response.ok) throw new Error('Erro ao enviar mensagens');
  return await response.json();
}
