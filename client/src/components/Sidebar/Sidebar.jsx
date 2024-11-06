import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { logoutUser } from '@redux/features/authSlice';
import cn from 'classnames';
import { routes } from 'constants/routes';
import styles from 'components/Sidebar/Sidebar.scss';
import { Button } from 'components/Button';

export const Sidebar = ({ setHeaderTitle }) => {
  const isUserAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { push } = useHistory();

  const navigateToHomePage = () => {
    push(routes[0].link);
    setHeaderTitle('');
  };

  const logout = () => {
    dispatch(logoutUser());
    setHeaderTitle('');
  };

  return (
    <aside className={styles.sidebar}>
      <Button className={styles.logo} onClick={navigateToHomePage}>
        S
      </Button>
      {isUserAuthenticated && (
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
                        onClick={() => setHeaderTitle(title)}
                      >
                        <FontAwesomeIcon icon={icon} className={styles.icon} />
                        <div className={styles.tooltip}>{title}</div>
                      </Link>
                    </li>
                  )
              )}
            </ul>
          </nav>
          <button className={cn(styles.link, styles.exitBtn)} onClick={logout}>
            <FontAwesomeIcon icon={faRightFromBracket} className={styles.icon} />
            <div className={styles.tooltip}>Log out</div>
          </button>
        </>
      )}
    </aside>
  );
};
