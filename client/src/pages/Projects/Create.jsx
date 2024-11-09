import { faBuildingUser, faScroll } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getOrganizations } from '@redux/features/organizationsSlice';
import { createProject } from '@redux/features/projectsSlice';
import { Form } from 'components/Modal/Form';

export const Create = ({ isOpen, setIsOpen }) => {
  const { organizations } = useSelector((state) => state.organizations);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!organizations.length) {
      dispatch(getOrganizations());
    }
  }, []);

  const organizationOptions = organizations.map((org) => ({
    label: org.name,
    value: org.id,
  }));

  const fields = [
    {
      name: 'name',
      label: 'Project Name',
      type: 'text',
      placeholder: 'Enter project name',
      icon: faScroll,
      validate: (value) => (value ? '' : 'Project name is required'),
    },
    {
      name: 'organizationID',
      label: 'Organization',
      type: 'dropdown',
      placeholder: 'Select organization',
      options: organizationOptions,
      icon: faBuildingUser,
      validate: (value) => (value ? '' : 'Please select an organization'),
    },
  ];

  const handleSubmit = (formData) => {
    dispatch(createProject(formData));
  };

  return (
    <Form isOpen={isOpen} setIsOpen={setIsOpen} title='Create new project' fields={fields} onSubmit={handleSubmit} />
  );
};
