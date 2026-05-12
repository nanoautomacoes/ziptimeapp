/**
 * Faz parse seguro de evento postMessage do Chatwoot
 * @param {MessageEvent} event - Evento postMessage
 * @returns {Object|null} - Dados parseados ou null se inválido
 */
export function parseEventData(event) {
  try {
    // Se data for string, fazer JSON.parse
    let data = event.data;
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    // Validar estrutura
    if (!data || typeof data !== 'object') {
      return null;
    }

    if (data.event !== 'appContext') {
      return null;
    }

    const { conversation, contact, currentAgent } = data.data;
    if (!conversation || !contact || !currentAgent) {
      return null;
    }

    return data.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Erro ao fazer parse do evento Chatwoot:', error);
    }
    return null;
  }
}

/**
 * Formata timestamp unix (segundos) para string "HH:mm dd/MM"
 * @param {number} unixTimestamp - Timestamp em segundos
 * @returns {string} - Data formatada
 */
export function formatDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit'
  });

  const parts = formatter.formatToParts(date);
  const values = {};

  parts.forEach(part => {
    if (part.type !== 'literal') {
      values[part.type] = part.value;
    }
  });

  return `${values.hour}:${values.minute} ${values.day}/${values.month}`;
}

/**
 * Converte unix timestamp para ISO string
 * @param {number} unixTimestamp - Timestamp em segundos
 * @returns {string} - ISO 8601 string
 */
export function formatToISO(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return date.toISOString();
}
