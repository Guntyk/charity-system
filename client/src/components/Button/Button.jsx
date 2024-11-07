import cn from 'classnames';
import styles from 'components/Button/Button.scss';

export const Button = ({ children, text, className, isLoading, ghostStyle, roundStyle, noStyle, type, ...props }) => {
  const buttonClasses = cn(className, {
    [styles.btn]: !noStyle,
    [styles.btnGhost]: ghostStyle,
    [styles.btnRounded]: roundStyle,
    [styles.loading]: isLoading,
  });

  return (
    <button className={buttonClasses} type={type || 'button'} {...props}>
      {children ?? text}
    </button>
  );
};
