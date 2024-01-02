
const router = useRouter();
const { data: session } = useSession();
const { register, handleSubmit, formState: { errors }, reset, trigger, } = useForm();
const dispatch = useDispatch();
const [name, setName] = useState();
const [mobile, setMobile] = useState();
const [email, setEmail] = useState();
const { success, error } = useSelector(state => state.enquiry);
const [message, setMessage] = useState();
const [user_id, setUser_id] = useState(0);

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





// <div className="col-sm-6 col-md-6 col-lg-3 col-xl-3 footer_contact_widget">
//     <h4>Enquiry Form</h4>
//     <div className="entries en-from border border-dark p-1">
//         <div className="blog-comments" data-aos="fade-up">
//             <div className="reply-form">
//                 <form name="myform11" onSubmit={handleSubmit(submit)} >
//                     <div className="row enquiryForm mb-2">
//                         <div className="col-md-5 form-group">
//                             <input name="Name" type="text" className="form-control footer-form-height in-from" value={name}
//                                 onChange={(e) => setName(e.target.value)} id="Name" placeholder="Name:" />
//                         </div>
//                         <div className="col-md-7 form-group">
//                             <input type="number" name="Mobile"
//                                 id="Mobile"
//                                 className={`form-control footer-form-height ${errors.mobile && "invalid"}`}
//                                 {...register("mobile", {
//                                     pattern: {
//                                         value: /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[789]\d{9}$/g,
//                                         message: "Invalid Mobile Number",
//                                     },
//                                     maxLength: {
//                                         value: 15,
//                                         message: "Invalid Mobile Number",
//                                     }
//                                 })}
//                                 onKeyUp={() => {
//                                     trigger("mobile");
//                                 }}
//                                 required
//                                 value={mobile}
//                                 onChange={(e) => setMobile(e.target.value)}
//                                 placeholder="Mobile:" />
//                         </div>
//                         {errors.mobile && (
//                             <small className="text-danger">{errors.mobile.message}</small>
//                         )}
//                     </div>
//                     <div className="row enquiryForm  mb-2">
//                         <div className="col form-group">
//                             <input type="email" name="Email"
//                                 id="Email"
//                                 className={`form-control footer-form-height ${errors.email_field && "invalid"}`}
//                                 {...register("email", {
//                                     pattern: {
//                                         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                                         message: "Invalid Email ID",
//                                     }
//                                 })}
//                                 onKeyUp={() => {
//                                     trigger("email");
//                                 }}
//                                 value={email}
//                                 required
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 placeholder="Email:" />
//                         </div>
//                         {errors.email && (
//                             <small className="text-danger">{errors.email.message}</small>
//                         )}
//                     </div>

//                     <div className="row enquiryForm  mb-2">
//                         <div className="col form-group" >
//                             <textarea name="Address" id="Address" rows={3}
//                                 className={`form-control ${errors.message && "invalid"}`}
//                                 {...register("message", {
//                                     minLength: {
//                                         value: 10,
//                                         message: "Minimum Length Should Be Not Match",
//                                     },
//                                     maxLength: {
//                                         value: 500,
//                                         message: "Maximum Allowed Length Should Be 500 ",
//                                     }
//                                 })}
//                                 onKeyUp={() => {
//                                     trigger("message");
//                                 }}
//                                 required
//                                 value={message}
//                                 onChange={(e) => setMessage(e.target.value)}
//                                 placeholder="Message : "></textarea>
//                         </div>
//                         {errors.message && (
//                             <small className="text-danger">{errors.message.message}</small>
//                         )}
//                     </div>
//                     <div className="row  mb-2">
//                         <div className="col-md-4 ">
//                             <button type="submit" className="btn btn-primary in-from" >Submit</button>
//                         </div>
//                         <div className="col-md-4">
//                             <button type="reset" onClick={restefiled} className="btn btn-primary in-from" >Reset&nbsp;</button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     </div>
// </div>

























// <div className="col-lg-4 col-md-6 footer-newsletter entries">
//                 <h4>ENQUIRY FORM</h4>
//                 <div className="entries en-from">
//                                     <div className="blog-comments" data-aos="fade-up">
//                                         <div className="reply-form">
//                                             <form name="myform11" onsubmit="validateCaptcha()" >
//                                             <div className="row enquiryForm">
//                                                     <div className="col-md-5 form-group">
//                                                         <input name="Name" type="text" className="form-control in-from" id="Name" placeholder="Name:" />
//                                                     </div>
//                                                     <div className="col-md-7 form-group">
//                                                         <input type="number" name="Mobile" id="Mobile" className="form-control in-from" placeholder="Phone:" />
//                                                     </div>
//                                                     </div>
//                                                     <div className="row enquiryForm">
//                                                     <div className="col form-group">
//                                                     <input type="email" name="Email" id="Email" className="form-control in-from" placeholder="Email:" />
//                                                     </div>
//                                                     </div>
                                                    
//                                                     <div className="row enquiryForm">
//                                                     <div className="col form-group" >
//                                                         <textarea name="Address" id="Address" className="form-control" placeholder="Message : "></textarea>
//                                                     </div>
//                                                     </div>
//                                                 <div className="row ">
//                                                     <div className="col-md-4 ">
//                                                     <button type="submit" className="btn btn-danger in-from" >Submit</button>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <button type="reset" className="btn btn-danger in-from" >Reset&nbsp;</button>
//                                                     </div>
//                                                 </div>
//                                             </form>
//                                         </div>
//                                     </div>
//                                 </div>
//               </div>