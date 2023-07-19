import React from 'react';
import Wrapper from "../assets/wrappers/PageBtnContainer";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import { useAppContext } from "../context/appContext";

function PageBtnContainer() {

  const { numOfPages, page, changePage } = useAppContext();

  const pages = Array.from({ length: numOfPages }, (_, index) => {
    return index + 1;
  });

  const handlePreviousPage = () => {
    if (page > 1) {
      changePage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page !== numOfPages) {
      changePage(page + 1);
    }
  };

  const handlePageChange = (pageNumber) => {
    changePage(pageNumber);
  };

  const renderPageNumbers = pages.map((pageNumber) => {
    return (
      <button
        type='button'
        className={pageNumber === page ? 'pageBtn active' : 'pageBtn'}
        key={pageNumber}
        onClick={() => handlePageChange(pageNumber)}
      >
      {pageNumber}
      </button>
    )
  });

  return (
    <Wrapper>
      <button className='prev-btn' disabled={page === 1} onClick={handlePreviousPage}>
        <HiChevronDoubleLeft />
        Prev
      </button>
      <div className='btn-container'>
        {renderPageNumbers}
      </div>
      <button className='next-btn' disabled={page === numOfPages} onClick={handleNextPage}>
        Next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  )
}

export default PageBtnContainer;
