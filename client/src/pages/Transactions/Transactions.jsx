import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import { getTransactions } from '@redux/features/transactionsSlice';
import { addNotification } from '@redux/features/notificationsSlice';
import { getVolunteers } from '@redux/features/volunteersSlice';
import { getProjects } from '@redux/features/projectsSlice';
import { formatDate } from 'helpers/formatDate';
import { NoResults } from 'components/NoResults';
import { Dropdown } from 'components/Dropdown';
import { Button } from 'components/Button';
import { Table } from 'components/Table';
import { Create } from 'pages/Transactions/Create';
import styles from 'pages/Transactions/Transactions.scss';

export const Transactions = ({ setIsLoading }) => {
  const { volunteers, isLoading: isVolunteersLoading } = useSelector((state) => state.volunteers);
  const { projects, isLoading: isProjectsLoading } = useSelector((state) => state.projects);
  const { error, transactions, isLoading: isTransactionsLoading } = useSelector((state) => state.transactions);
  const [isCreateWindowOpen, setIsCreateWindowOpen] = useState(false);
  const [transactionsList, setTransactionsList] = useState([]);
  const [projectFilter, setProjectFilter] = useState(null);
  const dispatch = useDispatch();

  const isLoading = isTransactionsLoading || isVolunteersLoading || isProjectsLoading;

  useEffect(() => {
    if (!transactions.length) {
      dispatch(getTransactions());
    }
    if (!volunteers.length) {
      dispatch(getVolunteers());
    }
    if (!projects.length) {
      dispatch(getProjects());
    }
  }, []);

  useEffect(() => {
    if (transactions.length) {
      setTransactionsList(transactions);
    }
  }, [transactions]);

  useEffect(() => {
    if (error) {
      dispatch(
        addNotification({
          id: Date.now(),
          title: 'Error!',
          text: error,
          type: 'error',
        })
      );
    }
  }, [error]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const filteredTransactions = transactions.filter(({ projectID }) => projectID === projectFilter?.value);
    if (projectFilter) {
      setTransactionsList(filteredTransactions);
    }
  }, [projectFilter]);

  const clearFilter = () => {
    setTransactionsList(transactions);
    setProjectFilter(null);
  };

  return (
    <>
      <div className={styles.buttons}>
        <Button text='Create' onClick={() => setIsCreateWindowOpen(true)} />
      </div>
      <div className={styles.search}>
        <Dropdown
          className={styles.searchDropdown}
          icon={faSearch}
          options={projects.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
          placeholder='Select project'
          setSelectedOption={(selectedOption) => setProjectFilter(selectedOption)}
          selectedOption={projectFilter}
        />
        <Button
          onClick={clearFilter}
          className={cn(styles.clearBtn, { [styles.active]: projectFilter })}
          ghostStyle
          roundStyle
          no3D
        >
          <FontAwesomeIcon icon={faXmark} />
        </Button>
        {projectFilter && transactionsList.length > 0 && (
          <p className={styles.listLength}>
            Found {transactionsList.length} entr{transactionsList.length > 1 ? 'ies' : 'y'}
          </p>
        )}
      </div>
      {transactionsList.length > 0 ? (
        <Table
          columns={[
            { key: 'checkbox', label: '' },
            { key: 'volunteer', label: 'Volunteer' },
            { key: 'amount', label: 'Amount' },
            { key: 'project', label: 'Project' },
            { key: 'purpose', label: 'Purpose' },
            { key: 'timestamp', label: 'Timestamp' },
          ]}
          data={transactionsList}
          renderRow={({ volunteerID, projectID, transactionType, amount, purpose, createdAt }, index) => (
            <>
              <td>{index + 1}</td>
              <td>{volunteers.find(({ id }) => id === volunteerID)?.name}</td>
              <td className={cn(styles.money, { [styles.deposit]: transactionType === 'deposit' })}>
                {transactionType === 'deposit' ? '+' : '-'}${amount}
              </td>
              <td>{projects.find(({ id }) => id === projectID)?.name}</td>
              <td>{purpose}</td>
              <td>{formatDate(createdAt)}</td>
            </>
          )}
        />
      ) : (
        !isLoading && <NoResults text='This project has no transactions' />
      )}
      <Create isOpen={isCreateWindowOpen} setIsOpen={setIsCreateWindowOpen} />
    </>
  );
};
