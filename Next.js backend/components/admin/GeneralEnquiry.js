import React, { Fragment, useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
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
import Dialog from "../Dialog";
import { CSVLink } from 'react-csv';
import { useRouter } from 'next/router';

const GeneralEnquiry = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { loading, error, enquiry } = useSelector(state => state.productEnquiry);
    const { isDeleted } = useSelector(state => state.enquiry);
    const [dialog, setDialog] = useState({ message: "", isLoading: false, nameProduct: "", id: null });

    useEffect(() => {
        dispatch(getEnquiry());
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            toast.success("Enquiry has been deleted");
            router.push('/admin/enquiry');
            dispatch({ type: DELETE_INQUIRY_RESET });
        }
    }, [dispatch, router, error, isDeleted]);

    const sidebar = useMemo(() => <MemoizedSidebar />, []);
    const handleDialog = useCallback((message, isLoading, nameProduct, id) => {
        setDialog({ message, isLoading, nameProduct, id });
    }, []);

    const deleteInquiryHandler = useCallback((id, name) => {
        handleDialog("Are you sure you want to delete enquiry?", true, name, id);
    }, [handleDialog]);

    const areUSureDelete = useCallback((choose) => {
        if (choose) {
            dispatch(deleteEnquiry(dialog.id));
        }
        handleDialog("", false, "", null);
    }, [dispatch, dialog.id, handleDialog]);

    const csvData = useMemo(() => (enquiry ? JSON.parse(JSON.stringify(enquiry)) : []), [enquiry]);

    const setEnquiry = useMemo(() => {
        const data = {
            columns: [
                { label: 'Date', field: 'date', sort: 'asc', maxWidth: 400, minWidth: 140, width: 140 },
                { label: 'Name', field: 'name', sort: 'asc', maxWidth: 400, minWidth: 140, width: 200 },
                { label: 'Phone', field: 'mobile', sort: 'asc', maxWidth: 400, minWidth: 140, width: 140 },
                { label: 'Message', field: 'messages', sort: 'asc', maxWidth: 400, minWidth: 140, width: 200 },
                { label: 'Email', field: 'email', sort: 'asc', maxWidth: 400, minWidth: 140, width: 250 },
                { label: 'Actions', field: 'actions', maxWidth: 400, minWidth: 140, width: 100 },
            ],
            rows: []
        };

        enquiry?.forEach(inq => {
            data.rows.push({
                date: new Date(inq.created_at).toLocaleDateString('en-IN'),
                name: inq.name,
                email: inq.email,
                mobile: inq.mobile,
                messages: inq.message,
                actions: (
                    <Fragment>
                        <button className="btn btn-danger bg-danger py-1 px-2 ml-2" onClick={() => deleteInquiryHandler(inq.id, inq.name)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </Fragment>
                ),
            });
        });

        return data;
    }, [enquiry, deleteInquiryHandler]);

    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const toggleSidebarVisibility = useCallback(() => setIsSidebarVisible(prev => !prev), []);

    return (
        <Fragment>
            <MetaData title='All Enquiry' />
            <div className="row">
                <div className={`col-12 col-md-${isSidebarVisible ? 2 : 0}`}>
                    {isSidebarVisible && sidebar}
                </div>
                <div className={`col-12 col-md-${isSidebarVisible ? 10 : 12}`}>
                    <Fragment>
                        <div className='my-4'></div>
                        <button className="mt-3 proda menuorder" onClick={toggleSidebarVisibility}>
                            <i className="fa fa-bars" aria-hidden="true"></i>
                        </button>
                        <h1 className="mt-5 ml-2 px-md-2" style={{ display: 'inline' }}>General Enquiry</h1>
                        <h5 className="marginleft mr-2 mt-5 px-md-2" style={{ display: 'inline' }}>
                            <CSVLink className='menuorder' data={csvData} filename={"Enquiry.csv"} target="_blank">Download</CSVLink>
                        </h5>
                        <br /><br />
                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setEnquiry}
                                className="cust-table px-3"
                                bordered
                                striped
                                hover
                                scrollX
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

export default GeneralEnquiry;
