import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import { useSelectable } from 'hooks/useSelectable';
import { getProjects, deleteProjects } from '@redux/features/projectsSlice';
import { getOrganizations } from '@redux/features/organizationsSlice';
import { addNotification } from '@redux/features/notificationsSlice';
import { NoResults } from 'components/NoResults';
import { Dropdown } from 'components/Dropdown';
import { Button } from 'components/Button';
import { Table } from 'components/Table';
import { Create } from 'pages/Projects/Create';
import styles from 'pages/Projects/Projects.scss';

export const Projects = ({ setIsLoading }) => {
  const { organizations, isLoading: isOrganizationsLoading } = useSelector((state) => state.organizations);
  const { error, projects, isLoading: isProjectsLoading } = useSelector((state) => state.projects);
  const { selectedIDs, toggleSelection, clearSelection } = useSelectable();
  const [isCreateWindowOpen, setIsCreateWindowOpen] = useState(false);
  const [organizationFilter, setOrganizationFilter] = useState(null);
  const [projectsList, setProjectsList] = useState([]);
  const dispatch = useDispatch();

  const isLoading = isProjectsLoading || isOrganizationsLoading;

  useEffect(() => {
    if (!projects.length) {
      dispatch(getProjects());
    }
    if (!organizations.length) {
      dispatch(getOrganizations());
    }
  }, []);

  useEffect(() => {
    if (projects.length) {
      setProjectsList(projects);
    }
  }, [projects]);

  useEffect(() => {
    if (error) {
      dispatch(
        addNotification({
          id: Date.now(),
          title: 'Error!',
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
      const filteredProjects = projects.filter(({ organizationID }) => organizationID === organizationFilter?.value);
      setProjectsList(filteredProjects);
    }
    clearSelection();
  }, [organizationFilter]);

  const handleDelete = async () => {
    if (selectedIDs.length > 0) {
      const result = await dispatch(deleteProjects(selectedIDs));

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
    setProjectsList(projects);
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
        {organizationFilter && projectsList.length > 0 && (
          <p className={styles.listLength}>
            Found {projectsList.length} entr{projectsList.length > 1 ? 'ies' : 'y'}
          </p>
        )}
      </div>
      {projectsList.length > 0 ? (
        <Table
          columns={[
            { key: 'checkbox', label: '' },
            { key: 'name', label: 'Name' },
            { key: 'organization', label: 'Organization' },
            { key: 'costs', label: 'Costs' },
            { key: 'revenue', label: 'Revenue' },
            { key: 'total', label: 'Total' },
          ]}
          data={projectsList}
          selectedIDs={selectedIDs}
          renderRow={({ id, name, organizationID, costs, revenue }, index) => {
            const total = revenue - costs;

            return (
              <>
                <td onClick={() => toggleSelection(id)}>{index + 1}</td>
                <td>{name}</td>
                <td>{organizations.find(({ id }) => id === organizationID)?.name}</td>
                <td>{costs ? `-$${Math.abs(costs)}` : '$0'}</td>
                <td>{revenue ? `+$${Math.abs(revenue)}` : '$0'}</td>
                <td className={cn({ [styles.cost]: total < 0, [styles.revenue]: total > 0 })}>
                  {total === 0 ? '$0' : `${total > 0 ? '+' : '-'}$${Math.abs(total)}`}
                </td>
              </>
            );
          }}
        />
      ) : (
        !isLoading && <NoResults text='This organization has no projects' />
      )}
      <Create isOpen={isCreateWindowOpen} setIsOpen={setIsCreateWindowOpen} />
    </>
  );
};
