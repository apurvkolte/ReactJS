import Link from "next/link";
import Form from "./Form";


const ErrorPageContent = () => {
  return (
    <div className="error_page footer_apps_widget">

      <img
        className="img-fluid img-thumb"
        src="/images/error.png"
        alt="error.png"

      /><br />

      <div className="erro_code bg-page1 about terms">
        <h1>Ohh! Page Not Found</h1>
      </div>
      <p className="bg-page1 about terms">We can’t seem to find the page you’re looking for</p>

      {/* <Form /> */}
      {/* End form */}

      <Link href="/">
        <span className="btn btn_error btn-thm">Back To Home</span>
      </Link>
    </div>
  );
};

export default ErrorPageContent;
