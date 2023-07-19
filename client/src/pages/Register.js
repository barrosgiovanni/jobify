import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo, FormRow, Alert } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { useAppContext } from '../context/appContext';

const initialState = {
  name: '',
  email: '',
  password: '',
  isUserRegistered: true
};

function Register() {

  const [values, setValues] = useState(initialState);
  const navigate = useNavigate();
  const {
    user,
    isLoading,
    showAlert,
    displayAlert,
    clearAlert,
    registerUser,
    loginUser
  } = useAppContext();

  const handleFormSubmission = (e) => {
    e.preventDefault();
    const { name, email, password, isUserRegistered } = values;

    if (!email || !password || (!isUserRegistered && !name)) {
      displayAlert();
      clearAlert();
      return
    }

    const currentUser = { name, email, password };

    if (isUserRegistered) {
      loginUser(currentUser);
    } else {
      registerUser(currentUser);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleToggle = () => {
    setValues({ ...values, isUserRegistered: !values.isUserRegistered });
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/');
      }, 3500);
    }
  }, [user, navigate])


  return (
    <Wrapper className='full-page'>
      <form className='form' onSubmit={handleFormSubmission}>
        <Logo />
        <h3>{values.isUserRegistered ? 'Login' : 'Register'}</h3>
        { showAlert && <Alert />}
        { !values.isUserRegistered && (
          <FormRow
            type='text'
            name='name'
            value={values.name}
            handleChange={handleChange}
          />
        )}
        <FormRow
          type='email'
          name='email'
          value={values.email}
          handleChange={handleChange}
        />
        <FormRow
          type='password'
          name='password'
          value={values.password}
          handleChange={handleChange}
        />
        <button
          type='submit'
          className='btn btn-block'
          disabled={isLoading}>
          Submit
        </button>
        <button
          type='button'
          className='btn btn-block btn-hipster'
          disabled={isLoading}
          onClick={()=> loginUser({ email: 'testuser@test.com', password: '123456' })}>
          Guest User
        </button>
        <p>{ values.isUserRegistered ? 'Not a member yet?' : 'Already a member?' }
          <button type='button' onClick={handleToggle} className='member-btn'>
            { values.isUserRegistered ? 'Register' : 'Login' }
          </button>
        </p>
      </form>
    </Wrapper>
  )
};

export default Register;
