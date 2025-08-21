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
import { useState, useEffect } from "react";

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
  {
    interval: "Product D",
    top: "3500",
    low: "2000",
  },
  {
    interval: "Product E",
    top: "4000",
    low: "500",
  },
  {
    interval: "Product F",
    top: "5000",
    low: "2500",
  },
];

export default function Performance() {
  const [fontSize, setFontSize] = useState(12);

  useEffect(() => {
    const updateFontSize = () => {
      if (window.innerWidth < 640) {
        // Small screens
        setFontSize(8);
      } else if (window.innerWidth < 768) {
        // Medium screens
        setFontSize(10);
      } else {
        // Large screens
        setFontSize(12);
      }
    };

    updateFontSize();
    window.addEventListener("resize", updateFontSize);

    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  return (
    <div>
      <PageMeta
        title="UmarNova"
        description="A business dashboard that aggregates sales, customer retention, and market trends."
      />
      <PageBreadcrumb pageTitle="Product Performance" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
        <div className="space-y-6">
          <p className="text-black dark:text-gray-400">
            Top and low performing products
          </p>
          <div className="h-64 sm:h-80 md:h-96">
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
                <XAxis
                  dataKey="interval"
                  tick={{ fontSize: fontSize }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
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
        </div>
        <div className="space-y-6">
          <Lottie animationData={stocks} />
          <p className="text-center dark:text-gray-400">
            Stock Level Indicator
          </p>
        </div>
      </div>
    </div>
  );
}
