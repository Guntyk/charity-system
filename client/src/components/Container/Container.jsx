import cn from 'classnames';
import styles from 'components/Container/Container.scss';

export const Container = ({ children, className }) => <div className={cn(styles.container, className)}>{children}</div>;
