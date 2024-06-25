import React, { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import MetaData from '../layout/MetaData';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAbout, updateAboutUs } from "../../redux/actions/userActions";
import { UPDATE_ABOUTUS_RESET } from "../../redux/constants/userConstants";
import { TinyMceEditor, content as editorContent } from './TinyMceEditor';
const Sidebar = dynamic(() => import('./Sidebar'));
const MemoizedSidebar = React.memo(Sidebar);

const AboutUs = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { about } = useSelector(state => state.about);
    const { success, error } = useSelector(state => state.updateAbout);

    useEffect(() => {
        dispatch(getAbout());

        if (success) {
            toast.success("About Us Page Is Updated");
            dispatch({ type: UPDATE_ABOUTUS_RESET });
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
        dispatch(updateAboutUs(formData));
        console.log("content", editorContent);
    }, [dispatch]);

    return (
        <Fragment>
            <MetaData title='About Us' />
            <div className="row">
                <div className={`col-12 col-md-${isSidebarVisible ? 2 : 0}`}>
                    {isSidebarVisible && sidebar}
                </div>

                <div className={`col-12 col-md-${isSidebarVisible ? 10 : 12}`}>
                    <Fragment>
                        <div className='wrapper1 my-4 shadow-lg'>
                            <button className="proda menuorder" onClick={toggleSidebar}><i className="fa fa-bars" aria-hidden="true"></i></button>
                            <h1 style={{ display: 'inline' }} className="ml-2 px-md-2 heading" >About Us</h1><br /><br />
                            <TinyMceEditor aboutUs={about?.about} />
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
};

export default AboutUs;
