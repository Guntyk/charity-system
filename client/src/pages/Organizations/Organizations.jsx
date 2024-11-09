import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useSelectable } from 'hooks/useSelectable';
import { getOrganizations, deleteOrganizations } from '@redux/features/organizationsSlice';
import { addNotification } from '@redux/features/notificationsSlice';
import { NoResults } from 'components/NoResults';
import { Button } from 'components/Button';
import { Table } from 'components/Table';
import { Create } from 'pages/Organizations/Create';
import styles from 'pages/Organizations/Organizations.scss';

export const Organizations = ({ setIsLoading }) => {
  const { error, organizations, isLoading } = useSelector((state) => state.organizations);
  const { selectedIDs, toggleSelection, clearSelection } = useSelectable();
  const [isCreateWindowOpen, setIsCreateWindowOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!organizations.length) {
      dispatch(getOrganizations());
    }
  }, []);

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

  const handleDelete = async () => {
    if (selectedIDs.length > 0) {
      const result = await dispatch(deleteOrganizations(selectedIDs));

      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(
          addNotification({
            id: Date.now(),
            title: 'Deleted successfully',
            text: 'Selected organizations have been deleted',
            type: 'success',
          })
        );
        clearSelection();
      }
    }
  };

  return (
    <>
      <div className={styles.buttons}>
        <Button text='Create' onClick={() => setIsCreateWindowOpen(true)} />
        <Button text='Delete' onClick={handleDelete} ghostStyle disabled={selectedIDs.length === 0} />
      </div>
      {organizations.length > 0 ? (
        <Table
          columns={[
            { key: 'checkbox', label: '' },
            { key: 'name', label: 'Name' },
            { key: 'contact_person', label: 'Manager' },
            { key: 'phone_number', label: 'Phone number' },
          ]}
          data={organizations}
          renderRow={({ id, name, contact_person, phone_number }, index) => (
            <>
              <td>
                <input type='checkbox' checked={selectedIDs.includes(id)} onChange={() => toggleSelection(id)} />
                {index + 1}
              </td>
              <td>{name}</td>
              <td>{contact_person}</td>
              <td>{phone_number}</td>
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
