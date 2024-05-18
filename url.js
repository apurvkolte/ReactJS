const url = typeof window !== "undefined" ? window.location.href : "";

if (url.match(/admin/gi)) {
    import('../styles/globals.scss');
}


//or

useEffect(() => {
    if (url.match(/admin/gi)) {
        const link = document.createElement('link');
        link.href = '../styles/globals.scss'; // Adjust the path accordingly
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }
}, [url]);