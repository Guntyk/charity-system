import React, { useState, useEffect } from 'react';
import { Dropdown } from 'components/Dropdown';
import { Button } from 'components/Button';
import { Modal } from 'components/Modal';
import { Input } from 'components/Input';
import styles from 'components/Modal/Form/Form.scss';

export const Form = ({ isOpen, setIsOpen, title, fields, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    initForm();
  }, [fields]);

  const initForm = () => {
    const initialData = {};
    const initialErrors = {};
    fields.forEach((field) => {
      initialData[field.name] = field.defaultValue || '';
      initialErrors[field.name] = '';
    });
    setFormData(initialData);
    setErrors(initialErrors);
  };

  const handleChange = (name, value, validate) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validate ? validate(value) : '';
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));

    const hasErrors = Object.values({ ...errors, [name]: error }).some((err) => err);
    setIsFormValid(!hasErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const newErrors = {};
    fields.forEach(({ name, validate }) => {
      newErrors[name] = validate ? validate(formData[name]) : '';
    });
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);

    if (!hasErrors) {
      onSubmit(formData);
      setIsOpen(false);
      handleReset();
    }
  };

  const handleReset = () => {
    initForm();
    setHasSubmitted(false);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <span className={styles.title}>{title}</span>
      <form className={styles.form} onSubmit={handleSubmit}>
        {fields.map(({ name, type, placeholder, icon, options, validate, inputMode, inputType }) => (
          <React.Fragment key={name}>
            {type === 'text' && (
              <Input
                value={formData?.[name] || ''}
                name={name}
                type={inputType}
                inputMode={inputMode}
                placeholder={placeholder}
                icon={icon}
                errorText={errors?.[name]}
                onChange={(e) => handleChange(name, e.target.value, validate)}
                invalid={hasSubmitted && !!errors?.[name]}
              />
            )}
            {type === 'dropdown' && (
              <Dropdown
                icon={icon}
                options={options}
                placeholder={placeholder}
                selectedOption={options.find((opt) => opt.value === formData[name])}
                setSelectedOption={(option) => handleChange(name, option.value, validate)}
                errorText={errors?.[name]}
                invalid={hasSubmitted && !!errors?.[name]}
              />
            )}
          </React.Fragment>
        ))}
        <div className={styles.buttons}>
          <Button className={styles.btn} text='Reset' type='reset' onClick={handleReset} ghostStyle />
          <Button className={styles.btn} text='Create' type='submit' disabled={hasSubmitted && !isFormValid} />
        </div>
      </form>
    </Modal>
  );
};
