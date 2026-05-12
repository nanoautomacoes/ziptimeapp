import { useState, useEffect, useRef } from 'react';

const TIMEOUT_MS = 10000;

export function useChatwootContext() {
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const timeoutRef = useRef(null);

  const startTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      setTimedOut(true);
    }, TIMEOUT_MS);
  };

  const retry = () => {
    setContext(null);
    setLoading(true);
    setTimedOut(false);
    window.parent.postMessage('chatwoot-dashboard-app:fetch-info', '*');
    startTimeout();
  };

  useEffect(() => {
    const handleMessage = (event) => {
      // Log ALL messages for debugging
      console.log('RAW postMessage:', {
        origin: event.origin,
        dataType: typeof event.data,
        data: event.data
      });

      let data = event.data;

      // Se for string que não começa com {, ignorar
      if (typeof data === 'string') {
        if (!data.startsWith('{')) return;
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      // Validar estrutura do appContext
      if (!data || data.event !== 'appContext') return;
      if (!data.data?.conversation || !data.data?.contact || !data.data?.currentAgent) return;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setContext(data.data);
      setLoading(false);
      setTimedOut(false);
    };

    window.addEventListener('message', handleMessage);
    window.parent.postMessage('chatwoot-dashboard-app:fetch-info', '*');
    startTimeout();

    return () => {
      window.removeEventListener('message', handleMessage);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { context, loading, timedOut, retry };
}