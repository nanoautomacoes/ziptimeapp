import { MessageCard } from './MessageCard.jsx';

export function MessageList({
  messages,
  selectedIds,
  onToggle,
  onSelectAll,
  onClearAll
}) {
  // Filtrar mensagens privadas (private === false), excluir mensagens de sistema (message_type === 2) e ordenar por created_at
  const visibleMessages = messages.filter(msg =>
    msg.message_type !== 2 &&
    msg.private !== true &&
    msg.content &&
    msg.sender != null
  )
  .sort((a, b) => a.created_at - b.created_at);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
      {/* Botões de ação */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={onSelectAll}
          disabled={visibleMessages.length === 0}
          className="text-xs font-medium px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Selecionar tudo
        </button>
        <button
          onClick={onClearAll}
          disabled={selectedIds.size === 0}
          className="text-xs font-medium px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Limpar seleção
        </button>
      </div>

      {/* Lista de mensagens com scroll */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
        {visibleMessages.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-4">
            Nenhuma mensagem disponível
          </p>
        ) : (
          visibleMessages.map(msg => (
            <MessageCard
              key={msg.id}
              message={msg}
              isSelected={selectedIds.has(msg.id)}
              onToggle={onToggle}
            />
          ))
        )}
      </div>
    </div>
  );
}
