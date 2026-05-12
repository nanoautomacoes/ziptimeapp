import { useState, useEffect } from 'react';
import { parseEventData } from '../utils/formatters.js';

const TIMEOUT_MS = 10000; // 10 segundos

/**
 * Hook para escutar e gerenciar contexto do Chatwoot via postMessage
 * @returns {{context: Object|null, loading: boolean, timedOut: boolean, retry: function}}
 */
export function useChatwootContext() {
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const requestContext = () => {
    if (import.meta.env.DEV) {
      console.log('Solicitando contexto do Chatwoot...');
    }
    window.parent.postMessage('chatwoot-dashboard-app:fetch-info', '*');
  };

  const handleMessage = (event) => {
    const data = parseEventData(event);

    if (!data) {
      return;
    }

    if (import.meta.env.DEV) {
      console.log('Contexto do Chatwoot recebido:', data);
    }

    setContext(data);
    setLoading(false);
    setTimedOut(false);

    // Limpar timeout se estiver pendente
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  const retry = () => {
    setContext(null);
    setLoading(true);
    setTimedOut(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    requestContext();
  };

  useEffect(() => {
    // Fazer requisição inicial
    requestContext();

    // Configurar listener
    window.addEventListener('message', handleMessage);

    // Configurar timeout
    const id = setTimeout(() => {
      setLoading(false);
      setTimedOut(true);
      if (import.meta.env.DEV) {
        console.warn('Timeout ao aguardar contexto do Chatwoot');
      }
    }, TIMEOUT_MS);

    setTimeoutId(id);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
      if (id) {
        clearTimeout(id);
      }
    };
  }, []);

  return { context, loading, timedOut, retry };
}
