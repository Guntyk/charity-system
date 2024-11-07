import { useLocation } from 'react-router-dom';
import { routes } from 'constants/routes';
import { Loader } from 'components/Loader';
import styles from 'components/Header/Header.scss';

export const Header = ({ title, isLoading }) => {
  const { pathname } = useLocation();

  const titleFromUrl = routes.find((route) => route.link === pathname)?.title;

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title || titleFromUrl || 'Charity system'}</h1>
      <Loader isActive={isLoading} />
    </header>
  );
};
