import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { getOrganizations } from '@redux/features/organizationsSlice';
import { getTransactions } from '@redux/features/transactionsSlice';
import { getVolunteers } from '@redux/features/volunteersSlice';
import { getProjects } from '@redux/features/projectsSlice';
import { formatMoney } from 'helpers/formatMoney';
import styles from 'pages/Dashboard/Dashboard.scss';
import { ActiveVolunteers } from './Cards/ActiveVolunteers';
import { OrganizationsBreakdown } from './Cards/OrganizationsBreakdown';

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, PointElement, LineElement, Tooltip, Legend);

export const Dashboard = () => {
  const { organizations } = useSelector((state) => state.organizations);
  const { transactions } = useSelector((state) => state.transactions);
  const { volunteers } = useSelector((state) => state.volunteers);
  const { projects } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [timePeriod, setTimePeriod] = useState('week');

  useEffect(() => {
    dispatch(getOrganizations());
    dispatch(getTransactions());
    dispatch(getVolunteers());
    dispatch(getProjects());
  }, [dispatch]);

  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);

  useEffect(() => {
    const deposits = transactions
      .filter((t) => t.transactionType === 'deposit')
      .reduce((acc, t) => acc + parseFloat(t.amount), 0);
    const withdrawals = transactions
      .filter((t) => t.transactionType === 'withdrawal')
      .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    setTotalDeposits(deposits);
    setTotalWithdrawals(withdrawals);
  }, [transactions]);

  return (
    <>
      <div className={styles.header}>
        <h1>Welcome, {user?.name}!</h1>
      </div>

      <section className={styles.content}>
        <div className={styles.card}>
          <p className={styles.title}>Summary</p>
          <div className={styles.stats}>
            <h2 className={styles.amount}>
              Organizations <span>{organizations.length}</span>
            </h2>
            <h2 className={styles.amount}>
              Projects <span>{projects.length}</span>
            </h2>
            <h2 className={cn(styles.amount, styles.money)}>
              Money
              <span>
                <span className={cn(styles.triangle, { [styles.deposit]: totalDeposits - totalWithdrawals > 0 })} />$
                {formatMoney(Math.abs(totalDeposits - totalWithdrawals))}
              </span>
            </h2>
            <h2 className={styles.amount}>
              Volunteers <span>{volunteers.length}</span>
            </h2>
          </div>
        </div>
        <OrganizationsBreakdown organizations={organizations} projects={projects} />
        <ActiveVolunteers transactions={transactions} volunteers={volunteers} />
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
        <div className={cn(styles.card, styles.chart, styles.projectsMoney)}>
          <h3 className={styles.title}>Revenue vs Costs by Project</h3>
          <div className={styles.chartContainer}>
            <Bar data={revenueVsCostsData(projects)} options={barChartOptions} />
          </div>
        </div>
      </section>
    </>
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
        borderColor: '#6236c9',
        tension: 0.3,
        pointRadius: 0,
      },
      {
        label: 'Withdrawals',
        data: withdrawals,
        borderColor: '#C317C8',
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };
};

const revenueVsCostsData = (projects) => ({
  labels: projects.map((p) => p.name),
  datasets: [
    {
      label: 'Revenue',
      backgroundColor: '#6236c9',
      data: projects.map((p) => parseFloat(p.revenue)),
    },
    {
      label: 'Costs',
      backgroundColor: 'rgb(171, 138, 247)',
      data: projects.map((p) => parseFloat(p.costs)),
    },
  ],
});

const barChartOptions = {
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
