import React, { Fragment } from 'react'
import Link from 'next/link'
import MetaData from '../layout/MetaData'

const OrderError = () => {
    return (
        <div className="container-fluid">
            <Fragment>
                <MetaData title={'Order Success'} />
                <div className="row justify-content-center">
                    <div className="col-6 mt-5 text-center">
                        <img className="my-5 img-fluid d-block mx-auto" src="/images/fail.png" alt="Order Fail" width="200" height="200" />

                        <h1 className='text-danger'>Tranaction Failed!</h1><br />
                        <h4 >The transaction failed due to technical error. If your money was debited, you should get a refund.</h4><br />

                        <Link href='/'><Fragment><button className='btn b bg-dark text-white '>Go to Back...!</button></Fragment></Link><br /><br />
                    </div>
                </div>
            </Fragment >
        </div >
    )
}

export default OrderError
