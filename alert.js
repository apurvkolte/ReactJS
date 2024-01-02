window.alert("created successfully");




//https://www.npmjs.com/package/react-alert
import { useAlert } from "react-alert";
import AlertTemplate from 'react-alert-template-basic'
const options = {
    timeout: 5000,
    position: positions.BOTTOM_CENTER,
    transition: transitions.SCALE
}
const alert = useAlert();
alert.success("Coupon created successfully");
alert.error(error);
<AlertProvider template={AlertTemplate}{...options} >
    <HashRouter>
        <App />
    </HashRouter>
</AlertProvider>







import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
<ToastContainer />
toast.error(error);
dispatch({ type: CREATE_COUPON_RESET });







import Swal from 'sweetalert2';
//or
// import Swal from 'sweetalert2/dist/sweetalert2.js'
// import 'sweetalert2/src/sweetalert2.scss'
https://sweetalert2.github.io/
Swal.fire('Awesome!', "You're successfully registered!", 'success').then(
    (result) => {
        if (result.isConfirmed || result.isDismissed) {
            props.resetUser();
            props.history.push('/');
        }
    }
);

Swal.fire({
    title: "Good job!",
    text: "You clicked the button!",
    icon: "success"
});

Swal.fire("SweetAlert2 is working!");

//https://codepen.io/pen
// https://codepen.io/pen
Swal.fire({
    title: "The Internet?",
    text: "That thing is still around?",
    icon: "question"
    // text: "Something went wrong!",
    // footer: '<a href="#">Why do I have this issue?</a>'
});

Swal.fire({
    imageUrl: "https://placeholder.pics/svg/300x1500",
    imageHeight: 1500,
    imageAlt: "A tall image"
});

Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: error.response.data
});


//ok
Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Your work has been saved",
    showConfirmButton: false,
    timer: 1500
});

//option buttton
Swal.fire({
    title: "Do you want to save the changes?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Save",
    denyButtonText: `Don't save`
}).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
        Swal.fire("Saved!", "", "success");
    } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
    }
});

//error
Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Something went wrong!",
    footer: '<a href="#">Why do I have this issue?</a>'
});


Swal.fire({
    title: "<strong>HTML <u>example</u></strong>",
    icon: "info",
    html: `
      You can use <b>bold text</b>,
      <a href="#">links</a>,
      and other HTML tags
    `,
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: `
      <i class="fa fa-thumbs-up"></i> Great!
    `,
    confirmButtonAriaLabel: "Thumbs up, great!",
    cancelButtonText: `
      <i class="fa fa-thumbs-down"></i>
    `,
    cancelButtonAriaLabel: "Thumbs down"
});



let timerInterval;
Swal.fire({
    title: "Auto close alert!",
    html: "I will close in <b></b> milliseconds.",
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
            timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
    },
    willClose: () => {
        clearInterval(timerInterval);
    }
}).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
    }
});



Swal.fire({
    title: "Custom animation with Animate.css",
    showClass: {
        popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
      `
    },
    hideClass: {
        popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
      `
    }
});




Swal.fire({
    title: "Custom width, padding, color, background.",
    width: 600,
    padding: "3em",
    color: "#716add",
    background: "#fff url(/images/trees.png)",
    backdrop: `
      rgba(0,0,123,0.4)
      url("/images/nyan-cat.gif")
      left top
      no-repeat
    `
});




Swal.fire({
    title: "Sweet!",
    text: "Modal with a custom image.",
    imageUrl: "https://unsplash.it/400/200",
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: "Custom image"
});



const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
});
swalWithBootstrapButtons.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true
}).then((result) => {
    if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
        });
    } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
    ) {
        swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            icon: "error"
        });
    }
});



Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
}).then((result) => {
    if (result.isConfirmed) {
        Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
        });
    }
});







//diaglog
import Dialog from "../Dialog";

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

const deleteOrderHandler = (id, name) => {
    handleDialog("Are you sure you want to delete order?", true, name, id);
}

const areUSureDelete = (choose) => {
    if (choose) {
        dispatch(deleteOrder(dialog.id))
        handleDialog("", false);
    } else {
        handleDialog("", false);
    }
}

return (
    {
        dialog.isLoading && (
            <Dialog
                //Update
                nameProduct={dialog.nameProduct}
                onDialog={areUSureDelete}
                message={dialog.message}
                id={dialog.id}
            />
        )
    }
)




//Dilog.js
function Dialog({ message, onDialog, nameProduct, id }) {
    return (
        <div
            style={{
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                backgroundColor: "rgba(0,0,0,0.5)"
            }}
            onClick={() => onDialog(false)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px"
                }}
            >
                <h3 stlye={{ color: "#111", fontSize: "16px" }}>{message}</h3>
                <h1 style={{ color: "#4c5e71", fontSize: "24px" }}>{nameProduct}</h1>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                        onClick={() => onDialog(message, true, nameProduct, id)}
                        style={{
                            background: "red",
                            color: "white",
                            padding: "10px",
                            marginRight: "4px",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => onDialog(false)}
                        style={{
                            background: "green",
                            color: "white",
                            padding: "10px",
                            marginLeft: "4px",
                            border: "none",
                            cursor: "pointer",
                            outline: "1px dotted"
                        }}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}
export default Dialog;
