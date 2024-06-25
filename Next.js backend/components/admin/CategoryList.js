import React, { Fragment, useState, useEffect, useMemo } from 'react'
import dynamic from "next/dynamic";
import { MDBDataTable } from 'mdbreact'
import { useRouter } from 'next/router'
import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
const Sidebar = dynamic(() => import('./Sidebar'));
const MemoizedSidebar = React.memo(Sidebar);
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { allCategory, addCategory, updateCategory, deleteCategory, clearErrors } from '../../redux/actions/productActions'
import { DELETE_CATEGORY_RESET, UPDATE_CATEGORY_RESET, CREATE_CATEGORY_RESET } from '../../redux/constants/productConstants'
import Dialog from "../Dialog";
import { CSVLink } from 'react-csv';
import { Buffer } from 'buffer'

const CategoryList = () => {
    const router = useRouter()

    const dispatch = useDispatch();
    const [categoryName, setCategoryName] = useState([]);
    const [categoryID, setCategoryID] = useState(0);
    const [newCategory, setNewCategory] = useState();

    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [file, setFile] = useState();

    const [images1, setImages1] = useState([]);
    const [imagesPreview1, setImagesPreview1] = useState([]);
    const [oldImages1, setOldImages1] = useState([]);
    const [file1, setFile1] = useState();

    const { loading, category } = useSelector(state => state.allCategory);
    const { isDeleted, isUpdated } = useSelector(state => state.category)
    const { success, error } = useSelector(state => state.newCategory)

    useEffect(() => {
        dispatch(allCategory());

        if (error) {
            toast.error(error);
            dispatch(clearErrors())
        }

        if (isDeleted) {
            router.push('/admin/category')
            toast.success('Category deleted successfully');
            dispatch({ type: DELETE_CATEGORY_RESET })
        }
        if (isUpdated) {
            router.push('/admin/category')
            toast.success('Category Updated Successfully');
            dispatch({ type: UPDATE_CATEGORY_RESET })
        }
        if (success) {
            router.push('/admin/category')
            toast.success('Category Added Successfully');
            dispatch({ type: CREATE_CATEGORY_RESET });
            setNewCategory('');
        }
    }, [dispatch, toast, error, isDeleted, success, isUpdated])

    const sidebar = useMemo(() => <MemoizedSidebar />, []);

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

    const deleteCategoryHandler = (id, name) => {
        handleDialog("Are you sure you want to delete category?", true, name, id);
    }

    const areUSureDelete = (choose) => {
        if (choose) {
            dispatch(deleteCategory(dialog.id))
            handleDialog("", false);
        } else {
            handleDialog("", false);
        }
    }

    const csvData = JSON.parse(JSON.stringify(category ? category : []));
    const [list, setList] = useState({ display: "block" });
    const hide = () => {
        if (list.display === "block") {
            setList({ display: "none" })
        } else {
            setList({ display: "block" })
        }
    }

    const categoryHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set("categoryName", categoryName);
        formData.set("categoryId", categoryID);
        formData.set("file", file1);

        for (let i = 0; i < file1.length; i++) {
            formData.append(`file`, file1[i]);
        }


        category && category.forEach((cat) => {
            if (cat.category === categoryName) {
                toast.error("Category is already exist");
            }
        })
        dispatch(updateCategory(categoryID, formData));
        window.location.reload();
    }

    const addCategoryHandller = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set("newCategory", newCategory);
        for (let i = 0; i < file.length; i++) {
            formData.append(`file`, file[i]);
        }
        // var object = {};
        // formData.forEach((value, key) => object[key] = value);
        // var json = object
        dispatch(addCategory(formData));
    }

    const onChange = (event) => {
        const file = event.target.files;
        setFile(file);
        setOldImages("");

        if (event.target.name === "file") {
            if (file.length === 0) {
                toast.error("Please select a product image");
                return false;
            }
            for (let i = 0; i < file.length; i++) {
                if (file[i].type !== "image/png" && file[i].type !== "image/jpg" && file[i].type !== "image/jpeg") {
                    toast.error("File does not support. You must use .png or .jpg ");
                    return false;
                }
                if (file[i].size > 5000000) {
                    toast.error("Please upload a image smaller than 5 MB");
                    return false;
                }
            }
        }

        const files = Array.from(event.target.files);
        setImagesPreview([]);
        setImages([]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((oldArray) => [...oldArray, reader.result]);
                    setImages((oldArray) => [...oldArray, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const onChange1 = (event) => {
        const file = event.target.files;
        setFile1(file);
        setOldImages1("");

        if (event.target.name === "file") {
            if (file.length === 0) {
                toast.error("Please select a product image");
                return false;
            }
            for (let i = 0; i < file.length; i++) {
                if (file[i].type !== "image/png" && file[i].type !== "image/jpg" && file[i].type !== "image/jpeg") {
                    toast.error("File does not support. You must use .png or .jpg ");
                    return false;
                }
                if (file[i].size > 5000000) {
                    toast.error("Please upload a image smaller than 5 MB");
                    return false;
                }
            }
        }

        const files = Array.from(event.target.files);
        setImagesPreview1([]);
        setImages1([]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview1((oldArray) => [...oldArray, reader.result]);
                    setImages1((oldArray) => [...oldArray, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };


    const setcategory = () => {
        const data = {
            columns: [
                {
                    label: 'Sr. NO.',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Image',
                    field: 'image',
                    sort: 'asc'
                },
                {
                    label: 'Category',
                    field: 'name',
                    sort: 'asc'
                },

                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        }

        category && category.forEach(cat => {
            const EID = Buffer.from(cat.id.toString(), 'binary').toString('base64')
            data.rows.push({
                id: cat.id,
                name: cat.category,
                image: <Fragment> <img src={`/uploads/category/${cat.img}`} alt={`${cat.img}`} style={{
                    display: 'inherit',
                    height: '70px',
                    margin: 'auto',
                    padding: '4px',
                    width: '70px',
                    borderRadius: "100px",
                    border: "2px solid rgb(39, 170, 225)"
                }} /> </Fragment>,
                actions: <Fragment>
                    <button
                        type="button"
                        name={cat.category}
                        onFocus={(e) => {
                            setCategoryName(e.target.name);
                            setCategoryID(EID)
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#ratingModal"
                        className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pencil"></i>
                    </button>

                    <div class="modal" id="ratingModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h2 class="modal-title" id="exampleModalLabel">   Update Category</h2>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="name_field">Category Name</label>
                                        <input
                                            type='text'
                                            name="review"
                                            id="review"
                                            className="form-control mt-3"
                                            value={categoryName}
                                            onChange={(e => setCategoryName(e.target.value))}
                                            required
                                        ></input>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="name_field">Category Image</label>
                                        <input
                                            type="file"
                                            name="file"
                                            className="custom-file-input"
                                            placeholder="Category Image"
                                            id="customFile"
                                            onChange={onChange1}
                                            required
                                        />
                                        {imagesPreview1.map((img) => (
                                            <img
                                                src={img}
                                                key={img}
                                                alt="Images Preview"
                                                className="mt-3 mr-2"
                                                width="75"
                                                height="75"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" onClick={categoryHandler} class="btn btn-primary">Update Category</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="modal fade"
                        id="ratingModal"
                        data-bs-target="ratingModal"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="ratingModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title heading" id="ratingModalLabel">
                                    </h5>
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                        data-close
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-danger bg-danger py-1 px-2 ml-2" onClick={() => deleteCategoryHandler(EID, cat.category)} >
                        <i className="fa fa-trash"></i>
                    </button>
                </Fragment>
            })
        })
        return data;
    }

    return (
        <Fragment>
            <MetaData title={'All Category'} />
            <div className="row">
                <div style={list} className="col-12 col-md-2">
                    {sidebar}
                </div>

                <div className={`${list.display === 'block' ? "col-12 col-md-10" : "col-12 col-md-12"}`}>
                    <Fragment>
                        <div className='my-4 headcat'></div>
                        <button className="mt-3 proda menuorder" onClick={hide}><i className="fa fa-bars" aria-hidden="true"></i></button>
                        <h1 style={{ display: 'inline' }} className="mt-5 ml-2 px-md-2 heading" >Categories</h1>
                        <h5 style={{ display: 'inline' }} className="marginleft mr-2 mt-5 px-md-2"> <CSVLink className='menuorder' data={csvData}
                            filename={"category.csv"} target="_blank" >Download</CSVLink></h5>
                        <br />

                        <div className='wrapper1 my-2'>
                            <form className='shadow-lg' onSubmit={addCategoryHandller}>
                                <div className='row'>
                                    <div className='col-md-3 form-group'>
                                        <label>
                                            <h4>Create New Category :</h4>
                                        </label>
                                    </div>
                                    <div className='col-md-4 form-group'>
                                        <input
                                            type="text"
                                            className='form-control'
                                            value={newCategory}
                                            placeholder="Category Name"
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-3 form-group'>
                                        <label>
                                            <h4>Category Image :</h4>
                                        </label>
                                    </div>
                                    <div className='col-md-4 form-group'>
                                        <input
                                            type="file"
                                            name="file"
                                            className="custom-file-input"
                                            placeholder="Category Image"
                                            id="customFile"
                                            onChange={onChange}
                                            required
                                        />
                                        {imagesPreview.map((img) => (
                                            <img
                                                src={img}
                                                key={img}
                                                alt="Images Preview"
                                                className="mt-3 mr-2"
                                                width="75"
                                                height="75"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className='row justify-content-center'>
                                    <div className='col-md-2'>
                                        <input
                                            className='btn btn-primary my-0 text-white w-100'
                                            type="submit"
                                            value="Create"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>


                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setcategory()}
                                className="px-3"
                                bordered
                                striped
                                hover
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
            </div>
            <ToastContainer />
        </Fragment>
    )
}

export default CategoryList
