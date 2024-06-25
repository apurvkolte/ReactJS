import React, { Fragment, useEffect, useState, useMemo } from 'react';
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import { MDBDataTable } from 'mdbreact';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
const Sidebar = dynamic(() => import('./Sidebar'));
const MemoizedSidebar = React.memo(Sidebar);;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { getEnquiry, deleteEnquiry, clearErrors } from '../../redux/actions/userActions';
import { DELETE_INQUIRY_RESET } from '../../redux/constants/userConstants';
import Dialog from '../Dialog';
import { CSVLink } from 'react-csv';

const ProductEnquiry = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const { loading, error, productEnquiry } = useSelector(state => state.productEnquiry);
    const { isDeleted } = useSelector(state => state.enquiry);

    useEffect(() => {
        dispatch(getEnquiry());
        if (error) {
            toast.error(error);
            dispatch(clearErrors())
        }

        if (isDeleted) {
            toast.success("Enquiry has been deleted ");
            router.push('/admin/enquiry');
            dispatch({ type: DELETE_INQUIRY_RESET })
        }

    }, [dispatch, router, error, isDeleted]);

    const [dialog, setDialog] = useState({
        message: "",
        isLoading: false,
        nameProduct: ""
    });

    const handleDialog = (message, isLoading, nameProduct, id) => {
        setDialog({
            message,
            isLoading,
            nameProduct,
            id
        });
    };

    const sidebar = useMemo(() => <MemoizedSidebar />, []);
    const csvData = useMemo(() => JSON.parse(JSON.stringify(productEnquiry || [])), [productEnquiry]);

    const setEnquiry = useMemo(() => {
        const data = {
            columns: [
                { label: 'Date', field: 'date', sort: 'asc', maxWidth: 400, minWidth: 140, width: 140 },
                { label: 'Name', field: 'name', sort: 'asc', maxWidth: 400, minWidth: 140, width: 200 },
                { label: 'Phone', field: 'mobile', sort: 'asc', maxWidth: 400, minWidth: 140, width: 140 },
                { label: 'Product Name', field: 'pname', sort: 'asc', maxWidth: 400, minWidth: 140, width: 200 },
                { label: 'Qty', field: 'qty', sort: 'asc', maxWidth: 400, minWidth: 140, width: 100 },
                { label: 'Message', field: 'messages', sort: 'asc', maxWidth: 400, minWidth: 140, width: 200 },
                { label: 'Email', field: 'email', sort: 'asc', maxWidth: 400, minWidth: 140, width: 250 },
                { label: 'User Name', field: 'uname', sort: 'asc', maxWidth: 400, minWidth: 140, width: 100 },
                { label: 'User Id', field: 'uid', sort: 'asc', maxWidth: 400, minWidth: 140, width: 100 },
                { label: 'Actions', field: 'actions', maxWidth: 400, minWidth: 140, width: 100 },
            ],
            rows: []
        };

        productEnquiry && productEnquiry.forEach(inq => {
            const EID = Buffer.from(`${inq.id}`, 'binary').toString('base64');
            data.rows.push({
                date: new Date(inq.created_at).toLocaleDateString('en-IN'),
                name: inq.name,
                email: inq.email,
                mobile: inq.mobile,
                pname: <a className="proda" href={`/product-details/${EID}`} target="_blank">{inq.productName}</a>,
                qty: inq.quantity,
                messages: inq.message,
                actions: (
                    <Fragment>
                        <button className="btn btn-danger bg-danger py-1 px-2 ml-2" onClick={() => deleteInquiryHandler(inq.id, inq.name)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </Fragment>
                ),
                uname: <a className="proda" href={`/admin/users`} target="_blank">{inq.user_name}</a>,
                uid: <a className="proda" href={`/admin/users`} target="_blank">{Buffer.from(`${inq.user_id}`, 'binary').toString('base64')}</a>,
            });
        });

        return data;
    }, [productEnquiry, deleteInquiryHandler]);

    const deleteInquiryHandler = (id, name) => {
        handleDialog("Are you sure you want to delete enquiry?", true, name, id);
    };

    const areUSureDelete = (choose) => {
        if (choose) {
            dispatch(deleteEnquiry(dialog.id))
            handleDialog("", false);
        } else {
            handleDialog("", false);
        }
    };

    const [list, setList] = useState({ display: "block" });
    const hide = () => {
        setList(prevState => ({ display: prevState.display === "block" ? "none" : "block" }));
    };

    return (
        <Fragment>
            <MetaData title={'All enquiry'} />
            <div className="row">
                <div style={list} className="col-12 col-md-2">
                    {sidebar}
                </div>
                <div className={`${list.display === 'block' ? "col-12 col-md-10" : "col-12 col-md-12"}`}>
                    <Fragment>
                        <div className='my-4'></div>
                        <button className="mt-3 proda menuorder" onClick={hide}><i className="fa fa-bars" aria-hidden="true"></i></button>
                        <h1 style={{ display: 'inline' }} className="mt-5 ml-2 px-md-2" >Product Enquiry</h1>
                        <h5 style={{ display: 'inline' }} className="marginleft mr-2 mt-5 px-md-2"> <CSVLink className='menuorder' data={csvData} filename={"Enquiry.csv"} target="_blank">Download</CSVLink></h5>
                        <br />
                        <br />
                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setEnquiry}
                                className="cust-table px-3"
                                bordered
                                striped
                                hover scrollX
                                exportToCSV
                            />
                        )}
                    </Fragment>
                </div>
                {dialog.isLoading && (
                    <Dialog
                        nameProduct={dialog.nameProduct}
                        onDialog={areUSureDelete}
                        message={dialog.message}
                        id={dialog.id}
                    />
                )}
            </div>
            <ToastContainer />
        </Fragment>
    );
};

export default ProductEnquiry;
