import React from 'react';
import Link from 'next/link';

const EmptyView = (props) => {
    const { icon, msg, li, btnText } = props;

    return (
        <>
            <div className="empty_view_wrapper">
                <div className="empty_view_icon">
                    {icon}
                </div>
                <h2>{msg}</h2>
                {
                    li && (
                        <Link href={li}>
                            <a className="btn">{btnText}</a>
                        </Link>
                    )
                }
            </div>
        </>
    );
};

export default EmptyView;
