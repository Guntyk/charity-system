import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { faPhone, faScroll, faUser } from '@fortawesome/free-solid-svg-icons';
import { createOrganization } from '@redux/features/organizationsSlice';
import { Button } from 'components/Button';
import { Input } from 'components/Input';
import { Modal } from 'components/Modal';
import { validateField } from 'helpers/validateField';
import styles from 'pages/Organizations/Organizations.scss';

export const Create = ({ isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState({ name: '', manager: '', phoneNumber: '' });
  const [errors, setErrors] = useState({ name: '', manager: '', phoneNumber: '' });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const newError = validateField(name, value);
    if (hasSubmitted) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: newError }));
    }

    const hasErrors = Object.values({ ...errors, [name]: newError }).some((err) => err);
    setIsFormValid(!hasErrors);
  };

  const handleCreate = (e) => {
    e.preventDefault();

    let newErrors = {
      name: validateField('name', formData.name),
      manager: validateField('manager', formData.manager),
      phoneNumber: validateField('phoneNumber', formData.phoneNumber),
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);

    if (!hasErrors) {
      dispatch(createOrganization(formData));
      setFormData({ name: '', manager: '', phoneNumber: '' });
      setIsFormValid(true);
      setIsOpen(false);
    } else {
      setIsFormValid(false);
    }

    setHasSubmitted(true);
  };

  return (
    <Modal className={styles.createModal} isOpen={isOpen} setIsOpen={setIsOpen}>
      <span className={styles.createTitle}>Create new organization</span>
      <form className={styles.form} onSubmit={handleCreate}>
        <Input
          className={styles.input}
          value={formData.name}
          name='name'
          placeholder='Name'
          icon={faScroll}
          errorText={errors.name}
          onChange={handleChange}
          invalid={errors.name}
        />
        <Input
          className={styles.input}
          value={formData.manager}
          name='manager'
          placeholder="Manager's full name"
          icon={faUser}
          errorText={errors.manager}
          onChange={handleChange}
          invalid={errors.manager}
        />
        <Input
          className={styles.input}
          value={formData.phoneNumber}
          name='phoneNumber'
          placeholder='Phone number'
          icon={faPhone}
          errorText={errors.phoneNumber}
          onChange={handleChange}
          invalid={errors.phoneNumber}
        />
        <Button className={styles.createBtn} text='Create' type='submit' disabled={hasSubmitted && !isFormValid} />
      </form>
    </Modal>
  );
};
