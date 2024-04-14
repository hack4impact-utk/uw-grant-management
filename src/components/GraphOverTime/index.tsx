'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useRef } from 'react';
import { ReportDocument as ReportType } from '@/server/models/Report';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function GraphOverTime() {
  const reports = useRef<ReportType[]>([]);
  //const [metric, setMetric] = useState<string>('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`/api/reports`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        reports.current = data;
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  const clientsServedMap = new Map();

  reports.current.forEach((item) => {
    const startMonth = item.periodStart.month;
    const startYear = item.periodStart.year;
    const endMonth = item.periodEnd.month;
    const endYear = item.periodEnd.year;
    const key = `${startMonth} ${startYear}-${endMonth} ${endYear}`;
    const clientsServed = item.clientsServed;

    if (clientsServedMap.has(key)) {
      clientsServedMap.set(key, clientsServedMap.get(key) + clientsServed);
    } else {
      clientsServedMap.set(key, clientsServed);
    }
  });

  const data = {
    labels: Array.from(clientsServedMap.keys()),
    datasets: [
      {
        label: 'Clients Served',
        data: Array.from(clientsServedMap.values()),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Total Clients Served',
      },
    },
  };

  return <Line data={data} options={options} />;
}

export default GraphOverTime;
