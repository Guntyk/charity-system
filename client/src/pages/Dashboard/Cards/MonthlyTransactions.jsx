import { Line } from 'react-chartjs-2';
import { useState } from 'react';
import cn from 'classnames';
import styles from 'pages/Dashboard/Dashboard.scss';

export const MonthlyTransactions = ({ transactions }) => {
  const [timePeriod, setTimePeriod] = useState('month');

  return (
    <div className={cn(styles.card, styles.chart)}>
      <h3 className={styles.title}>Monthly Deposits & Withdrawals</h3>
      <div className={styles.periodToggle}>
        {['week', 'month', 'year', 'all'].map((period) => (
          <button
            key={period}
            onClick={() => setTimePeriod(period)}
            className={cn({ [styles.active]: timePeriod === period })}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>
      <div className={styles.chartContainer}>
        <Line data={transactionsData(transactions, timePeriod)} options={lineChartOptions} />
      </div>
    </div>
  );
};

const transactionsData = (transactions, period) => {
  const now = new Date();
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.createdAt);
    switch (period) {
      case 'week':
        return now - transactionDate <= 7 * 24 * 60 * 60 * 1000;
      case 'month':
        return now - transactionDate <= 30 * 24 * 60 * 60 * 1000;
      case 'year':
        return now - transactionDate <= 365 * 24 * 60 * 60 * 1000;
      case 'all':
      default:
        return true;
    }
  });
  const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('en', { month: 'short' }));
  const weeklyLabels = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString('en', { weekday: 'short' });
  }).reverse();

  let deposits = [];
  let withdrawals = [];

  switch (period) {
    case 'week':
      deposits = Array(7).fill(0);
      withdrawals = Array(7).fill(0);

      filteredTransactions.forEach(({ createdAt, transactionType, amount }) => {
        const day = 6 - (new Date().getDate() - new Date(createdAt).getDate());
        if (transactionType === 'deposit') deposits[day] += parseFloat(amount);
        if (transactionType === 'withdrawal') withdrawals[day] += parseFloat(amount);
      });
      break;

    case 'month':
      deposits = Array(30).fill(0);
      withdrawals = Array(30).fill(0);

      filteredTransactions.forEach(({ createdAt, transactionType, amount }) => {
        const day = new Date(createdAt).getDate() - 1;
        if (transactionType === 'deposit') deposits[day] += parseFloat(amount);
        if (transactionType === 'withdrawal') withdrawals[day] += parseFloat(amount);
      });
      break;

    case 'year':
    case 'all':
      deposits = Array(12).fill(0);
      withdrawals = Array(12).fill(0);

      filteredTransactions.forEach(({ createdAt, transactionType, amount }) => {
        const month = new Date(createdAt).getMonth();
        if (transactionType === 'deposit') deposits[month] += parseFloat(amount);
        if (transactionType === 'withdrawal') withdrawals[month] += parseFloat(amount);
      });
      break;
  }

  return {
    labels:
      period === 'week' ? weeklyLabels : period === 'month' ? Array.from({ length: 30 }, (_, i) => i + 1) : months,
    datasets: [
      {
        label: 'Deposits',
        data: deposits,
        borderColor: '#6992d3',
        tension: 0.3,
        pointRadius: 0,
      },
      {
        label: 'Withdrawals',
        data: withdrawals,
        borderColor: '#a486d1',
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };
};

const lineChartOptions = {
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
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        maxTicksLimit: 3,
      },
      border: {
        display: false,
      },
      grid: {
        color: '#eeeeee',
      },
    },
  },
};
