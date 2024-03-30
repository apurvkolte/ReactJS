import React, { useState } from 'react';


function Pagination() {
    // Sample array of data
    const data = Array.from(Array(100).keys());

    // State variables
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of items per page

    // Calculate total number of pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Calculate start and end index for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice data array to display only items for the current page
    const currentItems = data.slice(startIndex, endIndex);

    // Handle page navigation
    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="pagination-container">
            <ul>
                {currentItems.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
            <button onClick={prevPage} disabled={currentPage === 1}>
                Previous
            </button>
            <button onClick={nextPage} disabled={currentPage === totalPages}>
                Next
            </button>
            <div>
                {Array.from(Array(totalPages).keys()).map((page) => (
                    <button
                        key={page}
                        onClick={() => goToPage(page + 1)}
                        className={currentPage === page + 1 ? 'active' : ''}
                    >
                        {page + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Pagination;





// .pagination-container {
//     margin: 20px auto;
//     width: 80%;
//     text-align: center;
//   }
  
//   ul {
//     list-style: none;
//     padding: 0;
//   }
  
//   button {
//     margin: 0 5px;
//     padding: 5px 10px;
//     border: none;
//     background-color: #007bff;
//     color: #fff;
//     cursor: pointer;
//   }
  
//   button:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }
  