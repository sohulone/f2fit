export default function WellnessTable({ data }) {
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day).toLocaleDateString('es-ES');
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Energía</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emoción</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hábitos</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(item.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.physical_energy}/5
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.emotional_state}/5
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="flex gap-2">
                  {item.habits.exercise?.completed && <span>🏃</span>}
                  {item.habits.hydration?.completed && <span>💧</span>}
                  {item.habits.sleep?.completed && <span>😴</span>}
                  {item.habits.nutrition?.completed && <span>🥗</span>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
