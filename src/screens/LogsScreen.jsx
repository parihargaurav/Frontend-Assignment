import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MimicLogs } from "../utils/api-mimic";
import "./LogsScreen.css"; 

const LogsScreen = () => {
  const [logs, setLogs] = useState([]);
  const [liveLogs, setLiveLogs] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [liveLogsCount, setLiveLogsCount] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const logsContainerRef = useRef(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const fetchedLogs = await MimicLogs.fetchPreviousLogs({
          startTs: Date.now() - 3600000,
          endTs: Date.now(),
          limit: 10,
        });
        setLogs(fetchedLogs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
      setIsLoading(false);
    };

    fetchLogs();
  }, []);

  useEffect(() => {
    let unsubscribe;
    if (isLive) {
      unsubscribe = MimicLogs.subscribeToLiveLogs((newLog) => {
        setLiveLogs((prevLogs) => [...prevLogs, newLog]);
        setLiveLogsCount((prevCount) => prevCount + 1);
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isLive]);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [logs, liveLogs]);

  const handleScroll = () => {
    if (logsContainerRef.current.scrollTop === 0 && !isLoading && hasMore) {
      setIsLoading(true);
      const oldestTimestamp = logs[0]?.timestamp || Date.now();
      MimicLogs.fetchPreviousLogs({
        startTs: oldestTimestamp - 3600000,
        endTs: oldestTimestamp,
        limit: 10,
      })
        .then((fetchedLogs) => {
          if (fetchedLogs.length === 0) {
            setHasMore(false);
          } else {
            setLogs((prevLogs) => [...fetchedLogs, ...prevLogs]);
          }
        })
        .catch((error) => console.error("Error fetching previous logs:", error))
        .finally(() => setIsLoading(false));
    }
  };

  const toggleLiveLogs = () => {
    setIsLive((prevIsLive) => !prevIsLive);
  };

  const handleCustomTimeRangeSelect = () => {
    if (startDate && endDate) {
      setLogs([]);
      setIsLoading(true);
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();

      // Calculate the difference in milliseconds between start and end time
      const timeDifference = endTime - startTime;

      // Calculate the interval in milliseconds (here, we set it to fetch logs every second)
      const interval = 1000;

      // Calculate the number of iterations required
      const iterations = Math.ceil(timeDifference / interval);

      // Array to hold the promises for each iteration
      const fetchPromises = [];

      // Fetch logs for each iteration at regular intervals
      for (let i = 0; i < iterations; i++) {
        const startTs = startTime + i * interval;
        const endTs = startTs + interval;

        // Push the fetch promise to the array
        fetchPromises.push(
          MimicLogs.fetchPreviousLogs({ startTs, endTs, limit: 10 })
        );
      }

      // Execute all fetch promises sequentially
      Promise.all(fetchPromises)
        .then((results) => {
          // Combine all fetched logs into a single array
          const allLogs = results.reduce((acc, curr) => acc.concat(curr), []);
          setLogs(allLogs);
          setIsLive(false);
        })
        .catch((error) => console.error("Error fetching logs:", error))
        .finally(() => setIsLoading(false));
    }
  };

  const handleLiveLogsCountClick = () => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
      setLiveLogsCount(0);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="terminal flex-grow bg-black text-white">
        <div className="terminal__bar bg-gray-900 p-2 flex items-center">
          <span className="mr-4">Start Date-Time:</span>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            dateFormat="Pp"
            placeholderText="Start Date-Time"
            className="mr-4"
          />
          <span className="mr-4">End Date-Time:</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            showTimeSelect
            dateFormat="Pp"
            placeholderText="End Date-Time"
            className="mr-4"
          />
          <button
            onClick={handleCustomTimeRangeSelect}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
          >
            Fetch Logs
          </button>
          <button
            onClick={toggleLiveLogs}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isLive ? "Stop Live Logs" : "Start Live Logs"}
          </button>
        </div>
        <div
          className="terminal__output overflow-auto flex flex-col-reverse flex-grow"
          ref={logsContainerRef}
          onScroll={handleScroll}
        >
          {logs.map((log, index) => (
            <div key={index}>
              {/* Display timestamp and log message */}
              <span className="log-timestamp">
                {new Date(log.timestamp).toLocaleString()}:
              </span>{" "}
              {log.message}
            </div>
          ))}
          {isLive &&
            liveLogs.map((log, index) => (
              <div key={index} className="live-log">
                {/* Display timestamp and log message for live logs */}
                <span className="log-timestamp">
                  {new Date(log.timestamp).toLocaleString()}:
                </span>{" "}
                {log.message}
              </div>
            ))}
          {isLoading && <div>Loading...</div>}
          {hasMore && !isLoading && <div>Scroll up for more logs</div>}
          {liveLogsCount > 0 && !isLoading && (
            <div onClick={handleLiveLogsCountClick} className="live-count">
              {liveLogsCount} new logs below
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsScreen;
