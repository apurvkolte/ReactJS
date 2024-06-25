import React, { Fragment } from "react";
import Link from 'next/link'
import { EmailIcon } from "react-share";

const footerMenu = () => {

  return (
    <Fragment>
      <footer className="py-1 bg-footerMenu ">
        <p></p>
        <div className="row">
          <div className="col-md-4">
            <span className="mt-1">
              <div >
                <h6 className="ml-5 text-uppercase text-light">Home</h6>
                <ul className="list-unstyled list-group">
                  <li className="ml-5 text-uppercase inline-block"><Link href={{ pathname: "/products/cutter" }} className="fz">Annular Cutter</Link></li>
                  <li className="ml-5 text-uppercase inline-block"><Link href={{ pathname: "/products/hand" }} className="fz">Hand Tools</Link></li>
                  <li className="ml-5 text-uppercase inline-block"><Link href={{ pathname: "/products/power" }} className="fz">Power Tools</Link></li>
                  <li className="ml-5 text-uppercase inline-block"><Link href={{ pathname: "/products/accessories" }} className="fz">Accessories</Link></li>
                  <li className="ml-5 text-uppercase inline-block"><Link href={{ pathname: "/products/drill" }} className="fz">Drill and Taps</Link></li>
                </ul>
              </div>
              <br />
            </span>
          </div>
          <div className="col-md-4">
            <span className="mt-1">
              <div >
                <h6 className="ml-5 text-uppercase text-light"> Terms of service</h6>
                <ul className="list-unstyled list-group ">
                  <li className="ml-5 text-uppercase inline-block"><Link href="/term_of_use" className="fz">TERMS OF USE</Link></li>
                  <li className="ml-5 text-uppercase inline-block"><Link href="/return_policy" className="fz"> Return Policy</Link></li>
                  <li className="ml-5 text-uppercase inline-block"><Link href="/copyright" className="fz"> copyright</Link></li>
                  <li className="ml-5 text-uppercase inline-block"><Link href="/privacy" className="fz"> PRIVACY POLICY</Link></li>
                </ul>
              </div>
            </span>
            <br />
          </div>

          <div className="col-md-4">
            <span className="mt-1">
              <div >
                <h6 className="ml-5 text-uppercase text-light">Contact US</h6>
                <ul className="list-unstyled list-group">
                  <li className="ml-5 inline-block"><a href="mailto:sales@SGSRO .co.in" className="fz"><EmailIcon size={20} round /> sales@SGSRO .co.in</a></li>
                  <li className="ml-5 text-uppercase inline-block"><a href="https://api.whatsapp.com/send?phone=919970399958&lang=en&text=Hii...! Welcome to SGSRO ." className="fz"><img src="/images/whatsapp.png" alt="whatsapp" width="15" height="15" /> +91 9970399958</a></li>
                  <li className="ml-5 text-uppercase inline-block"><Link href="/enquiry" className="fz">  <i className="fa fa-shopping-bag text-warning"></i> Bulk Order</Link></li>
                </ul>
              </div>
            </span>
            <br />
          </div>
        </div>

        <p></p>
      </footer >
    </Fragment >
  );
};

export default footerMenu;
