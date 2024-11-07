import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PrivateRoute = ({ component: Component, setIsLoading, ...rest }) => {
  const isUserAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isUserAuthenticated) {
    return <Redirect to={{ pathname: '/auth', state: { from: rest.location } }} />;
  }

  return (
    <>
      <Route exact {...rest}>
        <Component setIsLoading={setIsLoading} />
      </Route>
    </>
  );
};
