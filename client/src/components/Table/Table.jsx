import cn from 'classnames';
import styles from 'components/Table/Table.scss';

export const Table = ({ columns, data, renderRow, selectedIDs }) => (
  <div className={styles.tableContainer}>
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map(({ key, label }) => (
            <th key={key}>{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...data].reverse().map((item, index) => (
          <tr className={cn({ [styles.selected]: selectedIDs?.includes(item.id) })} key={item.id}>
            {renderRow(item, index)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
