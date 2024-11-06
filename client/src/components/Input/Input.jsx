import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import styles from 'components/Input/Input.scss';

export const Input = ({ placeholder, type, icon, errorText, invalid, ...props }) => {
  return (
    <label className={cn(styles.field, { [styles.invalid]: invalid })}>
      <div className={styles.inputArea}>
        <input className={styles.input} type={type || 'text'} placeholder={placeholder || ''} {...props} />
        <FontAwesomeIcon className={cn(styles.icon, styles.roleIcon)} icon={icon} />
        <FontAwesomeIcon className={cn(styles.icon, styles.error, styles.errorIcon)} icon={faCircleExclamation} />
      </div>
      <span className={cn(styles.error, styles.errorText)}>{errorText}</span>
    </label>
  );
};
