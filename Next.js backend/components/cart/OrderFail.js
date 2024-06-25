import React, { Fragment } from 'react'
import Link from 'next/link'
import MetaData from '../layout/MetaData'

const OrderFail = () => {
    return (
        <div className="container-fluid">
            <Fragment>
                <MetaData title={'Order Success'} />
                <div className="row justify-content-center">
                    <div className="col-6 mt-5 text-center">
                        <img className="my-5 img-fluid d-block mx-auto" src="/images/fail.png" alt="Order Fail" width="200" height="200" />

                        <h1 className='text-danger'>Payment Failed!</h1><br />
                        <h5 >The transaction failed. If your money was debited, you should get a refund.</h5><hr />
                        <Link href='/confirm'><button className='btn btn-primary '>Please Try Again...!</button></Link><br /><br />
                    </div>
                </div>
            </Fragment>
        </div>
    )
}

export default OrderFail
