import { Bar } from 'react-chartjs-2';
import cn from 'classnames';
import { formatMoney } from 'helpers/formatMoney';
import styles from 'pages/Dashboard/Dashboard.scss';

export const TopProjects = ({ projects }) => {
  return (
    <div className={cn(styles.card, styles.chart, styles.projectsMoney)}>
      <h3 className={styles.title}>Top 10 Projects Revenue vs Costs</h3>
      <div className={styles.chartContainer}>
        <Bar data={revenueVsCostsData(projects)} options={barChartOptions} />
      </div>
    </div>
  );
};

const revenueVsCostsData = (projects) => {
  const sortedProjects = [...projects].sort((a, b) => parseFloat(b.revenue) - parseFloat(a.revenue));
  const topProjects = sortedProjects.slice(0, 10);

  return {
    labels: topProjects.map((p) => (p.name.length > 30 ? p.name.slice(0, 27) + '...' : p.name)),
    datasets: [
      {
        label: 'Revenue',
        backgroundColor: '#d5e4fa',
        data: topProjects.map((p) => parseFloat(p.revenue)),
      },
      {
        label: 'Costs',
        backgroundColor: '#e5d6fb',
        data: topProjects.map((p) => parseFloat(p.costs)),
      },
    ],
  };
};

const barChartOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        font: {
          size: 14,
          family: 'Poppins',
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        font: {
          family: 'Poppins',
          size: 12,
        },
        callback: (value) => '$' + formatMoney(value),
        maxTicksLimit: 5,
      },
      grid: {
        color: '#eeeeee',
      },
      border: {
        display: false,
      },
    },
    y: {
      ticks: {
        font: {
          family: 'Poppins',
          size: 12,
        },
      },
      grid: {
        display: false,
      },
    },
  },
};
