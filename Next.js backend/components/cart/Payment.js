import React, { Fragment, useState, useEffect } from 'react'
import Link from 'next/link'
import MetaData from '../layout/MetaData'
const Payment = () => {
    useEffect(() => {
        return () => {
            setTimeout(orderSuccess, 0)
        }

    }, [])

    function orderSuccess() {
        sessionStorage.removeItem('orderInfo')
    }

    return (
        <div className="container-fluid">
            <Fragment>
                <MetaData title={'Cancel Payment'} />
                <div className="row wrapper">
                    <div className="col-12 col-lg-12 my-5">
                        <div className="row justify-content-center">
                            <div className="col-6 text-center"><br />
                                <img className="img-fluid d-block mx-auto" src="/images/cancel.png" alt="Order cancel" width="200" height="200" />

                                <h1 className='text-danger'>Payment Cancel!</h1>
                                <hr />
                                <Link href='/'><button className='btn btn-primary'>Home...!</button></Link>
                                <hr />
                            </div>
                        </div>

                    </div>
                </div>
            </Fragment>
        </div>
    )
}
export default Payment
