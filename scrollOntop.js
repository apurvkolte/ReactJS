function scrollTop() {
    const body = document.querySelector('#root');

    body.scrollIntoView({
        behavior: 'smooth'
    }, 500)
}

<button className="scrollTop bg-light" title="Top" onClick={scrollTop} ><i className="fa fa-chevron-up text-danger" aria-hidden="true"></i></button>


//for automatic 
useEffect(() => {
    body.scrollIntoView({
        behavior: 'smooth'
    }, 500)
}, [dispatch, success, error]);