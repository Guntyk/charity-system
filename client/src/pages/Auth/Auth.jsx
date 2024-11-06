import { registerUser, loginUser } from '@redux/features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import { validateField } from 'helpers/validateField';
import { Notification } from 'components/Notification';
import { Button } from 'components/Button';
import { Input } from 'components/Input';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from 'pages/Auth/Auth.scss';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 1 });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isFormValid, setIsFormValid] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const dispatch = useDispatch();
  const { replace } = useHistory();
  const { isAuthenticated, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      replace('/');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setHasSubmitted(false);
  }, [isLogin]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
    };
    if (!isLogin) {
      newErrors = { ...newErrors, name: validateField('name', formData.name) };
    }
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);

    if (!hasErrors) {
      if (isLogin) {
        dispatch(loginUser({ email: formData.email, password: formData.password }));
      } else {
        dispatch(registerUser(formData));
      }
      setFormData({ email: '', password: '', name: '', role: 1 });
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }

    setHasSubmitted(true);
  };

  return (
    <section className={styles.auth}>
      <form className={cn(styles.form, { [styles.active]: !isLogin })} onSubmit={handleSubmit}>
        <h1 className={styles.title}>{isLogin ? 'Sign In' : 'Create Account'}</h1>
        {!isLogin && (
          <Input
            value={formData.name}
            name='name'
            placeholder='Name'
            icon={faUser}
            errorText={errors.name}
            onChange={handleChange}
            invalid={errors.name}
          />
        )}
        <Input
          value={formData.email}
          name='email'
          placeholder='Email'
          icon={faEnvelope}
          errorText={errors.email}
          onChange={handleChange}
          invalid={errors.email}
        />
        <Input
          value={formData.password}
          name='password'
          placeholder='Password'
          icon={faLock}
          type='password'
          errorText={errors.password}
          onChange={handleChange}
          invalid={errors.password}
        />
        <Button
          className={styles.btn}
          text={isLogin ? 'Login' : 'Register'}
          type='submit'
          disabled={hasSubmitted && !isFormValid}
        />
        <p className={styles.authLink}>
          {isLogin ? "Don't" : 'Already'} have an account?{' '}
          <span onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Create account' : 'Sign In'}</span>
        </p>
        {error && <Notification title='Registration error' text={error} type='error' flyStyle />}
      </form>
    </section>
  );
};
