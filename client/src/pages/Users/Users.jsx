import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { getUsers, updateUserRoles, resetError } from '@redux/features/usersSlice';
import { addNotification } from '@redux/features/notificationsSlice';
import { Notification } from 'components/Notification';
import { Button } from 'components/Button';
import { UserRow } from 'pages/Users/UserRow';
import styles from 'pages/Users/Users.scss';

export const Users = ({ setIsLoading }) => {
  const { error, users, isLoading } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [changedRoles, setChangedRoles] = useState({});

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
    <section>
      <div className={styles.buttons}>
        <div className={cn(styles.saveBtn, { [styles.active]: Object.values(changedRoles).length > 0 })}>
          <Button
            text='Save changes'
            onClick={handleSaveRoles}
            disabled={!Object.values(changedRoles).length || (users.length > 0 && isLoading)}
          />
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <UserRow user={user} index={index} setChangedRoles={setChangedRoles} key={user.id} />
          ))}
        </tbody>
      </table>
      <Notification position='bottom-right' />
    </section>
  );
};
