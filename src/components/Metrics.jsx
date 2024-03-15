import React, { useState, useEffect } from 'react';
import { getMetrics } from '../api-mimic';

function Metrics() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    async function fetchMetrics() {
      const metricsData = await getMetrics();
      setMetrics(metricsData);
    }
    fetchMetrics();
  }, []);

  return (
    <div>
      <h2>Metrics</h2>
      <ul>
        {metrics.map((metric, index) => (
          <li key={index}>{metric}</li>
        ))}
      </ul>
    </div>
  );
}

export default Metrics;
