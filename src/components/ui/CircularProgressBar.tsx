import React from "react";

type CircularProgressBarProps = {
  progress: number; // Valor entre 0 e 100
  size?: number; // Tamanho do círculo em pixels
  strokeWidth?: number; // Largura do traço
};

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  progress,
  size = 100,
  strokeWidth = 8,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-fit h-fit flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-gray-300 fill-transparent"
          strokeWidth={strokeWidth}
        />

        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-blue-500 fill-transparent transition-all duration-300 ease-out"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-lg font-bold text-blue-500">{progress}%</span>
    </div>
  );
};

export default CircularProgressBar;
