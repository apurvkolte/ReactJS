import React, { useContext, useEffect, useState } from 'react';
import { signOut, useSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
<ToastContainer />

const { data: session } = useSession();
{ session?.user.name }

useEffect(() => {
}, [session]);


const logoutHandler = () => {
    // dispatch(logout());
    signOut()
    toast.success('Logged out successfully.');
    // window.location.href("/")
}