
// import ReadMore from "./ReadMore ";
// <ReadMore text={(String(product.description))} />

import React, { useState } from 'react';

const ReadMore = ({ text }) => {
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => { setIsReadMore(!isReadMore) };

    return (
        <p className='testimonials__quote__text'>
            {isReadMore ? text.slice(0, 350).split('\n').map(str => <div>{`\u25FE ${str}`}</div>) : text.split('\n').map(str => <div>{`\u25FE ${str}`}</div>)}
            {text.length > 350 &&
                <span className="link-des" onClick={toggleReadMore}>
                    {isReadMore ? ' ... Show description' : ' Hide description'}
                </span>
            }
        </p>
    )
}

export default ReadMore;