import { useState, useEffect } from 'react';
import { useChatwootContext } from './hooks/useChatwootContext.js';
import { saveToCRM } from './services/n8n.js';
import { formatToISO } from './utils/formatters.js';
import { LoadingSpinner } from './components/LoadingSpinner.jsx';
import { ErrorState } from './components/ErrorState.jsx';
import { ContactHeader } from './components/ContactHeader.jsx';
import { ZiptimeAlert } from './components/ZiptimeAlert.jsx';
import { MessageList } from './components/MessageList.jsx';
import { SendButton } from './components/SendButton.jsx';

export default function App() {
  const { context, loading, timedOut, retry } = useChatwootContext();
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sendStatus, setSendStatus] = useState('idle');
  const [sendError, setSendError] = useState('');

  // Se componente unmount, limpar estado
  useEffect(() => {
    return () => {
      setSelectedIds(new Set());
      setSendStatus('idle');
      setSendError('');
    };
  }, []);

  // Se loading ou timedOut, mostrar estados apropriados
  if (loading && !timedOut) {
    return <LoadingSpinner />;
  }

  if (timedOut) {
    return <ErrorState onRetry={retry} />;
  }

  if (!context) {
    return <LoadingSpinner />;
  }

  const { conversation, contact, currentAgent } = context;
  const ziptime_lead_id = contact.custom_attributes?.ziptime_lead_id;
  const hasZiptimeId = Boolean(ziptime_lead_id);

  // Funções de manipulação
  const handleToggleMessage = (messageId) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(messageId)) {
      newSelectedIds.delete(messageId);
    } else {
      newSelectedIds.add(messageId);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleSelectAll = () => {
    const allIds = new Set(
      conversation.messages
        .filter(msg => !msg.private)
        .map(msg => msg.id)
    );
    setSelectedIds(allIds);
  };

  const handleClearAll = () => {
    setSelectedIds(new Set());
  };

  const handleRefresh = () => {
    retry();
    setSelectedIds(new Set());
    setSendStatus('idle');
    setSendError('');
  };

  const handleSend = async () => {
    if (!hasZiptimeId || selectedIds.size === 0) {
      return;
    }

    setSendStatus('loading');
    setSendError('');

    try {
      const selectedMessages = conversation.messages.filter(msg =>
        selectedIds.has(msg.id)
      );

      const cleanMessages = selectedMessages
        .filter(msg =>
          msg.message_type !== 2 &&
          msg.private !== true &&
          msg.content &&
          msg.sender?.name !== 'Sistema'
        )
        .map(msg => ({
          id: msg.id,
          content: msg.content,
          message_type: msg.message_type,
          sender_name: msg.sender?.name || 'Sistema',
          sent_at: formatToISO(msg.created_at)
        }));

      await saveToCRM({
        ziptime_lead_id: contact.custom_attributes?.ziptime_lead_id || '',
        chatwoot_conversation_id: conversation.id,
        chatwoot_contact_id: contact.id,
        contact_name: contact.name,
        contact_email: contact.email || '',
        contact_phone: contact.phone_number || '',
        agent_name: currentAgent.name,
        sent_at: new Date().toISOString(),
        selected_messages: cleanMessages
      });

      setSendStatus('success');

      // Limpar após 3 segundos
      setTimeout(() => {
        setSelectedIds(new Set());
        setSendStatus('idle');
      }, 3000);
    } catch (error) {
      setSendError(error.message || 'Erro ao enviar. Tente novamente.');
      setSendStatus('error');
      if (import.meta.env.DEV) {
        console.error('Erro ao enviar para n8n:', error);
      }
    }
  };

  const handleRetry = () => {
    setSendStatus('idle');
    setSendError('');
  };

  return (
    <div className="min-h-screen p-3 font-inter" style={{ backgroundColor: 'rgb(243, 244, 246)' }}>
      <div className="max-w-2xl mx-auto">
        <ContactHeader
          contact={contact}
          conversation={conversation}
          onRefresh={handleRefresh}
        />

        <ZiptimeAlert show={!hasZiptimeId} />

        <MessageList
          messages={conversation.messages}
          selectedIds={selectedIds}
          onToggle={handleToggleMessage}
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
        />

        <SendButton
          selectedCount={selectedIds.size}
          disabled={!hasZiptimeId || selectedIds.size === 0}
          onSend={handleSend}
          status={sendStatus}
          errorMsg={sendError}
          onRetry={handleRetry}
          onSuccess={() => {
            setSelectedIds(new Set());
            setSendStatus('idle');
          }}
        />
      </div>
    </div>
  );
}
