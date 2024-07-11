import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import PropTypes from "prop-types";
import VeinsMedicalSVG from "@assets/Veins_Medical_Diagram_clip_art.svg";

const OrganDataChart = ({ OrganChartData }) => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const initializeChart = async () => {
      const chartInstance = echarts.init(chartContainerRef.current, null, {
        renderer: "canvas",
        useDirtyRect: false,
      });

      let option;

      try {
        const response = await fetch(VeinsMedicalSVG);
        const svgText = await response.text();

        if (svgText) {
          echarts.registerMap("organ_diagram", { svg: svgText });
          option = {
            tooltip: {},
            geo: {
              left: 10,
              right: "50%",
              map: "organ_diagram",
              selectedMode: "multiple",
              emphasis: {
                focus: "self",
                itemStyle: {
                  color: null,
                },
                label: {
                  position: "bottom",
                  distance: 0,
                  textBorderColor: "#fff",
                  textBorderWidth: 2,
                },
              },
              blur: {},
              select: {
                itemStyle: {
                  color: "#b50205",
                },
                label: {
                  show: false,
                  textBorderColor: "#fff",
                  textBorderWidth: 2,
                },
              },
            },
            grid: {
              left: "60%",
              top: "20%",
              bottom: "20%",
            },
            xAxis: {},
            yAxis: {
              data: [
                "heart",
                "large-intestine",
                "small-intestine",
                "kidney",
                "lung",
              ],
            },
            series: [
              {
                type: "bar",
                emphasis: {
                  focus: "self",
                },
                data: [
                  OrganChartData.heartCount,
                  OrganChartData.largeIntestineCount,
                  OrganChartData.smallIntestineCount,
                  OrganChartData.kidneyCount,
                  OrganChartData.lungCount,
                ],
              },
            ],
          };
          chartInstance.setOption(option);
          chartInstance.on("mouseover", { seriesIndex: 0 }, function (event) {
            chartInstance.dispatchAction({
              type: "highlight",
              geoIndex: 0,
              name: event.name,
            });
          });
          chartInstance.on("mouseout", { seriesIndex: 0 }, function (event) {
            chartInstance.dispatchAction({
              type: "downplay",
              geoIndex: 0,
              name: event.name,
            });
          });
        }
      } catch (error) {
        console.error("Error loading SVG:", error);
      }

      const handleResize = () => {
        chartInstance.resize();
      };

      const debouncedResize = debounce(handleResize, 100);

      window.addEventListener("resize", debouncedResize);

      return () => {
        window.removeEventListener("resize", debouncedResize);
        chartInstance.dispose();
      };
    };

    initializeChart();
  }, [OrganChartData]);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: "100%",
        position: "relative",
        height: "70vh",
        overflow: "hidden",
      }}
    />
  );
};

OrganDataChart.propTypes = {
  OrganChartData: PropTypes.shape({
    heartCount: PropTypes.number.isRequired,
    largeIntestineCount: PropTypes.number.isRequired,
    smallIntestineCount: PropTypes.number.isRequired,
    kidneyCount: PropTypes.number.isRequired,
    lungCount: PropTypes.number.isRequired,
  }).isRequired,
};

export default OrganDataChart;
