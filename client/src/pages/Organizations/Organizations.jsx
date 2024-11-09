import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getOrganizations, deleteOrganizations } from '@redux/features/organizationsSlice';
import { addNotification } from '@redux/features/notificationsSlice';
import { Notification } from 'components/Notification';
import { Button } from 'components/Button';
import { Create } from 'pages/Organizations/Create';
import styles from 'pages/Organizations/Organizations.scss';

export const Organizations = ({ setIsLoading }) => {
  const { error, organizations, isLoading } = useSelector((state) => state.organizations);
  const [selectedOrganizationsIDs, setSelectedOrganizationsIDs] = useState([]);
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
    if (selectedOrganizationsIDs.length > 0) {
      const result = await dispatch(deleteOrganizations(selectedOrganizationsIDs));

      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(
          addNotification({
            id: Date.now(),
            title: 'Deleted successfully',
            text: 'Selected organizations have been deleted',
            type: 'success',
          })
        );
        setSelectedOrganizationsIDs([]);
      }
    }
  };

  const toggleSelection = (id) => {
    setSelectedOrganizationsIDs((prev) => (prev.includes(id) ? prev.filter((orgId) => orgId !== id) : [...prev, id]));
  };

  return (
    <section>
      <div className={styles.buttons}>
        <Button text='Create' onClick={() => setIsCreateWindowOpen(true)} />
        <Button text='Delete' onClick={handleDelete} ghostStyle disabled={selectedOrganizationsIDs.length === 0} />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Manager</th>
            <th>Phone number</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map(({ id, name, contact_person, phone_number }, index) => (
            <tr key={id}>
              <td>
                <input
                  type='checkbox'
                  checked={selectedOrganizationsIDs.includes(id)}
                  onChange={() => toggleSelection(id)}
                />
                {index + 1}
              </td>
              <td>{name}</td>
              <td>{contact_person}</td>
              <td>{phone_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Create isOpen={isCreateWindowOpen} setIsOpen={setIsCreateWindowOpen} />
      <Notification />
    </section>
  );
};
