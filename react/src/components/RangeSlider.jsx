import './RangeSlider.css';

export default function RangeSlider({ 
  label, 
  emoji, 
  name, 
  value, 
  onChange, 
  min = 1, 
  max = 5,
  color = 'blue'
}) {
  // Mapeo de colores preestablecidos
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      label: 'text-blue-600',
      track: '#bfdbfe',
      thumb: '#3b82f6'
    },
    pink: {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      text: 'text-pink-700',
      label: 'text-pink-600',
      track: '#fbcfe8',
      thumb: '#ec4899'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      label: 'text-green-600',
      track: '#bbf7d0',
      thumb: '#10b981'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      label: 'text-purple-600',
      track: '#e9d5ff',
      thumb: '#a855f7'
    }
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className={`${colors.bg} p-4 rounded-lg border-2 ${colors.border}`}>
      <label className={`block text-sm font-bold ${colors.text} mb-3`}>
        {emoji} {label}: <span className="text-2xl">{value}</span>/{max}
      </label>
      <div className="py-2">
        <input
          type="range"
          name={name}
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className="w-full cursor-pointer"
          style={{
            color: colors.thumb,
            background: `linear-gradient(to right, ${colors.thumb} 0%, ${colors.thumb} ${((value - min) / (max - min)) * 100}%, ${colors.track} ${((value - min) / (max - min)) * 100}%, ${colors.track} 100%)`,
            height: '0.5rem',
            borderRadius: '9999px',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        />
      </div>
      <div className={`flex justify-between text-xs ${colors.label} font-medium mt-1`}>
        {Array.from({ length: max - min + 1 }, (_, i) => (
          <span key={i + min}>{i + min}</span>
        ))}
      </div>
    </div>
  );
}
