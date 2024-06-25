import React, { Fragment, useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { MDBDataTable } from 'mdbreact';

import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
import Dialog from "../../components/Dialog";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingInfo } from "../../redux/actions/cartActions";
import { allAddress, deleteAddress, defaultAddress, clearErrors } from '../../redux/actions/userActions';
import { DELETE_ADDRESS_RESET, DEFAULT_ADDRESS_SUCCESS } from '../../redux/constants/userConstants';
import { Buffer } from 'buffer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from "next-auth/react";

const MyAddress = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const dispatch = useDispatch();

    const [confirmId, setConfirmId] = useState();

    const { loading, error, address } = useSelector(state => state.allAddress);
    const { isDeleted, isUpdated } = useSelector(state => state.address);
    const { success } = useSelector(state => state.addressDetails);
    const { user } = useSelector(state => state.auth);
    const { isDefault } = useSelector(state => state.defaultAddress);

    useEffect(() => {
        if (session) {
            dispatch(allAddress(session.user.id));
        }
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
        if (isDeleted) {
            router.push('/my-address');
            toast.success('Address has been deleted successfully');
            dispatch({ type: DELETE_ADDRESS_RESET });
        }
        if (isDefault) {
            router.push('/my-address', { state: location.state });
            toast.success('Address has been set as default');
            dispatch({ type: DEFAULT_ADDRESS_SUCCESS });
        }
        setConfirmId(location.state);
    }, [dispatch, error, isDeleted, isDefault, session, toast]);

    const [dialog, setDialog] = useState({
        message: "",
        isLoading: false,
        nameProduct: ""
    });

    const handleDialog = useCallback((message, isLoading, nameProduct, id) => {
        setDialog({
            message,
            isLoading,
            nameProduct,
            id
        });
    }, []);

    const deleteAddressHandler = useCallback((id, name) => {
        handleDialog("Are you sure you want to delete address?", true, name, id);
    }, [handleDialog]);

    const areUSureDelete = useCallback((choose) => {
        if (choose) {
            dispatch(deleteAddress(dialog.id));
        }
        handleDialog("", false);
    }, [dispatch, dialog.id, handleDialog]);

    const defaultAddressHandler = useCallback((id) => {
        dispatch(defaultAddress(id));
    }, [dispatch]);

    const submitContinue = useCallback(() => {
        const mainAddress = address.find(add => add.main);
        if (mainAddress) {
            const { name, mobile, flat, area, landmark, city, state, country, postalCode } = mainAddress;
            dispatch(saveShippingInfo({ name, mobile, flat, area, landmark, city, state, country, postalCode }));
            router.push('/confirm');
        }
    }, [address, dispatch, router]);

    const setAddress = useMemo(() => {
        const data = {
            columns: [
                { label: 'SR. ID', field: 'id', sort: 'asc' },
                { label: 'ADDRESS', field: 'name', sort: 'asc' },
                { label: 'ACTIONS', field: 'actions' },
            ],
            rows: []
        };

        address?.forEach((add, index) => {
            const EID = Buffer.from(String(add.id), 'binary').toString('base64');
            data.rows.push({
                id: index + 1,
                name: `${add.name || ''}, ${add.mobile || ''}, ${add.flat || ''} ${add.area || ''}\n${add.landmark || ''}, ${add.city || ''}, ${add.state || ''}, ${add.country || ''} ${add.postalCode || ''}`,
                actions: (
                    <Fragment>
                        <button onClick={() => router.push(`/update-address/${EID}`)} title="Edit Address" className="btn btn-primary py-1 px-2">
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-secondary py-1 px-2 ml-2" onClick={() => deleteAddressHandler(EID, add.address)} title="Delete Address">
                            <i className="fa fa-trash"></i>
                        </button>
                        <button className={`btn ${add.main ? 'bg-danger' : 'btn-secondary'} py-1 px-2 ml-2`} title={add.main ? 'Select as Delivery Address' : 'Select as Home Address'} onClick={() => defaultAddressHandler(EID)}>
                            <i className="fa fa-home" aria-hidden="true"></i>
                        </button>
                    </Fragment>
                )
            });
        });
        return data;
    }, [address, deleteAddressHandler, defaultAddressHandler, router]);

    return (
        <Fragment>
            <MetaData title='Manage Addresses' />
            <div className='container'>
                <h1 className="my-5 heading">Your Addresses</h1>
                <div className='row'>
                    <div className='col-md-3 col-sm-12 form-group'>
                        <Link href="/add-address" state={location.state} className='my-2'>
                            <input className='btn btn-primary my-0 float-right px-4 text-white' value="ADD NEW ADDRESS" />
                        </Link>
                    </div>
                    {confirmId && (
                        <div className='col-md-9 col-sm-12 form-group'>
                            <input className='btn btn-primary my-0 float-right px-4 text-white' onClick={submitContinue} value="CONFIRM ORDER" />
                        </div>
                    )}
                </div>
                {loading ? <Loader /> : (
                    <MDBDataTable
                        data={setAddress}
                        className="container-fluid"
                        bordered
                        striped
                        hover
                    />
                )}
            </div>
            {dialog.isLoading && (
                <Dialog
                    nameProduct={dialog.nameProduct}
                    onDialog={areUSureDelete}
                    message={dialog.message}
                    id={dialog.id}
                />
            )}
            <ToastContainer />
        </Fragment>
    );
};

export default MyAddress;
