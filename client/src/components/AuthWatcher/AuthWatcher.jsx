import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export const AuthWatcher = ({ setHeaderTitle, setIsLoading }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const { replace } = useHistory();

  useEffect(() => {
    if (!isAuthenticated) {
      replace('/auth');
      setHeaderTitle('');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

  return null;
};
