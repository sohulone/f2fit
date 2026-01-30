export default function HabitButton({ emoji, label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all ${
        isActive
          ? 'border-green-500 bg-green-50 text-green-700'
          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
      }`}
    >
      {emoji} {label}
    </button>
  );
}
