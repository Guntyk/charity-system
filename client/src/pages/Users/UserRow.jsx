import { useEffect, useState } from 'react';
import { Dropdown } from 'components/Dropdown';
import styles from 'pages/Users/Users.scss';

export const UserRow = ({ user: { id, name, email, role }, setChangedRoles, index }) => {
  const [currentRole, setCurrentRole] = useState(role === 1 ? 'User' : 'Admin');
  const originalRole = role === 1 ? 'User' : 'Admin';

  useEffect(() => {
    const newRoleValue = currentRole === 'User' ? 1 : 2;
    const originalRoleValue = originalRole === 'User' ? 1 : 2;

    if (newRoleValue !== originalRoleValue) {
      setChangedRoles((prev) => ({
        ...prev,
        [id]: newRoleValue,
      }));
    } else {
      setChangedRoles((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    }
  }, [currentRole, originalRole, id, setChangedRoles]);

  return (
    <tr>
      <td>{index + 1}</td>
      <td>{name}</td>
      <td>{email}</td>
      <td className={styles.role}>
        <Dropdown
          options={['User', 'Admin']}
          selectedValue={currentRole}
          setSelectedValue={setCurrentRole}
          tableCellStyle
        />
      </td>
    </tr>
  );
};
