import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getUsers, updateUserRoles } from '@redux/features/usersSlice';
import { addNotification } from '@redux/features/notificationsSlice';
import { NoResults } from 'components/NoResults';
import { Button } from 'components/Button';
import { Table } from 'components/Table';
import { UserRow } from 'pages/Users/UserRow';
import styles from 'pages/Users/Users.scss';

export const Users = ({ setIsLoading }) => {
  const { error, users, isLoading } = useSelector((state) => state.users);
  const [changedRoles, setChangedRoles] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (!users.length) {
      dispatch(getUsers());
    }
  }, [dispatch, users]);

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

  const handleSaveRoles = async () => {
    if (Object.keys(changedRoles).length > 0) {
      const result = await dispatch(updateUserRoles(changedRoles));

      if (result.meta?.requestStatus === 'fulfilled' && result.payload?.data?.length > 0) {
        setChangedRoles({});
        dispatch(
          addNotification({
            id: Date.now(),
            title: 'Changes saved!',
            text: 'User roles updated successfully',
            type: 'success',
          })
        );
      }
    }
  };

  return (
    <>
      <div className={styles.buttons}>
        <Button
          text='Save changes'
          onClick={handleSaveRoles}
          disabled={!Object.values(changedRoles).length || (users.length > 0 && isLoading)}
        />
      </div>
      {users.length > 0 ? (
        <Table
          columns={[
            { key: 'checkbox', label: '' },
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
          ]}
          data={users}
          renderRow={(user, index) => (
            <UserRow user={user} index={index} setChangedRoles={setChangedRoles} key={user.id} />
          )}
        />
      ) : (
        !isLoading && <NoResults />
      )}
    </>
  );
};
