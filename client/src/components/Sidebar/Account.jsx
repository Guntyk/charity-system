import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { logoutUser, getCurrentUser } from '@redux/features/authSlice';
import styles from 'components/Sidebar/Sidebar.scss';

export const Account = ({ setHeaderTitle }) => {
  const { user } = useSelector((state) => state.auth);
  const [isUserActionsOpen, setIsUserActionsOpen] = useState(false);
  const dispatch = useDispatch();
  const accountRef = useRef();

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [user]);

  const logout = () => {
    dispatch(logoutUser());
    setHeaderTitle('');
  };

  return (
    <div className={styles.accountWrapper}>
      <span className={styles.account} onClick={() => setIsUserActionsOpen(!isUserActionsOpen)}>
        {user?.name.slice(0, 1)}
      </span>
      <div className={cn(styles.accountActions, { [styles.active]: isUserActionsOpen })} ref={accountRef}>
        <span>{user?.name}</span>
        <span>{user?.email}</span>
        <button className={styles.exitBtn} onClick={logout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          Log out
        </button>
      </div>
    </div>
  );
};
