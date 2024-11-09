import styles from 'components/Table/Table.scss';

export const Table = ({ columns, data, renderRow, height }) => (
  <div className={styles.tableContainer} style={{ height }}>
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
          <tr key={item.id}>{renderRow(item, index)}</tr>
        ))}
      </tbody>
    </table>
  </div>
);
