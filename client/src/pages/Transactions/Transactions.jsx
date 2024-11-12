import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import { getTransactions, deleteTransactions } from '@redux/features/transactionsSlice';
import { addNotification } from '@redux/features/notificationsSlice';
import { getVolunteers } from '@redux/features/volunteersSlice';
import { getProjects } from '@redux/features/projectsSlice';
import { NoResults } from 'components/NoResults';
import { Button } from 'components/Button';
import { Table } from 'components/Table';
import { Create } from 'pages/Transactions/Create';
import styles from 'pages/Transactions/Transactions.scss';
import { formatDate } from 'helpers/formatDate';

export const Transactions = ({ setIsLoading }) => {
  const { volunteers, isLoading: isVolunteersLoading } = useSelector((state) => state.volunteers);
  const { projects, isLoading: isProjectsLoading } = useSelector((state) => state.projects);
  const { error, transactions, isLoading: isTransactionsLoading } = useSelector((state) => state.transactions);
  const [isCreateWindowOpen, setIsCreateWindowOpen] = useState(false);
  //   const [organizationFilter, setOrganizationFilter] = useState(null);
  //   const [TransactionsList, setTransactionsList] = useState([]);
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

  //   useEffect(() => {
  //     if (transactions.length) {
  //       setTransactionsList(Transactions);
  //     }
  //   }, [Transactions]);

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

  //   useEffect(() => {
  //     if (organizationFilter) {
  //       const filteredTransactions = Transactions.filter(
  //         ({ organizationID }) => organizationID === organizationFilter?.value
  //       );
  //       setTransactionsList(filteredTransactions);
  //     }
  //   }, [organizationFilter]);

  //   const clearFilter = () => {
  //     setTransactionsList(Transactions);
  //     setOrganizationFilter(null);
  //   };

  return (
    <>
      <div className={styles.buttons}>
        <Button text='Create' onClick={() => setIsCreateWindowOpen(true)} />
      </div>
      {/* <div className={styles.search}>
        <Dropdown
          className={styles.searchDropdown}
          icon={faSearch}
          options={organizations.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
          placeholder='Select organization'
          selectedOption={organizationFilter}
          setSelectedOption={(selectedOption) => setOrganizationFilter(selectedOption)}
        />
        <Button
          className={cn(styles.clearBtn, { [styles.active]: organizationFilter })}
          onClick={clearFilter}
          ghostStyle
          roundStyle
          no3D
        >
          <FontAwesomeIcon icon={faXmark} />
        </Button>
        {organizationFilter && TransactionsList.length > 0 && (
          <p className={styles.listLength}>Found {TransactionsList.length} entries</p>
        )}
      </div> */}
      {transactions.length > 0 ? (
        <Table
          columns={[
            { key: 'checkbox', label: '' },
            { key: 'volunteer', label: 'Volunteer' },
            { key: 'amount', label: 'Amount' },
            { key: 'project', label: 'Project' },
            { key: 'purpose', label: 'Purpose' },
            { key: 'timestamp', label: 'Timestamp' },
          ]}
          data={transactions}
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
        !isLoading && <NoResults />
      )}
      <Create isOpen={isCreateWindowOpen} setIsOpen={setIsCreateWindowOpen} />
    </>
  );
};
