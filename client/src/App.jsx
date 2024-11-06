import { Route, Switch } from 'react-router-dom';
import { Dashboard } from 'pages/Dashboard';
import { Auth } from 'pages/Auth';

export default function App() {
  return (
    <Switch>
      <Route path='/auth' exact>
        <Auth />
      </Route>
      <Route path='/' exact>
        <Dashboard />
      </Route>
    </Switch>
  );
}
