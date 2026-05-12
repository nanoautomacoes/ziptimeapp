import { formatToISO } from '../utils/formatters.js';

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
  selected_messages
}) {
  if (!WEBHOOK_URL) {
    throw new Error('URL do webhook n8n não configurada. Adicione VITE_N8N_SAVE_CRM_URL ao .env');
  }

  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'save_messages',
      ziptime_lead_id,
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

export async function saveLeadId({ chatwoot_contact_id, ziptime_lead_id }) {
  if (!WEBHOOK_URL) {
    throw new Error('URL do webhook n8n não configurada. Adicione VITE_N8N_SAVE_CRM_URL ao .env');
  }

  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'save_lead_id',
      chatwoot_contact_id,
      ziptime_lead_id
    })
  });

  if (!response.ok) throw new Error('Erro ao salvar Lead ID');
  return await response.json();
}
