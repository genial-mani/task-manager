"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PriorityDoughnutChartProps {
  priorities: { P1: number; P2: number; P3: number; P4: number; P5: number };
}

const PriorityDoughnutChart: React.FC<PriorityDoughnutChartProps> = ({ priorities }) => {
  const data = {
    labels: ["P1", "P2", "P3", "P4", "P5"],
    datasets: [
      {
        label: "No. of Tasks",
        data: [priorities.P1, priorities.P2, priorities.P3, priorities.P4, priorities.P5],
        backgroundColor: ["red", "orange", "blue", "yellow", "white"],
        hoverOffset: 20,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default PriorityDoughnutChart;
