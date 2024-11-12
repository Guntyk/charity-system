import { faComment, faMoneyBill1Wave, faPlusMinus, faSitemap, faUser } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { createTransaction } from '@redux/features/transactionsSlice';
import { Form } from 'components/Modal/Form';

export const Create = ({ isOpen, setIsOpen }) => {
  const { volunteers } = useSelector((state) => state.volunteers);
  const { projects } = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  const volunteersOptions = volunteers.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const projectsOptions = projects.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const transactionTypeOptions = [
    { label: 'Deposit', value: 'deposit' },
    { label: 'Withdrawal', value: 'withdrawal' },
  ];

  const fields = [
    {
      name: 'volunteerID',
      type: 'dropdown',
      placeholder: 'Select volunteer',
      options: volunteersOptions,
      icon: faUser,
      validate: (value) => (value ? '' : 'Please select a volunteer'),
    },
    {
      name: 'type',
      type: 'dropdown',
      placeholder: 'Select transaction type',
      options: transactionTypeOptions,
      icon: faPlusMinus,
      validate: (value) => (value ? '' : 'Please select a transaction type'),
    },
    {
      name: 'amount',
      type: 'text',
      placeholder: 'Enter transaction amount',
      icon: faMoneyBill1Wave,
      inputMode: 'numeric',
      inputType: 'number',
      validate: (value) => (value ? '' : 'Transaction amount is required'),
    },
    {
      name: 'projectID',
      type: 'dropdown',
      placeholder: 'Select project',
      options: projectsOptions,
      icon: faSitemap,
      validate: (value) => (value ? '' : 'Please select a project'),
    },
    {
      name: 'purpose',
      type: 'text',
      placeholder: 'Enter purpose of transaction',
      icon: faComment,
    },
  ];

  const handleSubmit = (formData) => {
    dispatch(createTransaction(formData));
  };

  return (
    <Form
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title='Create new transaction'
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
};
