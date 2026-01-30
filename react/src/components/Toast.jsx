export default function Toast({ message, type = 'success' }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-slideUp">
      <div className={`px-6 py-4 rounded-lg shadow-xl text-sm font-medium ${
        type === 'success' 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
      }`}>
        {message}
      </div>
    </div>
  );
}
