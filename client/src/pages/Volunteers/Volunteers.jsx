import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import { useSelectable } from 'hooks/useSelectable';
import { getVolunteers, deleteVolunteers } from '@redux/features/volunteersSlice';
import { getOrganizations } from '@redux/features/organizationsSlice';
import { addNotification } from '@redux/features/notificationsSlice';
import { NoResults } from 'components/NoResults';
import { Dropdown } from 'components/Dropdown';
import { Button } from 'components/Button';
import { Table } from 'components/Table';
import { Create } from 'pages/Volunteers/Create';
import styles from 'pages/Volunteers/Volunteers.scss';

export const Volunteers = ({ setIsLoading }) => {
  const { organizations, isLoading: isOrganizationsLoading } = useSelector((state) => state.organizations);
  const { error, volunteers, isLoading: isVolunteersLoading } = useSelector((state) => state.volunteers);
  const { selectedIDs, toggleSelection, clearSelection } = useSelectable();
  const [isCreateWindowOpen, setIsCreateWindowOpen] = useState(false);
  const [organizationFilter, setOrganizationFilter] = useState(null);
  const [volunteersList, setVolunteersList] = useState([]);
  const dispatch = useDispatch();

  const isLoading = isOrganizationsLoading || isVolunteersLoading;

  useEffect(() => {
    if (!volunteers.length) {
      dispatch(getVolunteers());
    }
    if (!organizations.length) {
      dispatch(getOrganizations());
    }
  }, []);

  useEffect(() => {
    if (volunteers.length) {
      setVolunteersList(volunteers);
    }
  }, [volunteers]);

  useEffect(() => {
    if (error) {
      dispatch(
        addNotification({
          id: Date.now(),
          title: 'Error',
          text: error,
          type: 'error',
        })
      );
    }
  }, [error]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (organizationFilter) {
      const filteredVolunteers = volunteers.filter(
        ({ organizationID }) => organizationID === organizationFilter?.value
      );
      setVolunteersList(filteredVolunteers);
    }
    clearSelection();
  }, [organizationFilter]);

  const handleDelete = async () => {
    if (selectedIDs.length > 0) {
      const result = await dispatch(deleteVolunteers(selectedIDs));

      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(
          addNotification({
            id: Date.now(),
            title: 'Deleted successfully',
            text: 'Selected projects have been deleted',
            type: 'success',
          })
        );
        clearSelection();
      }
    }
  };

  const clearFilter = () => {
    setVolunteersList(volunteers);
    setOrganizationFilter(null);
  };

  return (
    <>
      <div className={styles.buttons}>
        {selectedIDs.length > 0 && (
          <p className={styles.text}>
            Selected {selectedIDs.length} entr{selectedIDs.length > 1 ? 'ies' : 'y'}
          </p>
        )}
        <Button text='Create' onClick={() => setIsCreateWindowOpen(true)} />
        <Button text='Delete' onClick={handleDelete} ghostStyle disabled={selectedIDs.length === 0} />
      </div>
      <div className={styles.search}>
        <Dropdown
          className={styles.searchDropdown}
          icon={faSearch}
          options={organizations.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
          placeholder='Select organization'
          selectedOption={organizationFilter}
          setSelectedOption={(selectedOption) => setOrganizationFilter(selectedOption)}
        />
        <Button
          className={cn(styles.clearBtn, { [styles.active]: organizationFilter })}
          onClick={clearFilter}
          ghostStyle
          roundStyle
          no3D
        >
          <FontAwesomeIcon icon={faXmark} />
        </Button>
        {organizationFilter && volunteersList.length > 0 && (
          <p className={styles.listLength}>
            Found {volunteersList.length} entr{volunteersList.length > 1 ? 'ies' : 'y'}
          </p>
        )}
      </div>
      {volunteersList.length > 0 ? (
        <Table
          columns={[
            { key: 'checkbox', label: '' },
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'organization', label: 'Organization' },
          ]}
          data={volunteersList}
          selectedIDs={selectedIDs}
          renderRow={({ id, name, email, phoneNumber, organizationID }, index) => (
            <>
              <td onClick={() => toggleSelection(id)}>
                <input type='checkbox' checked={selectedIDs.includes(id)} />
                {index + 1}
              </td>
              <td>{name}</td>
              <td>{email}</td>
              <td>{phoneNumber}</td>
              <td>{organizations.find(({ id }) => id === organizationID)?.name}</td>
            </>
          )}
        />
      ) : (
        !isLoading && <NoResults text='This organization has no volunteers' />
      )}
      <Create isOpen={isCreateWindowOpen} setIsOpen={setIsCreateWindowOpen} />
    </>
  );
};
