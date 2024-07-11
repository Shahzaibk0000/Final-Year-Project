/* eslint-disable no-unused-vars */
import { useEffect, useRef } from "react";
import * as echarts from "echarts";

const ScatterAggregateBar = ({ femaleData, maleData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);

    function calculateAverage(data, dim) {
      let total = 0;
      for (let i = 0; i < data.length; i++) {
        total += data[i][dim];
      }
      return total / data.length;
    }

    const scatterOption = {
      xAxis: {
        name: "Age",
        scale: true,
      },
      yAxis: {
        name: "Death (Binary)",
        scale: true,
      },
      series: [
        {
          type: "scatter",
          id: "female",
          dataGroupId: "female",
          universalTransition: {
            enabled: true,
            delay: function (idx, count) {
              return Math.random() * 400;
            },
          },
          data: femaleData,
        },
        {
          type: "scatter",
          id: "male",
          dataGroupId: "male",
          universalTransition: {
            enabled: true,
            delay: function (idx, count) {
              return Math.random() * 400;
            },
          },
          data: maleData,
        },
      ],
    };

    const barOption = {
      xAxis: {
        type: "category",
        data: ["Female", "Male"],
      },
      yAxis: {
        type: "value",
        scale: true,
      },
      series: [
        {
          type: "bar",
          id: "average-age",
          data: [
            calculateAverage(femaleData, 0),
            calculateAverage(maleData, 0),
          ],
          universalTransition: {
            enabled: true,
            seriesKey: "barSeries",
          },
        },
        {
          type: "bar",
          id: "death-rate",
          data: [
            calculateAverage(femaleData, 1),
            calculateAverage(maleData, 1),
          ],
          universalTransition: {
            enabled: true,
            seriesKey: "barSeries",
          },
        },
      ],
    };

    let currentOption = scatterOption;

    setInterval(() => {
      currentOption =
        currentOption === scatterOption ? barOption : scatterOption;
      myChart.setOption(currentOption, true);
    }, 3000);

    myChart.setOption(scatterOption);

    return () => {
      myChart.dispose();
    };
  }, [femaleData, maleData]);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        position: "relative",
        height: "69vh",
        overflow: "hidden",
      }}
    ></div>
  );
};

export default ScatterAggregateBar;
