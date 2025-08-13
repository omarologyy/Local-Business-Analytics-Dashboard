import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
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

import stocks from "../../../src/stocks.json";
import Lottie from "lottie-react";
const productsData = [
  {
    interval: "Product A",
    top: "5000",
    low: "3500",
  },
  {
    interval: "Product B",
    top: "4200",
    low: "1500",
  },
  {
    interval: "Product C",
    top: "6000",
    low: "1000",
  },
];

export default function Performance() {
  return (
    <div>
      <PageMeta
        title="UmarNova"
        description="A business dashboard that aggregates sales, customer retention, and market trends."
      />
      <PageBreadcrumb pageTitle="Product Performance" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <p className="text-black">Top and low performing products</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={productsData}
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
                dataKey="top"
                fill="#8884d8"
                activeBar={<Rectangle fill="pink" stroke="blue" />}
              />
              <Bar
                dataKey="low"
                fill="#82ca9d"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-6">
          <Lottie animationData={stocks} />
          <p className="text-center">Stock Level Indicator</p>
        </div>
      </div>
    </div>
  );
}
