import { useEffect, useState } from 'react';
import { Dropdown } from 'components/Dropdown';
import styles from 'pages/Users/Users.scss';

export const UserRow = ({ user: { id, name, email, role }, setChangedRoles, index }) => {
  const rolesOptions = [
    { label: 'User', value: 1 },
    { label: 'Admin', value: 2 },
  ];
  const originalRole = rolesOptions.find(({ value }) => value === role);
  const [currentRole, setCurrentRole] = useState(originalRole);

  useEffect(() => {
    if (currentRole.value !== originalRole.value) {
      setChangedRoles((prev) => ({
        ...prev,
        [id]: currentRole.value,
      }));
    } else {
      setChangedRoles((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    }
  }, [currentRole]);

  return (
    <>
      <td>{index + 1}</td>
      <td>{name}</td>
      <td>{email}</td>
      <td className={styles.dropdown}>
        <Dropdown
          options={rolesOptions}
          selectedOption={currentRole}
          setSelectedOption={setCurrentRole}
          tableCellStyle
        />
      </td>
    </>
  );
};
