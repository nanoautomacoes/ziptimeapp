import { useState } from 'react';

export function ZiptimeAlert({ show, contactId, onSaveLeadId }) {
  const [leadId, setLeadId] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  if (!show) {
    return null;
  }

  const handleSave = async () => {
    if (!leadId.trim()) {
      setError('ID do lead não pode estar vazio');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const result = await onSaveLeadId(leadId.trim());

      if (result.success) {
        setStatus('success');
        setLeadId('');
        setTimeout(() => {
          setStatus('idle');
        }, 3000);
      } else {
        setError(result.error || 'Erro ao salvar Lead ID');
        setStatus('error');
      }
    } catch (err) {
      setError(err.message || 'Erro ao salvar Lead ID');
      setStatus('error');
    }
  };

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const showError = status === 'error' && error;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0">⚠️</span>
        <div className="flex-1 min-w-0">
          {isSuccess ? (
            <p className="text-sm text-green-700 font-medium">
              ✓ ID salvo! Recarregando...
            </p>
          ) : (
            <>
              <p className="text-sm text-yellow-800 mb-3">
                <strong>Lead ID do Ziptime não encontrado</strong> neste contato.
                Adicione o ID abaixo:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={leadId}
                  onChange={(e) => {
                    setLeadId(e.target.value);
                    setError('');
                  }}
                  placeholder="ID do lead no Ziptime (ex: LEAD_400)"
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 border border-yellow-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSave}
                  disabled={isLoading || !leadId.trim()}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
              {showError && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
