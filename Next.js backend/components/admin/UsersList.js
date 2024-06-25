import React, { Fragment, useEffect, useState, useMemo, useCallback } from 'react';
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import { MDBDataTable } from 'mdbreact';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
const Sidebar = dynamic(() => import('./Sidebar'));
const MemoizedSidebar = React.memo(Sidebar);;
import Dialog from "../Dialog";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { allUsers, deleteUser, clearErrors } from '../../redux/actions/userActions';
import { DELETE_USER_RESET } from '../../redux/constants/userConstants';
import { CSVLink } from 'react-csv';
import { Buffer } from 'buffer';

const UsersList = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const { loading, error, users } = useSelector(state => state.allUsers);
    const { isDeleted } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(allUsers());

        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            toast.success('User deleted successfully');
            router.replace('/admin/users');
            dispatch({ type: DELETE_USER_RESET });
        }
    }, [dispatch, error, isDeleted, router]);

    const sidebar = useMemo(() => <MemoizedSidebar />, []);

    const [dialog, setDialog] = useState({
        message: "",
        isLoading: false,
        nameProduct: "",
        id: null
    });

    const handleDialog = useCallback((message, isLoading, nameProduct = "", id = null) => {
        setDialog({ message, isLoading, nameProduct, id });
    }, []);

    const deleteUserHandler = useCallback((id, name) => {
        handleDialog("Are you sure you want to delete user?", true, name, id);
    }, [handleDialog]);

    const areUSureDelete = useCallback((choose) => {
        if (choose && dialog.id) {
            dispatch(deleteUser(dialog.id));
        }
        handleDialog("", false);
    }, [dialog.id, dispatch, handleDialog]);

    const csvData = useMemo(() => users ? JSON.parse(JSON.stringify(users)) : [], [users]);

    const [list, setList] = useState({ display: "block" });

    const hide = useCallback(() => {
        setList(prevList => ({ display: prevList.display === "block" ? "none" : "block" }));
    }, []);

    const setUsers = useMemo(() => {
        const data = {
            columns: [
                { label: 'User ID', field: 'id', sort: 'asc', width: 220 },
                { label: 'Name', field: 'name', sort: 'asc', width: 220 },
                { label: 'Email', field: 'email', sort: 'asc', width: 220 },
                { label: 'Role', field: 'role', sort: 'asc', width: 220 },
                { label: 'Actions', field: 'actions', width: 220 },
            ],
            rows: []
        };

        if (users) {
            users.forEach(user => {
                const EID = Buffer.from(`${user.id}`, 'binary').toString('base64');
                data.rows.push({
                    id: EID,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    actions: (
                        <Fragment>
                            <button onClick={() => router.push(`/admin/users/${EID}`)} className="btn btn-primary py-1 px-2">
                                <i className="fa fa-pencil"></i>
                            </button>
                            <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteUserHandler(EID, user.name)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </Fragment>
                    )
                });
            });
        }

        return data;
    }, [users, router, deleteUserHandler]);

    return (
        <Fragment>
            <MetaData title={'All Users'} />
            <div className="row">
                <div style={list} className="col-12 col-md-2">
                    {sidebar}
                </div>
                <div className={`${list.display === 'block' ? "col-12 col-md-10" : "col-12 col-md-12"}`}>
                    <Fragment>
                        <div className='my-4'></div>
                        <button className="mt-3 proda menuorder" onClick={hide}>
                            <i className="fa fa-bars" aria-hidden="true"></i>
                        </button>
                        <h1 style={{ display: 'inline' }} className="mt-5 ml-2 px-md-2 heading">All Users</h1>
                        <h5 style={{ display: 'inline' }} className="marginleft mr-2 mt-5 px-md-2">
                            <CSVLink className='menuorder' data={csvData} filename={"users.csv"} target="_blank">Download</CSVLink>
                        </h5>
                        <br />
                        <br />
                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setUsers}
                                className="px-3"
                                bordered
                                striped
                                hover
                                scrollX
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

export default UsersList;
