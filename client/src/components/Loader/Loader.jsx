import cn from 'classnames';
import styles from 'components/Loader/Loader.scss';

export const Loader = ({ isActive }) => (
  <div className={cn(styles.wrapper, { [styles.active]: isActive })}>
    <div className={styles.loader}>
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
    </div>
  </div>
);
