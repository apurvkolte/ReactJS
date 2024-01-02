import React from 'react';
import { Link, useLocation } from 'react-router-dom';


const Progress = () => {
  const location = useLocation();

  const isFirstStep = location.pathname === '/';
  const isSecondStep = location.pathname === '/second';
  const isThirdStep = location.pathname === '/third';
  const isLoginPage = location.pathname === '/login';

  return (
    <React.Fragment>
      {!isLoginPage ? (
        <div className="steps">
          <div className={`${isFirstStep ? 'step active' : 'step'}`}>
            <div>1</div>
            <div>
              {isSecondStep || isThirdStep ? (
                <Link to="/">Step 1</Link>
              ) : (
                'Step 1'
              )}
            </div>
          </div>
          <div className={`${isSecondStep ? 'step active' : 'step'}`}>
            <div>2</div>
            <div>
              {isThirdStep ? <Link to="/second">Step 2</Link> : 'Step 2'}
            </div>
          </div>
          <div className={`${location.pathname === '/third' ? 'step active' : 'step'}`}>
            <div>3</div>
            <div>Step 3</div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </React.Fragment>
  );
};

export default Progress;
