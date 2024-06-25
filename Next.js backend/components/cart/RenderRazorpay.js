import { useEffect, useRef } from 'react';
import crypto from 'crypto-js';
import Axios from 'axios';
import { useRouter } from 'next/router';



// Function to load script and append in DOM tree.
const loadScript = src => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
        console.log('razorpay loaded successfully');
        resolve(true);
    };
    script.onerror = () => {
        console.log('error in loading razorpay');
        resolve(false);
    };
    document.body.appendChild(script);
});


const RenderRazorpay = ({ orderId, keyId, keySecret, currency, amount, }) => {
    const router = useRouter();
    const paymentId = useRef(null);
    const paymentMethod = useRef(null);

    // To load razorpay checkout modal script.
    const displayRazorpay = async (options) => {
        const res = await loadScript(
            'https://checkout.razorpay.com/v1/checkout.js',
        );

        if (!res) {
            console.log('Razorpay SDK failed to load. Are you online?');
            return;
        }
        // All information is loaded in options which we will discuss later.
        const rzp1 = new window.Razorpay(options);

        // If you want to retreive the chosen payment method.
        rzp1.on('payment.submit', (response) => {
            paymentMethod.current = response.method;
        });

        // To get payment id in case of failed transaction.
        rzp1.on('payment.failed', (response) => {
            paymentId.current = response.error.metadata.payment_id;
        });

        // to open razorpay checkout modal.
        rzp1.open();
    };


    // informing server about payment
    const handlePayment = async (status, orderDetails = {}) => {
        const { signature, orderId, paymentId } = orderDetails;
        const result = await Axios.post(`/api/payment/verification`, {
            status,
            orderDetails: {
                orderId,
                paymentId
            },
        }, {
            headers: {
                'x-razorpay-signature': signature
            }
        });


        const data = result.data

        console.log("resultresult", result);
        console.log("result", data);
        if (data.message === 'Payment verification successful') {
            router.push({
                pathname: '/success',
                query: {
                    orderId: orderId,
                    paymentId: paymentId,
                    message: data.message
                }
            });
        } else if (data.message === 'Payment fail') {
            router.push({
                pathname: '/fail'
            });
        } else {
            router.push({
                pathname: '/cancel'
            });
        }

    };


    // we will be filling this object in next step.
    const options = {
        key: keyId, // key id from props
        amount: parseFloat(amount), // Amount in lowest denomination from props
        currency, // Currency from props.
        name: 'Payment', // Title for your organization to display in checkout modal
        image: '/images/logo.png',
        order_id: orderId, // order id from props
        // This handler menthod is always executed in case of succeeded payment
        handler: (response) => {
            console.log("response", response);
            paymentId.current = response.razorpay_payment_id;

            // Most important step to capture and authorize the payment. This can be done of Backend server.
            const succeeded = crypto.HmacSHA256(`${orderId}|${response.razorpay_payment_id}`, keySecret).toString() === response.razorpay_signature;
            // If successfully authorized. Then we can consider the payment as successful
            console.log("succeededsucceeded", succeeded);
            if (succeeded) {
                handlePayment('Success', {
                    orderId,
                    paymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature,
                });
            } else {
                handlePayment('Fail', {
                    orderId,
                    paymentId: response.razorpay_payment_id,
                });
            }
        },
        modal: {
            confirm_close: true, // this is set to true, if we want confirmation when clicked on cross button.
            // This function is executed when checkout modal is closed
            // There can be 3 reasons when this modal is closed.
            ondismiss: async (reason) => {
                const {
                    reason: paymentReason, field, step, code,
                } = reason && reason.error ? reason.error : {};
                // Reason 1 - when payment is cancelled. It can happend when we click cross icon or cancel any payment explicitly. 
                if (reason === undefined) {
                    console.log('Cancel');
                    handlePayment('Cancel', { orderId });
                }
                // Reason 2 - When modal is auto closed because of time out
                else if (reason === 'TimeOut') {
                    console.log('TimeOut');
                    handlePayment('TimeOut', { orderId });
                }
                // Reason 3 - When payment gets failed.
                else {
                    console.log('Fail');
                    handlePayment('Fail', {
                        orderId
                    });
                }
            },
        },
        // This property allows to enble/disable retries.
        // This is enabled true by default. 
        retry: {
            enabled: false,
        },
        timeout: 900, // Time limit in Seconds
        theme: {
            color: '#1c6ab0', // Custom color for your checkout modal.
            // color: '#1c6ab0', // Custom color for your checkout modal.
        },
    };

    useEffect(() => {
        console.log('in razorpay');
        displayRazorpay(options);
    }, [])


    return null;
};

export default RenderRazorpay;