import React, { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import MetaData from '../layout/MetaData';
const Sidebar = dynamic(() => import('./Sidebar'));
const MemoizedSidebar = React.memo(Sidebar);;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { getContact, updateContactUs } from "../../redux/actions/userActions";
import { UPDATE_CONTACTUS_RESET } from "../../redux/constants/userConstants";
import { TinyMceEditor, content as editorContent } from './TinyMceEditor';

const AboutUs = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { contact } = useSelector(state => state.contact);
    const { success, error } = useSelector(state => state.updateContact);

    useEffect(() => {
        dispatch(getContact());

        if (success) {
            router.push("/admin/contact");
            toast.success("Contact Us Page Is Updated");
            dispatch({ type: UPDATE_CONTACTUS_RESET });
        }

        if (error) {
            toast.error(error);
        }
    }, [dispatch, success, error]);

    const sidebar = useMemo(() => <MemoizedSidebar />, []);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const toggleSidebar = useCallback(() => setIsSidebarVisible(prev => !prev), []);

    const submitHandler = useCallback(() => {
        const formData = new FormData();
        formData.set("content", editorContent);
        const json = Object.fromEntries(formData);
        dispatch(updateContactUs(json));
        console.log("content", editorContent);
    }, [dispatch]);

    return (
        <Fragment>
            <MetaData title='Contact Us' />
            <div className="row">
                <div className={`col-12 col-md-${isSidebarVisible ? 2 : 0}`}>
                    {isSidebarVisible && sidebar}
                </div>

                <div className={`col-12 col-md-${isSidebarVisible ? 10 : 12}`}>
                    <Fragment>
                        <div className='wrapper1 my-4 shadow-lg'>
                            <button className="proda menuorder" onClick={toggleSidebar}><i className="fa fa-bars" aria-hidden="true"></i></button>
                            <h1 style={{ display: 'inline' }} className="ml-2 px-md-2 heading" >Contact Us</h1><br /><br />
                            <TinyMceEditor aboutUs={contact?.contact} />
                            <br />
                            <center>
                                <button onClick={submitHandler} type='button' className='btn btn-primary btn-lg btn-block d-flex justify-content-end'>
                                    Add
                                </button>
                            </center>
                        </div>
                    </Fragment>
                </div>
            </div>
            <ToastContainer />
        </Fragment>
    );
}

export default AboutUs;
