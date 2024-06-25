import React from 'react'
import Link from 'next/link'

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
    return (
        <div className="checkout-progress d-flex justify-content-center mt-4">
            <div className='row col-md-5 '>
                <div className='col-md-4 col-sm-12 my-2'>
                    {shipping ?
                        <Link href='shippping' className="float-right1">
                            <div>
                                <div className="triangle2-active"></div>
                                <div className="step active-step">Shipping</div>
                                <div className="triangle-active"></div>
                            </div>
                        </Link>
                        :
                        <Link href="#!" disabled>
                            <div>
                                <div className="triangle2-incomplete"></div>
                                <div className="step incomplete">Shipping</div>
                                <div className="triangle-incomplete"></div>
                            </div>
                        </Link>
                    }
                </div>
                <div className='col-md-4 col-sm-12 my-2'>
                    {confirmOrder ?
                        <Link href='/order/confirm' className="float-right1">
                            <div>
                                <div className="triangle2-active"></div>
                                <div className="step active-step">Confirm</div>
                                <div className="triangle-active"></div>
                            </div>
                        </Link>
                        :
                        <Link href="#!" disabled>
                            <div>
                                <div className="triangle2-incomplete"></div>
                                <div className="step incomplete">Confirm</div>
                                <div className="triangle-incomplete"></div>
                            </div>
                        </Link>
                    }
                </div>
                <div className='col-md-4 col-sm-12 my-2'>
                    {payment ?
                        <Link href='/payment' className="float-right1">
                            <div>
                                <div className="triangle2-active"></div>
                                <div className="step active-step">Payment</div>
                                <div className="triangle-active"></div>
                            </div>
                        </Link>
                        :
                        <Link href="#!" disabled>
                            <div>
                                <div className="triangle2-incomplete"></div>
                                <div className="step incomplete">Payment</div>
                                <div className="triangle-incomplete"></div>
                            </div>
                        </Link>
                    }
                </div>
            </div>
        </div>
    )
}

export default CheckoutSteps
