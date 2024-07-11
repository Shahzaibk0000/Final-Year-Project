import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as echarts from "echarts";

const PredictiveLineChart = ({ chartData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);

    // Extract dates and predicted patients from chartData
    const dates = chartData.map((item) => item.Date);
    const predictedPatients = chartData.map((item) => item.PredictedPatients);

    const option = {
      xAxis: {
        type: "category",
        data: dates,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: predictedPatients,
          type: "line",
          smooth: true,
        },
      ],
    };

    if (option && typeof option === "object") {
      myChart.setOption(option);
    }

    const handleResize = () => {
      myChart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      myChart.dispose();
    };
  }, [chartData]);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        position: "relative",
        height: "74vh",
        overflow: "hidden",
      }}
    />
  );
};

PredictiveLineChart.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      Date: PropTypes.string.isRequired,
      OxygenCylindersRequired: PropTypes.number.isRequired,
      PredictedPatients: PropTypes.number.isRequired,
      VentilatorsRequired: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default PredictiveLineChart;
