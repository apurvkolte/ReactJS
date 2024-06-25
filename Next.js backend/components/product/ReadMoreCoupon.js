import React, { useState } from 'react';

const ReadMoreCoupon = ({ text }) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => { setIsReadMore(!isReadMore) };

  return (
    <p className='testimonials__quote__text'>
      {isReadMore ? text.slice(0, 35).split('\n').map(str => <div><br />{`\u25CF ${str}`}</div>) : text.split('\n').map(str => <div>{`\u25CF ${str}`}</div>)}

      {text.length > 35 &&
        <span className="link-des" onClick={toggleReadMore}>
          {isReadMore ? <center >Show Offer Details <i className="fa fa-chevron-up" aria-hidden="true"></i></center> : <center>Hide Offer Details <i className="fa fa-chevron-down" aria-hidden="true"></i></center>}
        </span>
      }
    </p>
  )
}

export default ReadMoreCoupon;