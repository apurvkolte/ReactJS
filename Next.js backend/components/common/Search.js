import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router'
import '../../styles/app.css';

const Search = () => {
    const dispatch = useDispatch();
    const router = useRouter()
    const [keyword, setKeyword] = useState('');
    const currentURL = window.location.href;
    const { products1 } = useSelector(state => state.products)

    var tags = [];
    if (products1) {
        products1.map((product) => {
            tags.push(product.name)
        })
    }

    useEffect(() => {
        if (!currentURL.includes("search")) {
            setKeyword('');
        }

        const body = document.querySelector('#root');

        body.scrollIntoView({
            behavior: 'smooth'
        }, 500)
    }, [dispatch, currentURL]);

    const searchHandler = (e) => {
        // e.preventDefault()
        if (keyword) {
            router.push(`/search/${keyword.trim()}?${encodeURIComponent(Buffer.from(keyword.toString(), 'binary').toString('base64'))}`);
        } else {
            router.push('/')
        }
        window.location.reload()
    }

    /*list of available options*/
    var n = tags.length; //length of datalist tags

    function ac(value) {
        if (value.length) {
            document.getElementById('datalist').innerHTML = '';
            //setting datalist empty at the start of function
            //if we skip this step, same name will be repeated

            let l = value.length;
            //input query length

            for (var i = 0; i < n; i++) {
                if (((tags[i].toLowerCase()).indexOf(value.toLowerCase())) > -1) {
                    //comparing if input string is existing in tags[i] string

                    var node = document.createElement("option");
                    var val = document.createTextNode(tags[i]);
                    node.appendChild(val);

                    document.getElementById("datalist").appendChild(node);
                    //creating and appending new elements in data list
                }
            }
        }

    }

    return (
        <form onSubmit={searchHandler} >
            <div className="input-group">
                <input
                    type="text"
                    id="search_field"
                    className="form-control"
                    spellcheck="true"
                    autocomplete="off"
                    placeholder="Enter Product Name"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    list="datalist" onKeyPress={ac(keyword)}
                />
                <datalist id="datalist">
                    {products1 && products1.map((product) => {
                        <option value={`"${product.name}"`}></option>
                    })}

                </datalist>
                <div className="input-group-append">
                    <button id="search_btn" className="btn">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </form >
    )
}

export default Search
