import {
  Cell,
  Pie,
  PieChart,
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type TooltipPayload = ReadonlyArray<number>;

type Coordinate = {
  x: number;
  y: number;
};

type PieSectorData = {
  percent?: number;
  name?: string | number;
  midAngle?: number;
  middleRadius?: number;
  tooltipPosition?: Coordinate;
  value?: number;
  paddingAngle?: number;
  dataKey?: string;
  payload?: number;
  tooltipPayload?: ReadonlyArray<TooltipPayload>;
};

type GeometrySector = {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
};

type PieLabelProps = PieSectorData &
  GeometrySector & {
    tooltipPayload?: number;
  };

const data = [
  {
    id: "New customer",
    name: "New customers",
    value: 130,
  },
  {
    id: "Old customer",
    name: "Old customers",
    value: 70,
  },
];

const repeatIntervalData = [
  {
    interval: "0-7 days",
    new: "4000",
    old: "2400",
    count: "2400",
  },
  {
    interval: "8-14 days",
    new: "3000",
    old: "1398",
    count: "2210",
  },
  {
    interval: "15-21 days",
    new: "2000",
    old: "9800",
    count: "2290",
  },
  // {
  //   interval: "22-30 days",
  //   new: "2780",
  //   old: "3980",
  //   count: "2000",
  // },
];

const RADIAN = Math.PI / 180;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function Analytics() {
  return (
    <>
      <PageBreadcrumb pageTitle="Customer Analytics" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {/* <!-- NEW VS OLD CUSTOMERS --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h3 className="text-black">New vs Old Customers</h3>

          <div className="flex items-end justify-between mt-5 w-full">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-row justify-items-start">
              <p className="whitespace-nowrap">🔵 New Customers</p>
              <p className="whitespace-nowrap">🟢 Old Customers</p>
            </div>
          </div>
        </div>
        {/* <!-- Metric Item End --> */}

        {/* <!-- PURCHASE INTERVAL --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h3 className="text-black">Purchase Interval</h3>
          <div className=" mt-5 w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={repeatIntervalData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="interval" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="new"
                  fill="#8884d8"
                  activeBar={<Rectangle fill="pink" stroke="blue" />}
                />
                <Bar
                  dataKey="old"
                  fill="#82ca9d"
                  activeBar={<Rectangle fill="gold" stroke="purple" />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GEO HEATMAP */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 className="text-black">Geo heatmap</h3>
          </div>
        </div>
      </div>
    </>
  );
}
