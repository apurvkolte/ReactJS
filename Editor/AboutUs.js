import React, { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import MetaData from '../layout/MetaData';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAbout, updateAboutUs } from "../../redux/actions/userActions";
import { UPDATE_ABOUTUS_RESET } from "../../redux/constants/userConstants";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const Sidebar = dynamic(() => import('./Sidebar'));
const MemoizedSidebar = React.memo(Sidebar);

const AboutUs = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { about } = useSelector(state => state.about);
    const { success, error } = useSelector(state => state.updateAbout);
    const sidebar = useMemo(() => <MemoizedSidebar />, []);

    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const toggleSidebar = useCallback(() => setIsSidebarVisible(prev => !prev), []);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

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

    useEffect(() => {
        if (about && about.about) {
            try {
                const decodedJson = JSON.parse(about.about.replace(/\\\"/g, '"'));
                const contentState = convertFromRaw(decodedJson);
                setEditorState(EditorState.createWithContent(contentState));
            } catch (error) {
                console.error("Failed to parse JSON:", error);
            }
        }
    }, [about]);



    const handleEditorChange = useCallback((state) => {
        setEditorState(state);
    }, []);

    const submitHandler = useCallback(() => {
        const rawContentState = convertToRaw(editorState.getCurrentContent());
        const stringifiedContent = JSON.stringify(rawContentState);

        dispatch(updateAboutUs({ content: stringifiedContent }));
    }, [dispatch, editorState]);

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
                            <Editor
                                editorState={editorState}
                                onEditorStateChange={handleEditorChange}
                                wrapperClassName="wrapper-class"
                                editorClassName="editor-class"
                                toolbarClassName="toolbar-class"
                            />
                            <br />
                            <center>
                                <button onClick={submitHandler} type='button' className='btn btn-primary btn-lg btn-block d-flex justify-content-end'>
                                    Save
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
