import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import { MimicMetrics, MimicLogs } from "../utils/api-mimic";
import "./MetricsScreen.css";
import DateTimePicker from "react-datepicker";

const MetricsScreen = () => {
  const [metricsData, setMetricsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const metricsContainerRef = useRef(null);
  const [selectedRange, setSelectedRange] = useState(null);

  useEffect(() => {
    Chart.register(...registerables);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchedMetrics = await MimicMetrics.fetchMetrics({
          startTs: startDate.getTime(),
          endTs: endDate.getTime(),
        });
        setMetricsData(fetchedMetrics);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [startDate, endDate]);

  useEffect(() => {
    if (metricsContainerRef.current) {
      metricsContainerRef.current.scrollTop =
        metricsContainerRef.current.scrollHeight;
    }
  }, [metricsData]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleChartSelection = (event) => {
    const chart = event.chart;
    if (chart.getElementsAtEventForMode) {
      const point = chart.getElementsAtEventForMode(
        event,
        "nearest",
        { intersect: true },
        false
      )[0];
      if (point) {
        const timestamp = chart.data.labels[point.index];
        setSelectedRange({
          start: timestamp,
          end: timestamp,
        });
      }
    }
  };

  const handleChartDrag = (event) => {
    const chart = event.chart;
    const start = chart.scales["x"].getValueForPixel(event.x - 50);
    const end = chart.scales["x"].getValueForPixel(event.x + 50);
    setSelectedRange({
      start: new Date(start),
      end: new Date(end),
    });
  };

  const handleViewLogs = () => {
    if (selectedRange) {
      const { start, end } = selectedRange;
      // Call API to fetch logs for the selected time range
      MimicLogs.fetchPreviousLogs({
        startTs: start.getTime(),
        endTs: end.getTime(),
        limit: 100,
      }).then((logs) => {
        console.log("Logs for selected range:", logs);
        // You can display logs in a modal or another component
      });
    }
  };

  return (
    <div className="metrics-container">
      <div className="datetime-picker">
        <label>Start Date and Time:</label>
        <DateTimePicker
          selected={startDate}
          onChange={handleStartDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      </div>
      <div className="datetime-picker">
        <label>End Date and Time:</label>
        <DateTimePicker
          selected={endDate}
          onChange={handleEndDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      </div>
      <div className="chart-container" ref={metricsContainerRef}>
        {metricsData.map((graph, index) => (
          <div key={index}>
            <h3>{graph.name}</h3>
            {graph.graphLines && graph.graphLines.length > 0 && (
              <Line
                data={{
                  labels: graph.graphLines[0].values.map((point) =>
                    new Date(point.timestamp).toLocaleString()
                  ),
                  datasets: graph.graphLines.map((line, lineIndex) => ({
                    label: line.name,
                    data: line.values.map((point) => point.value),
                    fill: false,
                    borderColor:
                      lineIndex === 0 ? "red" : lineIndex === 1 ? "blue" : "green",
                    tension: 0.1,
                  })),
                }}
                options={{
                  scales: {
                    x: {
                      type: "time",
                      time: {
                        unit: "minute",
                      },
                    },
                    y: {
                      beginAtZero: true,
                    },
                  },
                  plugins: {
                    selection: {
                      mode: "x",
                      onSelection: handleChartSelection,
                      onDrag: handleChartDrag,
                    },
                  },
                  interaction: {
                    mode: "x",
                  },
                }}
              />
            )}
          </div>
        ))}
        {isLoading && <div>Loading...</div>}
      </div>
      <div>
        <button onClick={handleViewLogs} disabled={!selectedRange}>
          View Logs
        </button>
      </div>
    </div>
  );
};

export default MetricsScreen;
