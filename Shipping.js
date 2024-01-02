import React, { Fragment, useState, useEffect } from "react";
import { countries } from "countries-list";
import { Link, useNavigate } from 'react-router-dom'
import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import { useAlert } from "react-alert";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../../actions/cartActions";
import { allAddress, indianState } from '../../actions/userActions'
import { capitalCase } from "capital-case";
var pincodeDirectory = require('india-pincode-lookup');

const Shipping = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const countriesList = Object.values(countries);
  // US:{name: united state, city: malkapur}

  const { shippingInfo } = useSelector((state) => state.cart);
  const { address } = useSelector(state => state.allAddress);
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(shippingInfo.name);
  const [mobile, setMobile] = useState(shippingInfo.mobile);
  const [flat, setFlat] = useState(shippingInfo.flat);
  const [area, setArea] = useState(shippingInfo.area);
  const [landmark, setLandmark] = useState(shippingInfo.landmark);
  const [city, setCity] = useState(shippingInfo.city);
  const [state, setState] = useState(shippingInfo.state);
  const [country, setCountry] = useState(shippingInfo.country);
  const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
  const [selectAddress, setSelectAddress] = useState(address);
  const [gstn, setGstn] = useState('');

  const dispatch = useDispatch();
  // console.log("address", selectAddress);
  // console.log("shippingInfo", shippingInfo);
  const myId = user.id
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm();

  useEffect(() => {
    dispatch(allAddress(myId));
    // if (address) {
    //   address.map(add => {
    //     if (add.main === 1) {
    //       setName(add.name)
    //       setMobile(add.mobile)
    //       setFlat(add.flat)
    //       setArea(add.area)
    //       setLandmark(add.landmark)
    //       setCity(add.city)
    //       setState(add.state)
    //       setCountry(add.country)
    //       setPostalCode(add.postalCode)
    //     }

    //     return add;
    //   })
    // }
  }, [dispatch, myId])

  const onChangeAddress = (e) => {
    setSelectAddress(e.target.value)
    const addID = parseInt(e.target.value);

    if (address) {
      address.forEach(add => {
        if (add.id === addID) {
          setName(add.name)
          setFlat(add.flat)
          setMobile(add.mobile)
          setArea(add.area)
          setLandmark(add.landmark)
          setCity(add.city)
          setState(add.state)
          setCountry(add.country)
          setPostalCode(add.postalCode)
        }
      })
    }
  }

  const submitHandler = (data, e) => {
    e.preventDefault();
    const pincodeDir = pincodeDirectory.lookup(postalCode);
    if (pincodeDir.length === 0) {
      alert.error('Your Entered Postal Code Is Not Valid')
    } else {
      dispatch(saveShippingInfo({ name, mobile, flat, area, landmark, city, state, country, postalCode, gstn }));
      reset()
      navigate('/confirm');
    }
  };

  function postalAddress(postalCode) {
    const pincodeDir = pincodeDirectory.lookup(postalCode);
    if (pincodeDir.length) {
      setState(capitalCase(pincodeDir[0].stateName.toLowerCase()))
      setCity((pincodeDir[0].taluk === 'NA' ? "" : pincodeDir[0].taluk + ", Ds: ") + pincodeDir[0].districtName)
      setCountry("India")
    }
  }

  return (
    <div className="container-fluid">
      <Fragment>
        <MetaData title={"Shipping Info"} />

        <CheckoutSteps shipping />

        <div className="row wrapper">
          <div className="col-10 col-lg-5">
            <Link to="/me/update/myaddress" state={{ data: 1 }} className="btn btn-danger  address-btn  mb-4 d-flex justify-content-center py-1 px-2">
              Manage a delivery address
            </Link>
            <form className="shadow-lg" onSubmit={handleSubmit(submitHandler)}>
              <h1 className="mb-4">Shipping Info</h1>

              <div className="form-group">
                <label htmlFor="category_field">Select Address <small>(<Link to="/me/update/myaddress" state={{ data: 1 }}>Click here to add new address</Link>)</small></label>
                <select
                  id="category_field"
                  className="form-control "
                  defaultValue={{ label: "Select Dept", value: 0 }}
                  value={selectAddress}
                  onChange={onChangeAddress}
                >
                  <option value="">Please select a address...</option>
                  {address.map((add) => (
                    <option key={add.id} value={add.id}>
                      {add && `${add.flat ? add.flat + ',' : ""} ${add.area ? add.area + ',' : ""} ${add.landmark ? add.landmark + ',' : ""}
                            ${add.city ? add.city + ',' : ""} ${add.state ? add.state + ',' : ""} ${add.country ? add.country + ',' : ""} ${add.postalCode ? add.postalCode + '.' : ""} `
                      }
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="name_field">Full Name</label>
                <input
                  type="text"
                  id="name_field"
                  name="name_field"
                  className="form-control"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone_field">Mobile Number</label>
                <input
                  type="text"
                  id="phone_field"
                  className={`form-control ${errors.phone_field && "invalid"}`}
                  {...register("phone_field", {
                    pattern: {
                      value: /^(?:(?:\+|0{0,2})91(\s*[ -]\s*)?|[0]?)?[789]\d{9}$/g,
                      message: "Invalid Mobile Number",
                    },
                    maxLength: {
                      value: 15,
                      message: "Invalid Mobile Number",
                    }
                  })}
                  oninvalid={() => {
                    trigger("phone_field");
                  }}
                  required
                  maxLength={15}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />{errors.phone_field && (
                  <small className="text-danger">{errors.phone_field.message}</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="postal_code_field">Postal Code</label>
                <input
                  type="text"
                  id="postal_code_field"
                  className={`form-control ${errors.postal_code_field && "invalid"}`}
                  {...register("postal_code_field", {
                    required: "Postal Code is Required",
                    pattern: {
                      value: /^\d{3}\s?\d{3}$/,
                      message: "Your Entered Zip Code Is Not Valid.",
                    },
                  })}
                  oninvalid={() => {
                    trigger("postal_code_field");
                  }}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  onKeyUp={() => postalAddress(postalCode)}
                />
                {errors.postal_code_field && (
                  <small className="text-danger">{errors.postal_code_field.message}</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="address_field">Flat, House no., Building, Company, Apartment</label>
                <input
                  type="text"
                  id="address_field"
                  name="address_field"
                  className={`form-control ${errors.address_field && "invalid"}`}
                  {...register("address_field", {
                    minLength: {
                      value: 3,
                      message: "Flat, House no., Building, Company, Apartment is Required",
                    }
                  })}
                  oninvalid={() => {
                    trigger("address_field");
                  }}
                  value={flat}
                  required
                  onChange={(e) => setFlat(e.target.value)}
                />
                {errors.address_field && (
                  <small className="text-danger">{errors.address_field.message}</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="area_field">Area, Street, Sector, Village</label>
                <input
                  type="text"
                  id="area_field"
                  name="area_field"
                  className="form-control"
                  value={area}
                  min={5}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="landmark_field">Landmark</label>
                <input
                  type="text"
                  id="landmark_field"
                  name="landmark_field"
                  className="form-control"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="city_field">Town/City</label>
                <input
                  type="text"
                  id="city_field"
                  className="form-control invalid"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="state_field">State</label>
                <select
                  type="text"
                  id="state_field"
                  name="state_field"
                  className="form-control"
                  value={state}
                  required
                  defaultValue={{ label: "Please Select the State", value: 0 }}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">Please select a state...</option>
                  {indianState.map((state) => (
                    <option key={state.key} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="country_field">Country</label>
                <select
                  id="country_field"
                  className="form-control"
                  value={country}
                  defaultValue={{ label: "Select Country", value: 0 }}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                > <option value="">Please select a country...</option>
                  {countriesList.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="gstn_field">If GSTN Number <small className="banner-text text-secondary">(Not mandatory field)</small></label>
                <input
                  type="text"
                  id="gstn_field"
                  className={`form-control ${errors.gstn_field && "invalid"} text-uppercase`}
                  {...register("gstn_field", {
                    pattern: {
                      value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                      message: "Invalid GSTN Number",
                    },
                  })}
                  oninvalid={() => {
                    trigger("gstn_field");
                  }}
                  value={gstn}
                  onChange={(e) => setGstn(e.target.value)}
                />
                {errors.gstn_field && (
                  <small className="text-danger">{errors.gstn_field.message}</small>
                )}
              </div>

              <button
                id="shipping_btn"
                type="submit"
                className="btn btn-block py-3"
              >
                CONTINUE
              </button>
            </form>
          </div>
        </div>
      </Fragment>
    </div>
  );
};

export default Shipping;
