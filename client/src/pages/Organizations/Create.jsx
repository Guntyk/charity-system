import { faPhone, faScroll, faUser } from '@fortawesome/free-solid-svg-icons';
import { createOrganization } from '@redux/features/organizationsSlice';
import { useDispatch } from 'react-redux';
import { Form } from 'components/Modal/Form';

export const Create = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();

  const fields = [
    {
      name: 'name',
      type: 'text',
      placeholder: 'Enter organization name',
      icon: faScroll,
      validate: (value) => (value ? '' : 'Organization name is required'),
    },
    {
      name: 'manager',
      type: 'text',
      placeholder: "Enter manager's full name",
      icon: faUser,
      validate: (value) => (value ? '' : "Manager's name is required"),
    },
    {
      name: 'phoneNumber',
      type: 'text',
      placeholder: 'Enter phone number',
      icon: faPhone,
      validate: (value) => (value.match(/^\d+$/) ? '' : 'Phone number is invalid'),
    },
  ];

  const handleSubmit = (formData) => {
    dispatch(createOrganization(formData));
  };

  return (
    <Form
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title='Create new organization'
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
};
