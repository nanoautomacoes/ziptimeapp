export function SendButton({
  selectedCount,
  disabled,
  localLeadId,
  onSend,
  status = 'idle',
  errorMsg = '',
  onRetry,
  onSuccess
}) {
  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError = status === 'error';
  const isDisabled = disabled || !localLeadId || isLoading;

  const buttonClasses = isDisabled
    ? 'bg-gray-400 cursor-not-allowed'
    : 'bg-blue-600 hover:bg-blue-700 transition-colors';

  const handleClick = () => {
    if (!isDisabled) {
      onSend();
    }
  };

  return (
    <div>
      {/* Banner de sucesso */}
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
          <div className="flex items-center">
            <span className="text-lg mr-2">✓</span>
            <p className="text-sm text-green-800 font-medium">
              Enviado com sucesso ao Ziptime!
            </p>
          </div>
        </div>
      )}

      {/* Banner de erro */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
          <div className="flex items-start">
            <span className="text-lg mr-2">✕</span>
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium">{errorMsg}</p>
              <button
                onClick={onRetry}
                className="text-xs text-red-600 hover:text-red-700 font-medium mt-2"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botão de envio */}
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`w-full py-2 px-4 rounded-md text-white font-medium text-sm transition-colors ${buttonClasses}`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="w-4 h-4 mr-2 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                opacity="0.2"
              />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            Enviando...
          </span>
        ) : (
          `Enviar ao Ziptime (${selectedCount} selecionadas)`
        )}
      </button>
    </div>
  );
}
