import React from 'react';

const GaugeChart = ({ percentage, color, labelColor }) => {
  const radius = 70; // Radius of the arc
  const strokeWidth = 15; // Thickness of the arc
  const effectiveRadius = radius - strokeWidth / 2; // Radius for the stroke
  const fullCircumference = 2 * Math.PI * effectiveRadius;
  const semiCircumference = fullCircumference / 2;

  // Calculate the stroke-dashoffset for the progress arc.
  // The logic for proportion remains the same as it correctly fills for a semi-circle.
  const progressOffset = semiCircumference * (1 - percentage / 100);

  return (
    <div className="relative flex flex-col items-center justify-center w-full" style={{ height: `${radius + strokeWidth / 2 + 30}px` }}>
      <svg
        width={radius * 2}
        height={radius + strokeWidth / 2 + 10}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        
        
        className="transform -rotate-180" // Rotate 90 degrees anti-clockwise from -90
      >
        {/* Background arc */}
        <circle
          cx={radius}
          cy={radius}
          r={effectiveRadius}
          fill="none"
          stroke="#E0E0E0" 
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={fullCircumference}
          strokeDashoffset={semiCircumference} 
          className="origin-center"
        />

        {/* Progress arc */}
        <circle
          cx={radius}
          cy={radius}
          r={effectiveRadius}
          fill="none"
          stroke={color} // Dynamic color for the progress
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={fullCircumference}
          // The progressOffset controls how much of the semi-circle is filled.
          // Add semiCircumference to shift the drawing start point for the semi-circle.
          strokeDashoffset={progressOffset + semiCircumference}
          className="origin-center transition-all duration-700 ease-out" // Smooth transition
        />
      </svg>

      {/* Percentage text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2" style={{ marginTop: '-15px' }}>
        <p className={`text-4xl font-bold ${labelColor}`}>{percentage}%</p>
      </div>

      {/* 0% and 100% labels at the bottom corners */}
      <div className="absolute w-full flex justify-between px-2 text-gray-500 text-sm" style={{ bottom: '5px' }}>
        {/* These labels are relative to the SVG container, not rotated with the SVG content */}
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

const MetricsCard = ({ metrics }) => {
  if (!metrics) {
    return <p className="text-center text-gray-600 p-4">No metrics available.</p>;
  }

  const { otdPercent, spyPercent } = metrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* OTD Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-3 text-blue-700">On-Time Delivery (OTD)</h3>
        {/* Pass percentage as a number, not string, for calculation */}
        <GaugeChart percentage={parseFloat(otdPercent)} color="#3B82F6" labelColor="text-blue-600" />
        <p className="text-gray-600 mt-4 text-center">Percentage of tasks completed by planned completion date.</p>
      </div>

      {/* SPY Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-3 text-purple-700">Software Product Yield (SPY)</h3>
        {/* Pass percentage as a number, not string, for calculation */}
        <GaugeChart percentage={parseFloat(spyPercent)} color="#A855F7" labelColor="text-purple-600" />
        <p className="text-gray-600 mt-4 text-center">Percentage of tasks approved by PQC.</p>
      </div>
    </div>
  );
};

export default MetricsCard;