import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import PropTypes from "prop-types";

const BarRaceSymptoms = ({ data }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(Array(18).fill(0)); // Assuming 18 initial values

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const option = {
      grid: {
        left: "2%", // Adjust the left padding to accommodate yAxis labels
        right: "12%",
        containLabel: true,
      },
      xAxis: {
        max: "dataMax",
      },
      yAxis: {
        type: "category",
        data: [
          "Fever",
          "High Fever",
          "Hypertension",
          "Cardiac Count",
          "Weakness/Pain",
          "Respiratory",
          "Cancer",
          "Thyroid",
          "Prostate",
          "Kidney",
          "Neuro",
          "Nausea",
          "Asymptomatic",
          "Gastrointestinal",
          "Ortho",
          "Respiratory CD",
          "Cardiacs CD",
          "Kidney CD",
        ],
        inverse: true,
        animationDuration: 3000,
        animationDurationUpdate: 300,
      },
      series: [
        {
          realtimeSort: true,
          name: "Symptoms",
          type: "bar",
          data: chartData,
          label: {
            show: true,
            position: "right",
            valueAnimation: true,
          },
        },
      ],
      legend: {
        show: true,
      },
      animationDuration: 300,
      animationDurationUpdate: 300,
      animationEasing: "linear",
      animationEasingUpdate: "linear",
    };

    chartInstance.setOption(option);

    const newData = data
      ? [
          data.feverCount,
          data.highFeverCount,
          data.hypertensionCount,
          data.cardiacCount,
          data.weaknessPainCount,
          data.respiratoryCount,
          data.cancerCount,
          data.thyroidCount,
          data.prostateCount,
          data.kidneyCount,
          data.neuroCount,
          data.nauseaCount,
          data.asymptomaticCount,
          data.gastrointestinalCount,
          data.orthoCount,
          data.respiratoryCDCount,
          data.cardiacsCDCount,
          data.kidneyCDCount,
        ]
      : [];

    const interval = setInterval(() => {
      const updatedData = chartData.map((value, index) => {
        if (value < newData[index]) {
          return value + Math.floor(Math.random() * 100);
        } else {
          return newData[index];
        }
      });

      setChartData(updatedData);

      if (JSON.stringify(updatedData) === JSON.stringify(newData)) {
        clearInterval(interval);
      }
    }, 1000);

    // Stop animation and show final data after 40 seconds
    setTimeout(() => {
      clearInterval(interval);
      setChartData(newData);
    }, 20000); // 40 seconds

    return () => {
      clearInterval(interval);
    };
  }, [data, chartData]);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        position: "relative",
        height: "71vh",
        overflow: "hidden",
      }}
    />
  );
};

BarRaceSymptoms.propTypes = {
  data: PropTypes.object.isRequired,
};

export default BarRaceSymptoms;
