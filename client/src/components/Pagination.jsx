import React from 'react';
// import './Pagination.css';

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push(-1);
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push(-1);
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        Previous
      </button>
      
      <div className="pagination-pages">
        {getPageNumbers().map((page, index) => (
          page === -1 ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">…</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`pagination-page ${page === currentPage ? 'active' : ''}`}
            >
              {page}
            </button>
          )
        ))}
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );
}