import { faBuildingUser, faUser, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getOrganizations } from '@redux/features/organizationsSlice';
import { createVolunteer } from '@redux/features/volunteersSlice';
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
      type: 'text',
      placeholder: "Enter volunteer's full name",
      icon: faUser,
      validate: (value) => (value ? '' : "Volunteer's full name is required"),
    },
    {
      name: 'email',
      type: 'text',
      placeholder: "Enter volunteer's email",
      icon: faEnvelope,
      validate: (value) =>
        value && /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? '' : 'Please enter a valid email address',
    },
    {
      name: 'phoneNumber',
      type: 'text',
      placeholder: "Enter volunteer's phone number",
      icon: faPhone,
      validate: (value) => (value && /^[\d-+\s()]+$/.test(value) ? '' : 'Please enter a valid phone number'),
    },
    {
      name: 'organizationID',
      type: 'dropdown',
      placeholder: 'Select organization',
      options: organizationOptions,
      icon: faBuildingUser,
      validate: (value) => (value ? '' : 'Please select an organization'),
    },
  ];

  const handleSubmit = (formData) => {
    dispatch(createVolunteer(formData));
  };

  return (
    <Form isOpen={isOpen} setIsOpen={setIsOpen} title='Create new volunteer' fields={fields} onSubmit={handleSubmit} />
  );
};
