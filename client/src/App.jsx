import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { routes } from 'constants/routes';
import { PrivateRoute } from 'components/PrivateRoute';
import { AuthWatcher } from 'components/AuthWatcher';
import { Sidebar } from 'components/Sidebar';
import { Header } from 'components/Header';
import { Auth } from 'pages/Auth';
import styles from 'App.scss';

export default function App() {
  const [headerTitle, setHeaderTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();
  const { replace } = useHistory();

  useEffect(() => {
    if (pathname === '/') {
      replace(routes[0].link);
    }
  }, [pathname]);

  return (
    <div className={styles.app}>
      <AuthWatcher setHeaderTitle={setHeaderTitle} setIsLoading={setIsLoading} />
      <Sidebar setHeaderTitle={setHeaderTitle} />
      <div className={styles.pages}>
        <Header title={headerTitle} isLoading={isLoading} />
        <main className={styles.page}>
          <Switch>
            {routes.map(
              ({ id, link, component }) =>
                component && <PrivateRoute component={component} setIsLoading={setIsLoading} path={link} key={id} />
            )}
            <Route path='/auth' exact>
              <Auth />
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
}
