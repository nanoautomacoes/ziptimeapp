export function ContactHeader({ contact, conversation, onRefresh, localLeadId, setLocalLeadId }) {
  const getStatusBadgeStyle = () => {
    const baseClasses = 'inline-block px-3 py-1 rounded-full text-xs font-medium text-white';
    switch (conversation.status) {
      case 'open':
        return `${baseClasses}` + ' bg-green-600';
      case 'pending':
        return `${baseClasses}` + ' bg-orange-600';
      case 'resolved':
        return `${baseClasses}` + ' bg-gray-500';
      default:
        return `${baseClasses}` + ' bg-gray-500';
    }
  };

  const getStatusLabel = () => {
    switch (conversation.status) {
      case 'open':
        return 'Aberta';
      case 'pending':
        return 'Pendente';
      case 'resolved':
        return 'Resolvida';
      default:
        return conversation.status;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900 mb-1">{contact.name}</h2>
          <div className="text-xs text-gray-600 space-y-1">
            {contact.email && <div>{contact.email}</div>}
            {contact.phone_number && <div>{contact.phone_number}</div>}
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="ml-2 p-1 hover:bg-gray-100 rounded-md transition-colors"
          title="Atualizar"
        >
          <span className="text-lg">↻</span>
        </button>
      </div>
      <div className="flex items-center justify-between">
        <span className={getStatusBadgeStyle()}>
          {getStatusLabel()}
        </span>
        <div className="flex items-center gap-2">
          {contact.custom_attributes?.ziptime_lead_id ? (
            <div className="text-xs text-gray-600">
              Ziptime ID: <span className="font-medium">{contact.custom_attributes.ziptime_lead_id}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <input
                type="text"
                value={localLeadId}
                onChange={(e) => setLocalLeadId(e.target.value)}
                placeholder="ID do lead no Ziptime"
                className="px-2 py-1 border border-yellow-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
