import { useParentSize } from '@visx/responsive';
import { scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';
import React from 'react';
import { BarChartProps } from './types';


const BarChart: React.FC<BarChartProps<any>> = ({ barData, sameYScale, 
  // startCol,
  // endCol,
  height1Col,
  height2Col
 }) => {
  const { parentRef, width = 0, height = 0 } = useParentSize();

  // Calculate the maximum bar height for scaling
  const maxBarHeight1 = Math.max(...barData.map(d => d[height1Col]));
  const maxBarHeight2 = height2Col ? Math.max(...barData.map(d => d[height2Col])) : undefined;
  const maxBarHeight = sameYScale ? maxBarHeight2 ? Math.max(maxBarHeight1, maxBarHeight2) : maxBarHeight1 : null;

  // Create scales
  const yScale1 = scaleLinear({
    domain: [0, sameYScale ? maxBarHeight! : maxBarHeight1],
    range: [height, 0],
  });

  const yScale2 = scaleLinear({
    domain: [0, sameYScale ? maxBarHeight! : maxBarHeight2!],
    range: [height, 0],
  });

  const xScale = scaleLinear({
    domain: [0, barData.length],
    range: [0, width],
  });

  return (
    <div ref={parentRef} style={{ width: '100%', height: '100%' }}>
      <svg width={width} height={height}>
        {barData.map((bar, index) => (
          <React.Fragment key={index}>
            <Bar
              x={xScale(index)}
              y={yScale1(bar.height1)}
              width={xScale(1) - xScale(0) - 5}
              height={height - yScale1(bar.height1)}
              fill="blue"
            />
            <Bar
              x={xScale(index) + (xScale(1) - xScale(0)) / 2}
              y={yScale2(bar.height2)}
              width={xScale(1) - xScale(0) - 5}
              height={height - yScale2(bar.height2)}
              fill="none"
              stroke="red"
              strokeWidth={2}
            />
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
};

export default BarChart;