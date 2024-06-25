import SectionsHead from '../common/SectionsHead';
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { newEnquiry, clearErrors } from "../../redux/actions/userActions";
import { getContact } from "../../redux/actions/userActions";
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Parser from 'html-react-parser';

const index = () => {
  const { register, handleSubmit, formState: { errors }, reset, trigger, } = useForm();
  const dispatch = useDispatch();
  const { contact } = useSelector(state => state.contact);

  const contactUs = Parser(`${contact?.contact}`);
  const [name, setName] = useState();
  const [mobile, setMobile] = useState();
  const [email, setEmail] = useState();
  const { success, error } = useSelector(state => state.enquiry);
  const [message, setMessage] = useState();
  const [user_id, setUser_id] = useState(0);


  useEffect(() => {
    dispatch(getContact());

    if (success) {
      toast.success("Request has been send successfully");
      dispatch(clearErrors());
    }

    if (error) {
      toast.error(error);
    }

  }, [dispatch, success, error])


  function restefiled() {
    setName("")
    setMobile()
    setEmail("")
    setMessage("")
  }

  function submit(data, e) {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", name);
    formData.set("mobile", mobile);
    formData.set("email", email);
    formData.set("message", message);
    formData.set("user_id", user_id);

    var object = {};
    formData.forEach((value, key) => object[key] = value);
    var json = object

    dispatch(newEnquiry(json));
    reset();
    restefiled();
  }


  return (
    <>
      <div className='bg-page1'>
        <section className="about terms">
          <SectionsHead heading="Contact Us" /><br />

          <div className='container'>
            {contactUs}
            <hr />

            <div className=" footer_contact_widget">
              <p>For any inquiries or assistance, please fill out the form below:</p>
              <center> <h3>Enquiry Form</h3></center>

              <div className="entries en-from border p-1" >
                <div className="blog-comments" data-aos="fade-up">
                  <div className="reply-form" style={{ padding: "10px" }}>
                    <form name="myform11" onSubmit={handleSubmit(submit)}>
                      <div className="row enquiryForm mb-2">
                        <div className="col-md-5 form-group">
                          <input name="Name" type="text" className="form-control footer-form-height in-from" value={name}
                            onChange={(e) => setName(e.target.value)} id="Name" placeholder="Name:" />
                        </div>
                        <div className="col-md-7 form-group">
                          <input type="tel" name="Mobile" inputmode="numeric" id="Mobile"
                            className={`form-control footer-form-height ${errors.mobile && "invalid"}`}
                            {...register("mobile", {
                              pattern: {
                                value: /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[789]\d{9}$/g,
                                message: "Invalid Mobile Number",
                              },
                              maxLength: {
                                value: 15,
                                message: "Invalid Mobile Number",
                              }
                            })}
                            onKeyUp={() => {
                              trigger("mobile");
                            }}
                            required
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="Mobile:" />
                        </div>
                        {errors.mobile && (
                          <small className="text-danger">{errors.mobile.message}</small>
                        )}
                      </div>
                      <div className="row enquiryForm  mb-2">
                        <div className="col form-group">
                          <input type="email" name="Email"
                            id="Email"
                            className={`form-control footer-form-height ${errors.email_field && "invalid"}`}
                            {...register("email", {
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid Email ID",
                              }
                            })}
                            onKeyUp={() => {
                              trigger("email");
                            }}
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email:" />
                        </div>
                        {errors.email && (
                          <small className="text-danger">{errors.email.message}</small>
                        )}
                      </div>

                      <div className="row enquiryForm  mb-2">
                        <div className="col form-group" >
                          <textarea name="Address" id="Address" rows={3}
                            className={`form-control ${errors.message && "invalid"}`}
                            {...register("message", {
                              minLength: {
                                value: 10,
                                message: "Length of message should be more characters",
                              },
                              maxLength: {
                                value: 500,
                                message: "Maximum Allowed Length Should Be 500 ",
                              }
                            })}
                            onKeyUp={() => {
                              trigger("message");
                            }}
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Message : "></textarea>
                        </div>
                        {errors.message && (
                          <small className="text-danger">{errors.message.message}</small>
                        )}
                      </div>
                      <div className="row  mb-2">
                        <div className="col-md-4 ">
                          <button type="submit" className="btn btn-primary in-from" >Submit</button>
                        </div>
                        <div className="col-md-4">
                          <button type="reset" onClick={restefiled} className="btn btn-primary in-from" >Reset&nbsp;</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </section >
      </div>

    </>
  );
};

export default index;
