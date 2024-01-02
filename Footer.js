import React, { Fragment } from "react";
import '../../foo.css';
import { Link } from "react-router-dom";
const footer = () => {

  function scrollTop() {
    const body = document.querySelector('#root');

    body.scrollIntoView({
      behavior: 'smooth'
    }, 500)
  }

  return (
    <Fragment>
      <footer>
        <div className="container-fluid">
          <div className="footer-top">
            <div className="row">
              <div className="col-md-6 col-lg-3 about-footer">
                <h2 >
                  <Link href="/"><img src="/images/logo.png" alt="Industry Central Logo" width="100" height="100" /></Link>
                </h2><br /><br />
                <a href="/#/enquiry"><button className="btn bg-danger text-white btn-lg ">Enquiry Now!</button></a>

                <ul class="footer-social">
                  <li><a href="" target="_blank"><i class="fa fa-facebook fa-2x  text-primary display-5"></i></a></li>
                  <li><a href="https://api.whatsapp.com/send?phone=919970399958&lang=en&text=Hii...! Welcome to Industry Central." target="_blank"><i class="fa fa-whatsapp fa-2x  text-success display-5" aria-hidden="true"></i></a></li>
                  <li><a href="" target="_blank"><i class="fa fa-instagram fa-2x  text-danger  display-5"></i></a></li>
                  <li><a href="" target="_blank"><i class="fa fa-linkedin fa-2x  text-primary  display-5"></i></a></li>
                  <li><a href="" target="_blank"><i class="fa fa-xing-square fa-2x  text-white display-5"></i></a></li>
                </ul>
                <hr />
              </div>
              <div className="col-md-6 col-lg-3 page-more-info">
                <div className="footer-title">
                  <h4>Industry Central</h4>
                </div>
                <ul>
                  <li><a href={{ pathname: "/products/cutter" }}>Annular Cutter</a></li>
                  <li><a href={{ pathname: "/products/hand" }}>Hand Tools</a></li>
                  <li><a href={{ pathname: "/products/power" }}>Power Tools</a></li>
                  <li><a href={{ pathname: "/products/accessories" }}>Accessories</a></li>
                  <li><a href={{ pathname: "/products/drill" }}>Drill and Taps</a></li>
                </ul>
              </div>

              <div className="col-md-6 col-lg-3 page-more-info">
                <div className="footer-title">
                  <h4>More Info</h4>
                </div>
                <ul>
                  <li><a href="/#/term_of_use">Terms Of Use</a></li>
                  <li><a href="/#/return_policy"> Return Policy</a></li>
                  <li><a href="/#/copyright"> Copyright</a></li>
                  <li><a href="/#/privacy"> Privacy Policy</a></li>
                </ul>
              </div>
              <div className="col-md-6 col-lg-3 page-more-info about-footer">
                <div className="footer-title">
                  <h4>Contact Us</h4>
                </div>
                <ul>
                  <li><a href="tel:+919970399958">
                    <i className="fa fa-phone fa-flip-horizontal text-primary"></i>+91 9970399958</a></li>
                  <li><a href="mailto:sales@indicent.co.in">
                    <i class="fa fa-envelope" aria-hidden="true"></i>sales@indicent.co.in</a></li>
                  <li>
                    <i className="fa fa-map-marker"></i>
                    Gat No.178, Ganesh Nagar,
                    <br />Talwade, Pune,
                    <br />411062
                  </li>
                </ul>

                {/* <div className="footer-logo">
                  <Link href="/"><img src="/images/logo.png" alt="Industry Central Logo" width="100" height="100" /></Link>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="footer1 bg-footer p-3">
        <span className="text-center ">
          <div className="copyright">
            Copyrights &copy;{new Date().getFullYear()} Industry Central. All Rights Reserved.
            {" "}
            Design & Developed By {" "}
            <a href="https://weblinkservices.net/" target="_blank" rel="noreferrer">
              <img src="/images/wlspl_logo.png" alt="Weblink Services Pvt. Ltd." width="130" style={{ verticalAlign: "middle" }} /></a>
            {" "}

            <button className="scrollTop bg-light" title="Top" onClick={scrollTop} ><i className="fa fa-chevron-up text-danger" aria-hidden="true"></i></button>
          </div>
        </span>
      </div>

    </Fragment>
  );
};

export default footer;
