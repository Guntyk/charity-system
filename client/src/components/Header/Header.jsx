import styles from 'components/Header/Header.scss';

export const Header = ({ title }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title || 'Charity system'}</h1>
    </header>
  );
};
