import { useEffect, useState } from 'react';
import cn from 'classnames';
import { formatMoney } from 'helpers/formatMoney';
import styles from 'pages/Dashboard/Dashboard.scss';

export const Summary = ({ organizations, projects, transactions, volunteers }) => {
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
  );
};
