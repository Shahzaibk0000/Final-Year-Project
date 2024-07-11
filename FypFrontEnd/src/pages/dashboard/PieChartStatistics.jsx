import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import PropTypes from "prop-types";

const PieChartStatistics = ({ chartData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = document.getElementById("main");
    chartRef.current = echarts.init(chartDom);
    const option = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "5%",
        left: "center",
      },
      series: [
        {
          name: "Population Statistics",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: chartData.deathPatient, name: "Decreased Patients" },
            { value: chartData.recoveredPatient, name: "Recovered Patients" },
          ],
        },
      ],
    };
    chartRef.current.setOption(option);
    const handleResize = () => {
      chartRef.current.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [chartData]);
  return (
    <div
      id="main"
      style={{
        width: "100%",
        position: "relative",
        height: "70vh",
        overflow: "hidden",
      }}
    />
  );
};

PieChartStatistics.propTypes = {
  chartData: PropTypes.object.isRequired,
};
export default PieChartStatistics;
