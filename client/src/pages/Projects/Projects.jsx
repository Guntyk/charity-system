import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getProjects, deleteProjects } from '@redux/features/projectsSlice';
import { getOrganizations } from '@redux/features/organizationsSlice';
import { addNotification } from '@redux/features/notificationsSlice';
import styles from 'pages/Projects/Projects.scss';
import { Button } from 'components/Button';
import { Notification } from 'components/Notification';
import { Create } from 'pages/Projects/Create';
import { Dropdown } from 'components/Dropdown';
import { NoResults } from 'components/NoResults';

export const Projects = ({ setIsLoading }) => {
  const { organizations, isLoading: isOrganizationsLoading } = useSelector((state) => state.organizations);
  const { error, projects, isLoading: isProjectsLoading } = useSelector((state) => state.projects);
  const [selectedProjectsIDs, setSelectedProjectsIDs] = useState([]);
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
  }, [organizationFilter]);

  const handleDelete = async () => {
    if (selectedProjectsIDs.length > 0) {
      const result = await dispatch(deleteProjects(selectedProjectsIDs));

      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(
          addNotification({
            id: Date.now(),
            title: 'Deleted successfully',
            text: 'Selected projects have been deleted',
            type: 'success',
          })
        );
        setSelectedProjectsIDs([]);
      }
    }
  };

  const toggleSelection = (id) => {
    setSelectedProjectsIDs((prev) =>
      prev.includes(id) ? prev.filter((projectID) => projectID !== id) : [...prev, id]
    );
  };

  const clearFilter = () => {
    setProjectsList(projects);
    setOrganizationFilter(null);
  };

  return (
    <section className={styles.page}>
      <div className={styles.buttons}>
        <Button text='Create' onClick={() => setIsCreateWindowOpen(true)} />
        <Button text='Delete' onClick={handleDelete} ghostStyle disabled={selectedProjectsIDs.length === 0} />
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
          selectedValue={organizationFilter}
          setSelectedValue={(selectedOption) => setOrganizationFilter(selectedOption)}
        />
        <Button onClick={clearFilter} ghostStyle roundStyle no3D>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
        {organizationFilter && projectsList.length > 0 && (
          <p className={styles.listLength}>Found {projectsList.length} entries</p>
        )}
      </div>
      {projectsList.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Organization</th>
                <th>Costs</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {projectsList.map(({ id, name, organizationID, costs, revenue }, index) => (
                <tr key={id}>
                  <td>
                    <input
                      type='checkbox'
                      checked={selectedProjectsIDs.includes(id)}
                      onChange={() => toggleSelection(id)}
                    />
                    {index + 1}
                  </td>
                  <td>{name}</td>
                  <td>{organizations.find(({ id }) => id === organizationID)?.name}</td>
                  <td>${costs}</td>
                  <td>${revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && <NoResults text='This organization has no projects' />
      )}
      <Create isOpen={isCreateWindowOpen} setIsOpen={setIsCreateWindowOpen} />
      <Notification />
    </section>
  );
};
