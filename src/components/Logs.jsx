import React, { useState, useEffect } from 'react';
import { getLogs } from '../api-mimic';

function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetchLogs() {
      const logsData = await getLogs();
      setLogs(logsData);
    }
    fetchLogs();
  }, []);

  return (
    <div>
      <h2>Logs</h2>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
}

export default Logs;
