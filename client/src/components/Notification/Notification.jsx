import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import cn from 'classnames';
import { faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import styles from 'components/Notification/Notification.scss';

export const Notification = ({ className, title, text, type, flyStyle }) => {
  const [isShown, setIsShown] = useState(true);

  const renderTitle = () => {
    switch (type) {
      case 'error':
        return 'Error';
      default:
        return title;
    }
  };

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return faCircleCheck;
      case 'error':
        return faCircleExclamation;
      default:
        return null;
    }
  };

  if (flyStyle) {
    setTimeout(() => {
      setIsShown(false);
    }, 5000);
  }

  return (
    isShown && (
      <aside className={cn(styles.notification, className, styles[type], { [styles.fly]: flyStyle })}>
        <FontAwesomeIcon icon={renderIcon()} className={cn(styles.icon, styles[type])} />
        <section className={styles.content}>
          <p className={styles.title}>{title ?? renderTitle()}</p>
          {text && <p className={styles.text}>{text}</p>}
        </section>
        {!flyStyle && (
          <button
            className={cn(styles.icon, styles.cross)}
            onClick={() => setIsShown(false)}
            title='Close notification'
          >
            Close
          </button>
        )}
      </aside>
    )
  );
};
