import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import PropTypes from "prop-types";

const BarChart = ({ BarChartdata }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: BarChartdata.xaxis,
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            rotate: 40, // Rotate labels if you need to
          },
        },
      ],

      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Patients",
          type: "bar",
          barWidth: "60%",
          data: BarChartdata.yaxis,
        },
      ],
    };

    myChart.setOption(option);

    const handleResize = () => {
      myChart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [BarChartdata]);

  return (
    <div
      ref={chartRef}
      id="main"
      style={{
        width: "95%",
        position: "relative",
        height: "61vh",
        overflow: "hidden",
      }}
    />
  );
};

BarChart.propTypes = {
  BarChartdata: PropTypes.shape({
    xaxis: PropTypes.arrayOf(PropTypes.string).isRequired,
    yaxis: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};
export default BarChart;
