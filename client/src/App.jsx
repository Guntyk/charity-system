import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { routes } from 'constants/routes';
import { PrivateRoute } from 'components/PrivateRoute';
import { Sidebar } from 'components/Sidebar';
import { Header } from 'components/Header';
import { Auth } from 'pages/Auth';
import styles from 'App.scss';

export default function App() {
  const [headerTitle, setHeaderTitle] = useState('');
  const { pathname } = useLocation();
  const { replace } = useHistory();

  useEffect(() => {
    if (pathname === '/') {
      replace(routes[0].link);
    }
  }, [pathname]);

  return (
    <div className={styles.app}>
      <Sidebar setHeaderTitle={setHeaderTitle} />
      <div className={styles.pages}>
        <Header title={headerTitle} />
        <main>
          <Switch>
            {routes.map(
              ({ id, link, component: Component }) =>
                Component &&
                link && (
                  <PrivateRoute path={link} exact key={id}>
                    <Component />
                  </PrivateRoute>
                )
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
