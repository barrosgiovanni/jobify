import React, { useState } from 'react';
import { FormRow, Alert } from "../../components";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/DashboardFormPage";

function Profile() {

  const {
    user,
    showAlert,
    displayAlert,
    updateUser,
    isLoading
  } = useAppContext();

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [lastName, setLastName] = useState(user?.lastName);
  const [location, setLocation] = useState(user?.location);

  const handleFormSubmission = (event) => {
    event.preventDefault();

    if (!name || !email || !lastName || !location) {
      displayAlert();
      return
    }
    updateUser({ name, email, lastName, location });
  };

  return (
    <Wrapper>
      <form className='form' onSubmit={handleFormSubmission}>
        <h3>Profile</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          <FormRow
            type='text'
            name='name'
            value={name}
            handleChange={(event) => setName(event.target.value)}
          />
          <FormRow
            type='text'
            labelText='Last name'
            name='lastName'
            value={lastName}
            handleChange={(event) => setLastName(event.target.value)}
          />
          <FormRow
            type='email'
            name='email'
            value={email}
            handleChange={(event) => setEmail(event.target.value)}
          />
          <FormRow
            type='text'
            name='location'
            value={location}
            handleChange={(event) => setLocation(event.target.value)}
          />
          <button
            className='btn btn-block'
            type='submit'
            disabled={isLoading}
          >{isLoading ? 'Please, wait...' : 'Submit changes'}</button>
        </div>
      </form>
    </Wrapper>
  )
};

export default Profile;
