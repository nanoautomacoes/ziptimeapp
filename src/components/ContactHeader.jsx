export function ContactHeader({ contact, conversation, onRefresh }) {
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
      <div>
        <span className={getStatusBadgeStyle()}>
          {getStatusLabel()}
        </span>
      </div>
    </div>
  );
}
