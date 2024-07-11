import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as echarts from "echarts";

const LineRaceChart = ({ chartData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    if (!chartData || chartData.length === 0) {
      console.error("Invalid or empty chartData");
      return;
    }

    if (chartData.length <= 1) {
      console.error("Chart data must contain at least one data row.");
      return;
    }

    // Process chartData into a structure suitable for Apache ECharts
    const processedData = chartData.slice(1).map((item) => ({
      value: item[0],
      hospital: item[1],
      year: item[2],
    }));

    const hospitals = Array.from(
      new Set(processedData.map((item) => item.hospital))
    );

    const datasetWithFilters = [];
    const seriesList = [];

    echarts.util.each(hospitals, (hospital) => {
      const datasetId = "dataset_" + hospital;
      datasetWithFilters.push({
        id: datasetId,
        fromDatasetId: "dataset_raw",
        transform: {
          type: "filter",
          config: {
            and: [{ dimension: "hospital", "=": hospital }],
          },
        },
      });
      seriesList.push({
        type: "line",
        datasetId: datasetId,
        showSymbol: false,
        name: hospital,
        endLabel: {
          show: true,
          formatter: function (params) {
            console.log(params);
            return params.value.hospital + ": " + params.value.value;
          },
        },
        labelLayout: {
          moveOverlap: "shiftY",
        },
        emphasis: {
          focus: "series",
        },
        encode: {
          x: "year",
          y: "value",
          label: ["hospital", "value"],
          itemName: "year",
          tooltip: ["value"],
        },
      });
    });

    const option = {
      animationDuration: 10000,
      dataset: [
        {
          id: "dataset_raw",
          source: processedData,
        },
        ...datasetWithFilters,
      ],
      title: {
        text: "Hospital Patients Data",
      },
      tooltip: {
        order: "valueDesc",
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        name: "Year",
        nameLocation: "middle",
      },
      yAxis: {
        name: "Patients",
        type: "value",
      },
      grid: {
        right: 140,
      },
      series: seriesList,
    };

    myChart.setOption(option);

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
        height: "73vh",
        overflow: "hidden",
      }}
    />
  );
};

LineRaceChart.propTypes = {
  chartData: PropTypes.arrayOf(PropTypes.array).isRequired,
};

export default LineRaceChart;
