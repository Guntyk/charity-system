import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
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
import { getOrganizations } from '@redux/features/organizationsSlice';
import { getTransactions } from '@redux/features/transactionsSlice';
import { getVolunteers } from '@redux/features/volunteersSlice';
import { getProjects } from '@redux/features/projectsSlice';
import { OrganizationsBreakdown } from './Cards/OrganizationsBreakdown';
import { Transactions } from './Cards/Transactions';
import { ActiveVolunteers } from './Cards/ActiveVolunteers';
import { TopProjects } from './Cards/TopProjects';
import { Summary } from './Cards/Summary';
import styles from 'pages/Dashboard/Dashboard.scss';

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, PointElement, LineElement, Tooltip, Legend);

export const Dashboard = () => {
  const { organizations } = useSelector((state) => state.organizations);
  const { transactions } = useSelector((state) => state.transactions);
  const { volunteers } = useSelector((state) => state.volunteers);
  const { projects } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrganizations());
    dispatch(getTransactions());
    dispatch(getVolunteers());
    dispatch(getProjects());
  }, [dispatch]);

  return (
    <>
      <div className={styles.header}>
        <h1>Welcome, {user?.name}!</h1>
      </div>

      <section className={styles.content}>
        <Summary
          organizations={organizations}
          projects={projects}
          transactions={transactions}
          volunteers={volunteers}
        />
        <OrganizationsBreakdown organizations={organizations} projects={projects} />
        <ActiveVolunteers transactions={transactions} volunteers={volunteers} />
        <Transactions transactions={transactions} />
        <TopProjects projects={projects} />
      </section>
    </>
  );
};
