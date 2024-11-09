import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import styles from 'components/NoResults/NoResults.scss';

export const NoResults = ({ children, text }) => (
  <div className={styles.noResults}>
    <FontAwesomeIcon className={styles.icon} icon={faCircleXmark} />
    <p>{children ?? text ?? 'Sorry, but nothing matched your search criteria'}</p>
  </div>
);
