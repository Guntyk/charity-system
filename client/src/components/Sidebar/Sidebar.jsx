import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { routes } from 'constants/routes';
import { Account } from 'components/Sidebar/Account';
import { Button } from 'components/Button';
import styles from 'components/Sidebar/Sidebar.scss';

export const Sidebar = ({ setHeaderTitle }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const { push } = useHistory();

  const navigateToHomePage = () => {
    push(routes[0].link);
    setHeaderTitle('');
  };

  return (
    <aside className={styles.sidebar}>
      <Button className={styles.logo} onClick={navigateToHomePage}>
        S
      </Button>
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
          <Account setHeaderTitle={setHeaderTitle} />
        </>
      )}
    </aside>
  );
};
