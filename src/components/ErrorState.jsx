export function ErrorState({ onRetry }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-sm w-full mx-auto px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="text-2xl text-red-600 mr-4">⚠️</div>
            <div className="flex-1">
              <h2 className="font-semibold text-red-900 mb-2">
                Não foi possível carregar os dados da conversa
              </h2>
              <p className="text-sm text-red-700 mb-4">
                O Chatwoot não respondeu em 10 segundos. Verifique se o iframe está
                configurado corretamente.
              </p>
              <button
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
