import React, { useEffect } from 'react';

const index = () => {
    useEffect(() => {
        const addGoogleTranslateScript = () => {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.body.appendChild(script);
        };

        // Initialize Google Translate
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                { pageLanguage: 'en' },
                'google_translate_element'
            );
        };

        addGoogleTranslateScript();
    }, []);

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <h1>My React App with Google Translate</h1>
            <div id="google_translate_element"></div>
            <p>
                This is an example of integrating Google Translate into a React website.
            </p>
        </div>
    );
};

export default App;
