import React from 'react';
import { FormRow, FormRowSelect, Alert } from "../../components";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/DashboardFormPage";

function AddJob() {

  const {
    isLoading,
    isEditing,
    editJobId,
    editJob,
    showAlert,
    displayAlert,
    handleInputChange,
    createJob,
    clearInputFields,
    position,
    company,
    jobLocation,
    jobTypeOptions,
    jobType,
    statusOptions,
    status
  } = useAppContext();

  const handleFormSubmission = (event) => {
    event.preventDefault();

    if (!position || !company || !jobLocation) {
      displayAlert();
      return
    }

    if (isEditing) {
      editJob(editJobId);
      return
    }

    createJob();
    // clearInputFields();
  };

  const handleJobInput = (event) => {
    handleInputChange({ name: event.target.name, value: event.target.value });
  };

  const handleInputCleaning = (event) => {
    event.preventDefault();
    clearInputFields();
  };

  return (
    <Wrapper>
      <form className='form'>
        <h3>{isEditing ? 'Edit Job' : 'Add Job'}</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          <FormRow
            type='text'
            name='position'
            value={position}
            handleChange={handleJobInput}
          />
          <FormRow
            type='text'
            name='company'
            value={company}
            handleChange={handleJobInput}
          />
          <FormRow
            type='text'
            labelText='location'
            name='jobLocation'
            value={jobLocation}
            handleChange={handleJobInput}
          />
          <FormRowSelect
            name='status'
            value={status}
            list={statusOptions}
            handleChange={handleJobInput}
          />
          <FormRowSelect
            name='jobType'
            labelText='Job Type'
            value={jobType}
            list={jobTypeOptions}
            handleChange={handleJobInput}
          />
          <div className='btn-container'>
            <button
              className='btn btn-block submit-btn'
              type='submit'
              onClick={handleFormSubmission}
              disabled={isLoading}
            >
              {isEditing ? 'Save Changes' : 'Add Job'}
            </button>
          </div>
          <div className='btn-container'>
            <button
              className='btn btn-block clear-btn'
              onClick={handleInputCleaning}
            >
              Clear Fields
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  )
}

export default AddJob;
