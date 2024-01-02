import { signIn, useSession } from "next-auth/react";

import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
<ToastContainer />


const { data: session } = useSession();

useEffect(() => {
    // if (isAuthenticated) {
    //     toast.success("Registration Successful!");
    //     dispatch({ type: REGISTER_USER_RESET });
    //     login();
    // }

    // if (error) {
    //     toast.success(error);
    //     dispatch(clearErrors());
    // }

    // if (session?.user) {
    //     router.push(redirect || "/");
    // }

    if (verifyInput) {
        toast.error("Invalid entry...! Kindly enter valid input values for sign up")
        setVerifyInput(0)
    }

}, [dispatch, isAuthenticated, session, error, verifyInput])

const login = async () => {
    const result = await signIn('credentials', {
        redirect: false,
        email: mail,
        password: password
    })

    if (result.error) {
        toast.error(result.error);
    } else {
        window.location.href = '/'
    }
}