import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const Analysis = () => {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenue (₹)',
                data: [1200, 1900, 3000, 5000, 2400, 3500],
                backgroundColor: 'rgba(52, 152, 219, 0.6)',
                borderColor: '#3498db',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Business Analysis</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h3>Monthly Sales</h3>
                    <Bar data={data} />
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h3>Growth Trend</h3>
                    <Line data={data} />
                </div>
            </div>
        </div>
    );
};

export default Analysis;