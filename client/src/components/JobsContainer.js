import React, { useEffect } from 'react';
import { useAppContext } from "../context/appContext";
import Job from "./Job";
import Loading from "./Loading";
import PageBtnContainer from "./PageBtnContainer";
import Wrapper from "../assets/wrappers/JobsContainer";
import Alert from "../components/Alert";

function JobsContainer() {

  const {
    getJobs,
    isLoading,
    jobs,
    totalJobs,
    page,
    numOfPages,
    search,
    searchType,
    searchStatus,
    sort,
    showAlert
  } = useAppContext();

  useEffect(() => {
    getJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, searchType, searchStatus, sort, page])

  const renderJobs = jobs.map((job) => {
    return <Job key={job._id}{...job} />
  })

  if (isLoading) {
    return <Loading center />
  }

  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display...</h2>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      { showAlert && <Alert /> }
      <h5>{totalJobs} job{jobs.length > 1 && 's'} found</h5>
      <div className='jobs'>
        {renderJobs}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  )
};

export default JobsContainer;
