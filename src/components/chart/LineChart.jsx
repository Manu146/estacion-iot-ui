//import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart({ formattedData, variable }) {
  const { dataPoints, labels } = formattedData;
  const data = {
    labels,
    datasets: [
      {
        label: variable,
        data: dataPoints,
        borderColor: "#7bf1a8",
        backgroundColor: "#0c4d2b",
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
      },
    },
  };
  return (
    <div className="">
      <Line options={options} data={data} />
    </div>
  );
}
