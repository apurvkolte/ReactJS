import React, { useState, useMemo, Fragment } from 'react';
import Link from 'next/link';
import { footMenu, footSocial } from '../../data/footerData';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

const Footer = () => {
    const { data: session } = useSession();

    // const handleSubmit = useMemo(() => (e) => {
    //     e.preventDefault();
    //     setSubValue('');
    //     toast('Thank you, you are subscribed to receive our daily newsletter');
    // }, []);

    const currYear = new Date().getFullYear();

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Fragment>
            {session?.user.role !== "admin" &&
                <Fragment>
                    <footer id="footer">
                        <div className="container">
                            <div className="wrapper footer_wrapper">
                                <div className="foot_about">
                                    <h2 className="nav_logo1">
                                        <img src="/images/logo.png" alt="SGSRO Logo" loading="lazy" style={{ maxWidth: '100%', height: '100px' }} />
                                    </h2>
                                    {/* <div className="foot_subs">
                                        <p>Subscribe to our Email toasts to receive early discount offers, and new products info.</p>
                                        <form onSubmit={handleSubmit}>
                                            <input
                                                type="email"
                                                className="input_field"
                                                placeholder="Email Address*"
                                                required
                                                value={subValue}
                                                onChange={(e) => setSubValue(e.target.value)}
                                            />
                                            <button type="submit" className="btn">Subscribe</button>
                                        </form>
                                    </div> */}
                                </div>

                                {footMenu.map(({ id, title, menu }) => (
                                    <div className="foot_menu" key={id}>
                                        <h4>{title}</h4>
                                        <ul>
                                            {menu.map(({ id, link, path }) => (
                                                <li key={id}>
                                                    <Link href={`${path}`}>{link}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </footer>
                    <div className="sub_footer">
                        <div className="sub_footer_wrapper">
                            <div className="foot_copyright">
                                Copyrights &copy;{currYear} SGSRO. All Rights Reserved.
                                {" "}
                                Design & Developed By {" "}
                                <a href="https://weblinkservices.net/" target="_blank" rel="noreferrer">
                                    <img src="https://www.weblinkservices.net/assets-web/logo-main.png" alt="Weblink Services Pvt. Ltd." width="130" style={{ verticalAlign: "middle" }} /></a>
                            </div>
                            <div className="foot_social">
                                {footSocial.map(({ id, icon, path, bg }) => (
                                    <Link href={`${path}`} className={`${bg}`} key={id} target='_blank'>{icon}</Link>
                                ))}
                            </div>
                            <button className="scrollTop bg-light" title="Top" onClick={scrollTop} ><i className="fa fa-chevron-up" aria-hidden="true"></i></button>
                        </div>
                    </div>

                </Fragment>
            }
        </Fragment>
    );
};

export default Footer;
