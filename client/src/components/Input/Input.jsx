import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import styles from 'components/Input/Input.scss';

export const Input = ({ className, placeholder, type, icon, errorText, invalid, value, ...props }) => {
  return (
    <label className={cn(styles.field, className, { [styles.invalid]: invalid })}>
      <div className={styles.inputArea}>
        <input
          className={styles.input}
          value={value}
          type={type || 'text'}
          placeholder={placeholder || ''}
          {...props}
        />
        <FontAwesomeIcon
          className={cn(styles.icon, styles.roleIcon, { [styles.filled]: value?.length > 0 })}
          icon={icon}
        />
        <FontAwesomeIcon className={cn(styles.icon, styles.error, styles.errorIcon)} icon={faCircleExclamation} />
      </div>
      <span className={cn(styles.error, styles.errorText)}>{errorText}</span>
    </label>
  );
};
