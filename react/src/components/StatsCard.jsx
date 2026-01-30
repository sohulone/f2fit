export default function StatsCard({ label, value, colorClass = 'text-blue-600' }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`text-3xl font-bold ${colorClass}`}>
        {value}
      </p>
    </div>
  );
}
