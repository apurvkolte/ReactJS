import React from 'react';
import Link from 'next/link'

const ErrorPage = () => {
    return (
        <section id="error_page" className="section">
            <div className="container">
                <div className="error_page_content">
                    <h1>404</h1>
                    <h2>Not Found</h2>
                    <h3>Sorry, the requested page was not found.</h3>
                    <Link href="/" className="btn">Go Home</Link>
                </div>
            </div>
        </section>
    );
};

export default ErrorPage;