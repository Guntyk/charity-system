import { Line } from 'react-chartjs-2';
import { useState } from 'react';
import cn from 'classnames';
import { TabSelector } from 'components/TabSelector';
import styles from 'pages/Dashboard/Dashboard.scss';
import { formatMoney } from 'helpers/formatMoney';

export const MonthlyTransactions = ({ transactions }) => {
  const [timePeriodIndex, setTimePeriodIndex] = useState(1);
  const timePeriods = ['week', 'month', 'year', 'all'];

  return (
    <div className={cn(styles.card, styles.chart)}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>Monthly Deposits & Withdrawals</h3>
        <TabSelector
          className={styles.periodToggle}
          tabs={timePeriods}
          activeTabIndex={timePeriodIndex}
          setActiveTabIndex={setTimePeriodIndex}
        />
      </div>
      <div className={styles.chartContainer}>
        <Line data={transactionsData(transactions, timePeriods[timePeriodIndex])} options={lineChartOptions} />
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

  const getMonthlyLabels = (startYear, endYear) => {
    const labels = [];
    for (let year = startYear; year <= endYear; year++) {
      for (let month = 0; month < 12; month++) {
        labels.push(`${new Date(year, month).toLocaleString('en', { month: 'short' })} ${year}`);
      }
    }
    return labels;
  };

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
      deposits = Array(12).fill(0);
      withdrawals = Array(12).fill(0);

      filteredTransactions.forEach(({ createdAt, transactionType, amount }) => {
        const month = new Date(createdAt).getMonth();
        if (transactionType === 'deposit') deposits[month] += parseFloat(amount);
        if (transactionType === 'withdrawal') withdrawals[month] += parseFloat(amount);
      });
      break;

    case 'all':
    default:
      const yearsRange = filteredTransactions.reduce(
        (range, { createdAt }) => {
          const year = new Date(createdAt).getFullYear();
          return {
            min: Math.min(range.min, year),
            max: Math.max(range.max, year),
          };
        },
        { min: now.getFullYear(), max: now.getFullYear() }
      );

      const startYear = yearsRange.min;
      const endYear = yearsRange.max;

      const numMonths = (endYear - startYear + 1) * 12;
      deposits.length = numMonths;
      withdrawals.length = numMonths;
      deposits.fill(0);
      withdrawals.fill(0);

      filteredTransactions.forEach(({ createdAt, transactionType, amount }) => {
        const date = new Date(createdAt);
        const monthIndex = (date.getFullYear() - startYear) * 12 + date.getMonth();
        if (transactionType === 'deposit') deposits[monthIndex] += parseFloat(amount);
        if (transactionType === 'withdrawal') withdrawals[monthIndex] += parseFloat(amount);
      });

      return {
        labels: getMonthlyLabels(startYear, endYear),
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
      ticks: {
        font: {
          family: 'Poppins',
          size: 12,
        },
        maxTicksLimit: 7,
      },
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        font: {
          family: 'Poppins',
          size: 12,
        },
        callback: (value) => '$' + formatMoney(value),
        maxTicksLimit: 5,
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
