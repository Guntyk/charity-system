import { useRef, useState, useEffect } from 'react';
import cn from 'classnames';
import styles from 'components/Dropdown/Dropdown.scss';

export const Dropdown = ({ className, options, placeholder, selectedValue, setSelectedValue, tableCellStyle }) => {
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
  }, [isOpen, setIsOpen]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelectOption = (option) => {
    setSelectedValue(option);
    setIsOpen(false);
  };

  return (
    <div className={cn(styles.dropdown, className, { [styles.tableCell]: tableCellStyle })} ref={dropdownRef}>
      <button
        type='button'
        className={cn(styles.dropdownButton, {
          [styles.open]: isOpen,
          [styles.filled]: selectedValue,
        })}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup='listbox'
        aria-controls='dropdown-list'
      >
        <span className={cn(styles.text, { [styles.placeholder]: !selectedValue })}>
          {selectedValue || placeholder}
        </span>
        <span className={cn(styles.arrow, { [styles.open]: isOpen })} />
      </button>
      <div className={cn(styles.dropdownList, { [styles.open]: isOpen })}>
        {options.map((option) => (
          <button
            type='button'
            role='option'
            className={cn(styles.dropdownItem, {
              [styles.selectedItem]: option === selectedValue,
            })}
            onClick={() => handleSelectOption(option)}
            aria-selected={option === selectedValue}
            tabIndex={isOpen && option !== selectedValue ? '0' : '-1'}
            key={option}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
