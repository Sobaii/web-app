import React from 'react';
import Button from './Button';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center mt-4 space-x-2">
      <Button
        text="Previous"
        variant="secondary"
        disabled={currentPage === 1}
        handleClick={() => onPageChange(currentPage - 1)}
      />
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        text="Next"
        variant="secondary"
        disabled={currentPage === totalPages}
        handleClick={() => onPageChange(currentPage + 1)}
      />
    </div>
  );
};

export default Pagination;