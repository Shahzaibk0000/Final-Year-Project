import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import PropTypes from "prop-types";

const DynamicTimeChart = ({ chartData }) => {
  const chartRef = useRef(null);
  const dataRef = useRef([...chartData]); // Use ref to keep track of data

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);
    let option;

    // Function to generate new data point based on the last data point
    function generateNewData() {
      const lastDataPoint = dataRef.current[dataRef.current.length - 1];
      const newDate = new Date(lastDataPoint[0]);
      newDate.setDate(newDate.getDate() + 1); // Example: increment date by one day
      const newValue = lastDataPoint[1] + Math.random() * 21 - 10; // Example: generate random value
      return [newDate.toISOString(), newValue];
    }

    // Function to update data array with new data point
    function updateData() {
      dataRef.current.shift(); // Remove the oldest data point
      dataRef.current.push(generateNewData()); // Add a new data point

      // Update chart with new data
      myChart.setOption({
        series: [
          {
            data: dataRef.current.map(([name, value]) => ({
              name,
              value: [name, value],
            })),
          },
        ],
      });
    }

    // Initial chart configuration
    option = {
      title: {},
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          params = params[0];
          var date = new Date(params.name);

          var monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          return (
            date.getDate() +
            "-" +
            monthNames[date.getMonth()] +
            "-" +
            date.getFullYear() +
            " | Patient : " +
            params.value[1]
          );
        },
        axisPointer: {
          animation: false,
        },
      },
      xAxis: {
        type: "time",
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: function (value) {
            const date = new Date(value);
            return `${date.getFullYear()}-${date.getMonth() + 1}`;
          },
        },
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "100%"],
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: "Provided Data",
          type: "line",
          showSymbol: false,
          data: dataRef.current.map(([name, value]) => ({
            name,
            value: [name, value],
          })),
        },
      ],
    };

    // Set initial options to the chart
    myChart.setOption(option);

    // Interval to update data every second
    const intervalId = setInterval(updateData, 1000);

    // Resize chart on window resize
    window.addEventListener("resize", () => {
      myChart.resize();
    });

    // Clean up on component unmount
    return () => {
      clearInterval(intervalId); // Clear interval
      window.removeEventListener("resize", myChart.resize); // Remove resize listener
      myChart.dispose(); // Dispose chart instance
    };
  }, [chartData]);

  // Render chart container
  return (
    <div
      id="main"
      ref={chartRef}
      style={{
        width: "100%",
        position: "relative",
        height: "70vh",
        overflow: "hidden",
      }}
    />
  );
};

// PropTypes for chartData prop
DynamicTimeChart.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  ).isRequired,
};

export default DynamicTimeChart;
