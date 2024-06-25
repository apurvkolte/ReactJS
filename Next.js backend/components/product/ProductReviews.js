import React, { Fragment } from 'react';
import { IoMdStar } from 'react-icons/io';

const ProductReviews = (props) => {
    const { reviews } = props;

    return (
        <Fragment>
            <li key={reviews.id} style={{
                listStyle: 'none',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#f9f9f9'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '10px' }}>
                        <span style={{ color: '#ffd700' }}>
                            {[...Array(reviews.rating)].map((_, i) => <IoMdStar key={i} />)}
                        </span>
                    </div>
                    <div>
                        <h5 style={{ margin: '0', fontSize: '18px', color: '#333' }}>{reviews.name}</h5>
                        <p style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>{reviews.comments}</p>
                    </div>
                </div>
            </li>
        </Fragment>
    );
};

export default ProductReviews;