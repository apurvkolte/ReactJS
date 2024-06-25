import React, { Fragment, useState, useEffect, useMemo } from 'react';
import dynamic from "next/dynamic";
import { MDBDataTable } from 'mdbreact'
import { useRouter } from 'next/router'
import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
const Sidebar = dynamic(() => import('./Sidebar'));
const MemoizedSidebar = React.memo(Sidebar);
import Dialog from "../Dialog";
import DialogSendCoupon from "../DialogSendCoupon";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { getAllCoupons, deleteCoupon, clearErrors } from '../../redux/actions/orderActions'
import { shareCoupons } from '../../redux/actions/userActions'
import { DELETE_COUPON_SUCCESS } from '../../redux/constants/orderConstants'
import { CSVLink } from 'react-csv';
import { allUsers } from '../../redux/actions/userActions'
import { Buffer } from 'buffer'

const CouponAll = () => {
    const router = useRouter()

    const dispatch = useDispatch();

    const { loading, error, coupons } = useSelector(state => state.allCoupons);
    const { isDeleted } = useSelector(state => state.couponDelete);
    const { users } = useSelector(state => state.allUsers);

    useEffect(() => {
        dispatch(getAllCoupons());
        dispatch(allUsers());

        if (error) {
            toast.error(error);
            dispatch(clearErrors())
        }

        if (isDeleted) {
            router.push('/admin/coupons');
            toast.success('Coupons deleted successfully');
            dispatch({ type: DELETE_COUPON_SUCCESS })
        }
        // if (isUpdated) {
        //     history.push('/admin/coupons');
        //     toast.success('coupons Updated Successfully');
        //     dispatch({ type: UPDATE_coupons_RESET })
        // }
        // if (success) {
        //     history.push('/admin/coupons');
        //     toast.success('Operation has been completed Successfully');
        //     dispatch({ type: CREATE_coupons_RESET })
        // }
    }, [dispatch, toast, error, isDeleted])

    // function share(id, email) {
    //     // const formData = new FormData();
    //     // formData.forEach((value, key) => email[key] = value);
    //     // var json = email
    //     const mid = JSON.parse(JSON.stringify(email));
    //     dispatch(shareCoupons(id, mid))
    // }

    const sidebar = useMemo(() => <MemoizedSidebar />, []);

    const userEmail = useMemo(() => {
        if (users) {
            return users.map(ele => ele.email);
        }
        return [];
    }, [users]);

    const [dialog, setDialog] = useState({
        message: "",
        isLoading: false,
        //Update
        nameProduct: ""
    });

    const handleDialog = (message, isLoading, nameProduct, id) => {
        setDialog({
            message,
            isLoading,
            //Update
            nameProduct,
            id
        });
    };

    const deleteCouponsHandler = (id, name) => {
        handleDialog("Are you sure you want to delete coupon?", true, name, id);
    }

    const areUSureDelete = (choose) => {
        if (choose) {
            dispatch(deleteCoupon(dialog.id))
            handleDialog("", false);
        } else {
            handleDialog("", false);
        }
    }

    //send email dialog
    const [dialogEmail, setDialogEmail] = useState({
        message: "",
        isLoading: false,
        id: ""
    });

    const handleDialogEmail = (message, isLoading, id) => {
        setDialogEmail({
            message,
            isLoading,
            id
        });
    };

    const sendCouponsHandler = (id) => {
        handleDialogEmail("Are you sure you want to send coupon to all user?", true, id);
    }

    const areUSureDelete1 = (choose) => {
        if (choose) {
            const mid = JSON.parse(JSON.stringify(userEmail));
            dispatch(shareCoupons(dialogEmail.id, mid));
            toast.success('Promo Code has been sent Successfully');
            handleDialogEmail("", false);
        } else {
            handleDialogEmail("", false);
        }
    }

    const csvData = useMemo(() => JSON.parse(JSON.stringify(coupons || [])), [coupons]);
    const [list, setList] = useState({ display: "block" });
    const hide = () => {
        if (list.display === "block") {
            setList({ display: "none" })
        } else {
            setList({ display: "block" })
        }
    }

    const setcoupons = useMemo(() => {
        const data = {
            columns: [
                { label: 'Sr. NO.', field: 'id', sort: 'asc', width: 100 },
                { label: 'Coupons', field: 'coup', sort: 'asc', width: 150 },
                { label: 'Cashback', field: 'cashback', sort: 'asc', width: 150 },
                { label: 'Descriptions', field: 'descriptions', sort: 'asc', width: 200 },
                { label: 'Expiry', field: 'lastDate', sort: 'asc', width: 150 },
                { label: 'Min Value', field: 'minValue', sort: 'asc', width: 150 },
                { label: 'Actions', field: 'actions', width: 150 },
            ],
            rows: [],
        };

        coupons && coupons.forEach(coupon => {
            const EID = Buffer.from(coupon.id.toString(), 'binary').toString('base64');
            data.rows.push({
                id: EID,
                coup: coupon.coupon_code,
                cashback: coupon.cashback,
                descriptions: coupon.description,
                lastDate: new Date(coupon.lastDate).toLocaleDateString('en-IN'),
                minValue: coupon.minValue,
                actions: (
                    <Fragment>
                        <button onClick={() => { window.location.href = `/admin/coupons/${EID}` }} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger bg-danger py-1 px-2 ml-2" onClick={() => deleteCouponsHandler(EID, coupon.coupon_code)} >
                            <i className="fa fa-trash"></i>
                        </button>
                        <button title='Share to E-mail' onClick={() => sendCouponsHandler(EID)} className="btn btn-info bg-info  py-1 px-2 ml-2 ">
                            <i className="fa fa-share" aria-hidden="true"></i>
                        </button>
                    </Fragment>
                ),
            });
        });

        return data;
    }, [coupons, deleteCouponsHandler, sendCouponsHandler]);
    return (
        <Fragment>
            <MetaData title={'All coupons'} />
            <div className="row">
                <div style={list} className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className={`${list.display === 'block' ? "col-12 col-md-10" : "col-12 col-md-12"}`}>
                    <Fragment>
                        <div className='my-4 headcat'></div>
                        <button className="mt-3 proda menuorder" onClick={hide}><i className="fa fa-bars" aria-hidden="true"></i></button>
                        <h1 style={{ display: 'inline' }} className="mt-5 ml-2 px-md-2 heading" >All Promo Code</h1>
                        <h5 style={{ display: 'inline' }} className="marginleft mt-5 ml-2  mr-1 px-md-2"> <CSVLink className='menuorder' data={csvData}
                            filename={"coupons.csv"} target="_blank" >Download</CSVLink></h5>
                        <br />
                        <br />

                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setcoupons}
                                className="px-3"
                                bordered
                                striped
                                hover scrollX
                            />
                        )}

                    </Fragment>
                </div>
                {dialog.isLoading && (
                    <Dialog
                        //Update
                        nameProduct={dialog.nameProduct}
                        onDialog={areUSureDelete}
                        message={dialog.message}
                        id={dialog.id}
                    />
                )}

                {dialogEmail.isLoading && (
                    <DialogSendCoupon
                        message={dialogEmail.message}
                        onDialogSendCoupon={areUSureDelete1}
                        id={dialogEmail.id}
                    />
                )}
            </div>
            <ToastContainer />
        </Fragment>
    )
}

export default CouponAll
