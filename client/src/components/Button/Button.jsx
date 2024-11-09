import cn from 'classnames';
import styles from 'components/Button/Button.scss';

export const Button = ({
  children,
  text,
  className,
  isLoading,
  ghostStyle,
  roundStyle,
  no3D,
  noStyle,
  type,
  ...props
}) => {
  const buttonClasses = cn(className, {
    [styles.btn]: !noStyle,
    [styles.ghost]: ghostStyle,
    [styles.rounded]: roundStyle,
    [styles.loading]: isLoading,
    [styles.no3D]: no3D,
  });

  return (
    <button className={buttonClasses} type={type || 'button'} {...props}>
      {children ?? text}
    </button>
  );
};
