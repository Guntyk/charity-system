import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import cn from 'classnames';
import { faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { removeNotification } from '@redux/features/notificationsSlice';
import styles from 'components/Notification/Notification.scss';

export const Notification = ({ position = 'bottom-right' }) => {
  const notifications = useSelector((state) => state.notifications.notifications);
  const dispatch = useDispatch();

  useEffect(() => {
    notifications.forEach(({ id, duration, autoClose = true }) => {
      if (autoClose) {
        setTimeout(() => {
          dispatch(removeNotification(id));
        }, duration || 5000);
      }
    });
  }, [notifications, dispatch]);

  return (
    <div className={cn(styles.notificationContainer, styles[position])}>
      {notifications.map(({ id, type, title, text }) => (
        <aside key={id} className={cn(styles.notification, styles[type])}>
          <FontAwesomeIcon icon={type === 'success' ? faCircleCheck : faCircleExclamation} className={styles.icon} />
          <section>
            <p className={styles.title}>{title}</p>
            {text && <p className={styles.text}>{text}</p>}
          </section>
          <button className={styles.closeButton} onClick={() => dispatch(removeNotification(id))}>
            &times;
          </button>
        </aside>
      ))}
    </div>
  );
};
