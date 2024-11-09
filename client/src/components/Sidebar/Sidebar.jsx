import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { clearAllNotifications } from '@redux/features/notificationsSlice';
import { routes } from 'constants/routes';
import { Account } from 'components/Sidebar/Account';
import styles from 'components/Sidebar/Sidebar.scss';

export const Sidebar = ({ setHeaderTitle }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { push } = useHistory();

  const navigateToHomePage = () => {
    push(routes[0].link);
    setHeaderTitle('');
  };

  const navigate = (title) => {
    dispatch(clearAllNotifications());
    setHeaderTitle(title);
  };

  return (
    <aside className={styles.sidebar}>
      <button className={styles.logo} onClick={navigateToHomePage}>
        S
      </button>
      {isAuthenticated && (
        <>
          <nav>
            <ul className={styles.navigation}>
              {routes.map(
                ({ id, title, link, icon }) =>
                  title && (
                    <li className={styles.navigationItem} key={id}>
                      <Link
                        to={link}
                        className={cn(styles.link, { [styles.active]: pathname.includes(link) })}
                        onClick={() => navigate(title)}
                      >
                        <FontAwesomeIcon icon={icon} className={styles.icon} />
                        <div className={styles.tooltip}>{title}</div>
                      </Link>
                    </li>
                  )
              )}
            </ul>
          </nav>
          <Account setHeaderTitle={setHeaderTitle} />
        </>
      )}
    </aside>
  );
};
