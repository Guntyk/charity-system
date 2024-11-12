import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState, useEffect } from 'react';
import cn from 'classnames';
import styles from 'components/Dropdown/Dropdown.scss';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

export const Dropdown = ({
  className,
  icon,
  options,
  placeholder,
  selectedOption,
  setSelectedOption,
  errorText,
  invalid,
  tableCellStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div
      className={cn(styles.dropdown, className, { [styles.tableCell]: tableCellStyle, [styles.invalid]: invalid })}
      ref={dropdownRef}
    >
      <div className={styles.buttonArea}>
        <button
          type='button'
          className={cn(styles.dropdownButton, {
            [styles.open]: isOpen,
            [styles.filled]: selectedOption,
          })}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup='listbox'
          aria-controls='dropdown-list'
        >
          <span className={cn(styles.text, { [styles.placeholder]: !selectedOption })}>
            {icon && <FontAwesomeIcon className={cn(styles.icon, styles.roleIcon)} icon={icon} />}
            <span>{selectedOption?.label || placeholder}</span>
          </span>
          <span className={cn(styles.arrow, { [styles.open]: isOpen })} />
          <FontAwesomeIcon className={cn(styles.icon, styles.error)} icon={faCircleExclamation} />
        </button>
        <span className={cn(styles.error, styles.errorText)}>{errorText}</span>
      </div>
      <div className={cn(styles.dropdownList, { [styles.open]: isOpen })}>
        {options.map((option) => (
          <button
            type='button'
            role='option'
            className={cn(styles.dropdownItem, {
              [styles.selectedItem]: option.value === selectedOption?.value,
            })}
            onClick={() => handleSelectOption(option)}
            aria-selected={option.value === selectedOption?.value}
            tabIndex={isOpen && option.value !== selectedOption?.value ? 0 : -1}
            key={option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
