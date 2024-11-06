import cn from 'classnames';
import styles from 'components/Button/Button.scss';

export const Button = ({ children, text, className, ghostStyle, noStyle, type, ...props }) => {
  const buttonClasses = cn(className, {
    [styles.btn]: !noStyle,
    [styles.btnGhost]: ghostStyle,
  });

  return (
    <button className={buttonClasses} type={type || 'button'} {...props}>
      {children ?? text}
    </button>
  );
};
