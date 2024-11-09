import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import styles from 'components/NoResults/NoResults.scss';

export const NoResults = ({ children, text }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.noResults}>
      <FontAwesomeIcon className={styles.icon} icon={faCircleXmark} />
      <p>{children ?? text ?? 'Sorry, but nothing matched your search criteria'}</p>
    </div>
  );
};
