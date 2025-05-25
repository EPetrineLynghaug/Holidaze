import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const formatTooltip = React.useCallback((value) => [value, "Bookings"], []);

const LineChartComponent = React.memo(function LineChartComponent({
  data = [],
  dataKey = "count",
}) {
  const strokeColor = "#9333EA";
  const gradientId = "purpleGradient";

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9333EA" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#9333EA" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#4B5563", fontSize: 12 }}
        />
        <YAxis
          allowDecimals={false}
          domain={[0, "dataMax + 1"]}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#4B5563", fontSize: 12 }}
        />
        <Tooltip
          cursor={{ stroke: strokeColor, strokeWidth: 1, opacity: 0.1 }}
          formatter={formatTooltip}
        />
        <Area
          type="linear"
          dataKey={dataKey}
          stroke="none"
          fill={`url(#${gradientId})`}
          fillOpacity={1}
          isAnimationActive={false}
        />
        <Line
          type="linear"
          dataKey={dataKey}
          stroke={strokeColor}
          strokeWidth={2}
          dot={data.length > 50 ? false : { r: 3, stroke: strokeColor, strokeWidth: 2, fill: "#fff" }}
          activeDot={data.length > 50 ? false : { r: 5 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

export default LineChartComponent;
