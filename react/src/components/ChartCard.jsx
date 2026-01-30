export default function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      {children}
    </div>
  );
}
