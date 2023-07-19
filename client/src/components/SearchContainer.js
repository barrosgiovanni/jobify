/* eslint-disable react-hooks/exhaustive-deps */
import { FormRow, FormRowSelect } from '../components';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';
import { useState, useMemo } from "react";

function SearchContainer() {

  const [ localSearch, setLocalSearch ] = useState('');

  const {
    isLoading,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    handleInputChange,
    clearFilters
  } = useAppContext();

  const handleSearch = (event) => {
    handleInputChange({ name: event.target.name, value: event.target.value });
  };

  const handleSearchInputCleaning = (event) => {
    event.preventDefault();
    setLocalSearch('');
    clearFilters();
  };

  const debounce = () => {
    let timeOutId;

    return (event) => {
      setLocalSearch(event.target.value);
      clearTimeout(timeOutId);
      timeOutId = setTimeout(() => {
        handleInputChange({ name: event.target.name, value: event.target.value });
      }, 800);
    };
  };

  const optimizedDebounce = useMemo(() => debounce(), []);

  return (
    <Wrapper>
      <form className='form'>
        <h4>Search & Filtering options</h4>
        <div className='form-center'>
          <FormRow
            type='text'
            name='search'
            value={localSearch}
            handleChange={optimizedDebounce}
          ></FormRow>
          <FormRowSelect
            labelText='job status'
            name='searchStatus'
            value={searchStatus}
            handleChange={handleSearch}
            list={['all', ...statusOptions]}
          ></FormRowSelect>
          <FormRowSelect
            labelText='job type'
            name='searchType'
            value={searchType}
            handleChange={handleSearch}
            list={['all', ...jobTypeOptions]}
          ></FormRowSelect>
          <FormRowSelect
            name='sort'
            value={sort}
            handleChange={handleSearch}
            list={sortOptions}
          ></FormRowSelect>
          <button
            className='btn btn-block btn-danger'
            disabled={isLoading}
            onClick={handleSearchInputCleaning}
          >
            Clear Filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
}

export default SearchContainer;
