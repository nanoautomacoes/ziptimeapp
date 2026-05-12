import { formatDate } from '../utils/formatters.js';

export function MessageCard({ message, isSelected, onToggle }) {
  const isIncoming = message.message_type === 0;

  const handleClick = () => {
    onToggle(message.id);
  };

  const cardContainerClasses = isIncoming ? 'flex justify-start' : 'flex justify-end';

  const cardClasses = isIncoming
    ? 'max-w-xs bg-gray-100 border border-gray-300'
    : 'max-w-xs bg-blue-50 border border-blue-200';

  const selectedBg = isSelected ? (isIncoming ? 'bg-gray-200' : 'bg-blue-100') : '';

  return (
    <div className={`${cardContainerClasses} mb-3`}>
      <div
        onClick={handleClick}
        className={`${cardClasses} ${selectedBg} rounded-lg p-3 cursor-pointer transition-colors hover:opacity-80 relative group`}
      >
        {/* Checkbox */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            className="w-4 h-4 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Conteúdo da mensagem */}
        <div className="pr-6">
          <div className="text-xs font-semibold text-gray-700 mb-1">
            {message.sender.name}
          </div>
          <div className="text-gray-800 text-sm mb-2 break-words">
            {message.content}
          </div>
          <div className="text-xs text-gray-500">
            {formatDate(message.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
}
