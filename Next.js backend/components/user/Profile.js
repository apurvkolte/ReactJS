import React, { Fragment, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from "next-auth/react";
import { useSelector } from 'react-redux'
import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
import { useDispatch } from 'react-redux';
import { loadUser } from '../../redux/actions/userActions';

const Profile = (MyProfile) => {
    // const { data: session } = useSession();
    const dispatch = useDispatch()
    // console.log("getSession", session);
    const { user, loading } = useSelector(state => state.auth)
    useEffect(() => {
        dispatch(loadUser());
    }, [])
    // console.log("window.location.href", window.location.href);
    MyProfile = window.location.href;

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Your Profile'} />
                    <h2 className="mt-5 ml-121">My Profile</h2>

                    <div className="row justify-content-around mt-5 ml-1 mr-1 user-info">
                        <div className="col-12 col-md-3 ml-50">
                            <figure className='avatar avatar-profile'>
                                <img className="rounded-circle img-fluid" src={user && user?.imageName ? `/uploads/${user?.imageName}` : '/images/default_avatar.jpg'} alt={user?.name} />
                            </figure>
                        </div>

                        <div className="col-12 col-md-5 ml-50">
                            <h4>Full Name</h4>
                            <p>{user?.name}</p>

                            <h4>Email Address</h4>
                            <p>{user?.email}</p>

                            <h4>Joined on</h4>
                            <p>{user?.date && new Date(user.date).toLocaleDateString('en-IN')}</p>

                            <h4>Mobile Number</h4>
                            <p>{user?.mobile}</p>

                            <br />
                            <br />
                        </div>
                        <div className='col-12 col-md-3'>
                            <ul className="profile-links">
                                <li>
                                    <Link href="/update-profile" passHref>
                                        <a className="btn btn-block my-1" style={{ width: '75%' }} id="edit_profile">
                                            Edit Profile
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/my-address" passHref>
                                        <a className="btn btn-block my-1" style={{ width: '75%' }} id="edit_profile">
                                            Manage Addresses
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/update-password" passHref>
                                        <a className="btn btn-block my-1" style={{ width: '75%' }} id="edit_profile">
                                            Change Password
                                        </a>
                                    </Link>
                                </li>
                                {user?.role !== 'admin' && (
                                    <li>
                                        <Link href="/orders/me" passHref>
                                            <a className="btn btn-block my-1" style={{ width: '75%' }} id="edit_profile">
                                                My Orders
                                            </a>
                                        </Link>
                                    </li>
                                )}
                                <style jsx>{`
        .profile-links {
          list-style: none;
          padding: 0;
        }

        .profile-links li {
          margin-bottom: 1rem;
        }

        .btn {
          display: inline-block;
          width: 100%;
          text-align: center;
        }

        #edit_profile {
          /* Add any specific styling for this ID */
        }
      `}</style>
                            </ul>

                        </div>
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                </Fragment>
            )}
        </Fragment>
    )
}

export default Profile
