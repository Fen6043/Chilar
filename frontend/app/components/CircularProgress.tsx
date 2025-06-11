type CircularProgressProps = {
  value: number;
  size?: number; // px
  remaining?: number;
  outoff: number;
};

export default function CircularProgress({ value = 0,size = 100, remaining, outoff = 0 }: CircularProgressProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  if(value<0) value = 0;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
         className=" transition-all duration-1000 stroke-red-500"/>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className=" transition-all duration-1000 stroke-emerald-600"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">{value}%</span>
        {remaining && <span className="text-xl font-bold font-mono">{parseFloat(remaining.toFixed(2))}/{parseFloat(outoff.toFixed(2))}</span>} {/* encountered floating point precison so added toFixed*/}
      </div>
    </div>
  );
}
