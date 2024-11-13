import cn from 'classnames';
import { formatMoney } from 'helpers/formatMoney';
import styles from 'pages/Dashboard/Dashboard.scss';

export const ActiveVolunteers = ({ transactions, volunteers }) => {
  const getActiveVolunteersData = (timePeriod = 'all') => {
    const now = new Date();

    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      switch (timePeriod) {
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

    const volunteerStats = filteredTransactions.reduce((acc, transaction) => {
      const { volunteerID, transactionType, amount } = transaction;
      const id = volunteerID;

      if (!acc[id]) {
        acc[id] = {
          count: 0,
          totalDeposits: 0,
          totalWithdrawals: 0,
        };
      }

      acc[id].count += 1;
      if (transactionType === 'deposit') {
        acc[id].totalDeposits += parseFloat(amount);
      } else if (transactionType === 'withdrawal') {
        acc[id].totalWithdrawals += parseFloat(amount);
      }

      return acc;
    }, {});

    const topVolunteers = Object.entries(volunteerStats)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([volunteerID, stats]) => ({
        id: volunteers.find((vol) => vol.id === Number(volunteerID))?.id,
        name: volunteers.find((vol) => vol.id === Number(volunteerID))?.name || 'Unknown',
        ...stats,
      }));

    return topVolunteers;
  };

  return (
    <div className={cn(styles.card, styles.volunteers)}>
      <h3 className={styles.title}>Top 5 most active volunteers</h3>
      <ul className={styles.topVolunteers}>
        <li className={styles.head}>
          <span>Volunteer</span>
          <span>Deposit</span>
          <span>Spend</span>
          <span>Total</span>
        </li>
        {volunteers.length > 0 &&
          getActiveVolunteersData().map((v) => (
            <li key={v.id}>
              <span className={styles.name}>
                <span className={styles.avatar}>{v.name.split(' ').map((word) => word.charAt(0))}</span>
                {v.name}
              </span>
              <span className={styles.transaction}>${formatMoney(v.totalDeposits)}</span>
              <span className={styles.transaction}>${formatMoney(v.totalWithdrawals)}</span>
              <span className={cn(styles.total, { [styles.negative]: v.totalDeposits - v.totalWithdrawals < 0 })}>
                <span className={cn(styles.triangle, { [styles.deposit]: v.totalDeposits - v.totalWithdrawals > 0 })} />
                ${formatMoney(Math.abs(v.totalDeposits - v.totalWithdrawals))}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};
