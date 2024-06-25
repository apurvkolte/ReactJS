import React from 'react';

const Loader = () => {
    return (
        <div className="unauthorizedContainer">
            <p className="unauthorizedMessage">
                <div className='loader'>
                    <div className="lds-spinner">
                        {[...Array(12)].map((_, index) => (
                            <div key={index} style={{ transform: `rotate(${30 * index}deg)` }}></div>
                        ))}
                    </div>
                </div>
            </p>
        </div>

    );
};

export default Loader;
