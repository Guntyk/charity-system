export const validateField = (name, value) => {
  let error = '';

  switch (name) {
    case 'email':
      if (!value) {
        error = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = 'Invalid email format';
      }
      break;
    case 'password':
      if (!value) {
        error = 'Password is required';
      } else if (value.length < 6) {
        error = 'Password must be at least 6 characters';
      }
      break;
    case 'name':
      if (!value) {
        error = 'Name is required';
      } else if (value.length < 2) {
        error = 'Name must be at least 2 characters';
      }
      break;
    default:
      break;
  }
  return error;
};
