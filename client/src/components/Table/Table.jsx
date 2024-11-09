import styles from 'components/Table/Table.scss';

export const Table = ({ columns, data, renderRow }) => (
  <table className={styles.table}>
    <thead>
      <tr>
        {columns.map(({ key, label }) => (
          <th key={key}>{label}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((item, index) => (
        <tr key={item.id}>{renderRow(item, index)}</tr>
      ))}
    </tbody>
  </table>
);
