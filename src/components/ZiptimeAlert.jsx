export function ZiptimeAlert({ show }) {
  if (!show) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
      <div className="flex items-start">
        <span className="text-lg mr-3">⚠️</span>
        <div className="flex-1">
          <p className="text-sm text-yellow-800">
            <strong>Lead ID do Ziptime não encontrado</strong> neste contato.
            Configure o campo <code className="bg-yellow-100 px-2 py-1 rounded text-xs">custom_attributes.ziptime_lead_id</code> no Chatwoot.
          </p>
        </div>
      </div>
    </div>
  );
}
