import React, { useState } from 'react';

const ReadMore = ({ text }) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => { setIsReadMore(!isReadMore) };

  return (
    <p className='testimonials__quote__text'>
      {isReadMore ? text.slice(0, 350).split('\n').map(str => <li>{`${str}`}</li>) : text.split('\n').map(str => <li>{`${str}`}</li>)}
      {text.length > 350 &&
        <span className="link-des" onClick={toggleReadMore}>
          {isReadMore ? <span className='text-primary'> ... Show description</span> : <span className='text-primary'> Hide description</span>}
        </span>
      }
    </p >
  )
}

export default ReadMore;