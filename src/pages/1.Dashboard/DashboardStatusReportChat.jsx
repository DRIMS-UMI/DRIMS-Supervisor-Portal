import React from "react";
import { Cell, Label, Pie, PieChart } from "recharts";
import tinycolor from "tinycolor2";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import { ResponsiveContainer } from 'recharts';
import {
  ChartTooltip,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define default data for when the real data is loading
const defaultChartData = [
  { status: "Normal Progress", students: 0, fill: '#22C55E' },
  { status: "Fieldwork", students: 0, fill: '#3B82F6' },
  { status: "Under Examination", students: 0, fill: '#EAB308' },
  { status: "Scheduled for Viva", students: 0, fill: '#EC4899' },
  { status: "Results Approved", students: 0, fill: '#14B8A6' }
];

const DashboardStatusReportChat = ({ 
  chartData = defaultChartData, 
  statusType = 'main',
  onStatusTypeChange,
  isLoading = false 
}) => {
  // Transform the data for the chart
  const transformedChartData = React.useMemo(() => {
    if (!chartData || chartData.length === 0) return defaultChartData;

    // Convert the incoming data format to match school portal format
    return chartData
      .map(item => ({
        status: item.label || item.status || 'Unknown Status',
        students: item.value || item.students || 0,
        fill: item.color || item.fill || '#22C55E'
      }))
      .filter(item => item.students > 0); // Only show non-zero values
  }, [chartData]);

  const totalStudents = React.useMemo(() => {
    return transformedChartData.reduce((acc, curr) => acc + curr.students, 0);
  }, [transformedChartData]);

  const getDarkerStroke = (fillColor) => {
    return tinycolor(fillColor).darken(15).toString();
  };
  
  const getLighterFill = (fillColor) => {
    return tinycolor(fillColor).lighten(15).toString();
  };

  return (
    <Card className="flex flex-col h-full shadow-sm rounded-lg border-0 bg-white">
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
        <div className="gap-0">
          <h3 className="text-lg font-medium text-gray-900">Status Distribution</h3>
          <p className="text-xs font-[Inter-Regular] text-muted-foreground">
            Current student status breakdown
          </p>
        </div>
        <Select value={statusType} onValueChange={onStatusTypeChange}>
          <SelectTrigger className="w-[180px] text-sm font-[Inter-Regular] text-gray-900">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="main">Student Statuses</SelectItem>
            <SelectItem value="book">Dissertation Statuses</SelectItem>
            <SelectItem value="proposal">Proposal Statuses</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="w-full aspect-square max-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : totalStudents > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg bg-white p-2 shadow-md">
                        <p className="font-semibold">{data.status}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.students} students ({((data.students / totalStudents) * 100).toFixed(1)}%)
                        </p>
                      </div>
                    );
                  }}
                />
                <Pie
                  data={transformedChartData}
                  dataKey="students"
                  nameKey="status"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={2}
                  cx="50%"
                  cy="50%"
                >
                  {transformedChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getLighterFill(entry.fill)}
                      stroke={getDarkerStroke(entry.fill)}
                    />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox) return null;
                      const { cx, cy } = viewBox;
                      return (
                        <text
                          x={cx}
                          y={cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={cx}
                            y={cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalStudents}
                          </tspan>
                          <tspan
                            x={cx}
                            y={cy + 20}
                            className="fill-muted-foreground text-sm"
                          >
                            Total Students
                          </tspan>
                        </text>
                      );
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            // Empty state
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <div className="w-32 h-32 rounded-full border-4 border-gray-200 flex items-center justify-center mb-4">
                <span className="text-gray-400">No Data</span>
              </div>
              <div className="text-sm">No student status data available</div>
              <div className="text-xs text-gray-400 mt-1">Data will appear here when students are assigned</div>
            </div>
          )}
        </div>

        {/* Legend */}
        {!isLoading && transformedChartData.length > 0 && totalStudents > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-1">
            {transformedChartData.map((entry, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div
                  className="w-3 h-3 rounded-full mt-1"
                   style={{ backgroundColor: entry.fill }}
                />
                <div className="flex flex-col w-full">
                  <span className="text-sm font-[Inter-Regular] text-gray-900">
                    {entry.status}
                  </span>
                  <span className="text-xs font-[Inter-Regular] text-muted-foreground">
                    {entry.students} ({((entry.students / totalStudents) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardStatusReportChat;