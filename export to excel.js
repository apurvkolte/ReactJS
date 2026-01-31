import * as XLSX from 'xlsx';

const [tableDataForExport, setTableDataForExport] = useState([]);

// Update export data when users change
useEffect(() => {
  if (users) {
    const exportData = users?.map((user, index) => ({
      id: index + 1,
      user_id: user.id || '',
      name: user.name || '',
      email: user.email || '',
      role: user.role || '',
      created_at: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
    }));

    setTableDataForExport(exportData);
  }
}, [users]);


// Export to Excel function for users
const exportToExcel = () => {
  if (tableDataForExport.length === 0) {
    toast.warning("No data to export");
    return;
  }

  // Prepare data for export
  const exportData = tableDataForExport.map(row => ({
    'Sr. No.': row.id,
    'User ID': row.user_id,
    'Name': row.name,
    'Email': row.email,
    'Role': row.role,
    'Joined Date': row.created_at
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(exportData);

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Users");

  // Generate Excel file and download
  XLSX.writeFile(wb, `users_${new Date().toISOString().split('T')[0]}.xlsx`);

  toast.success("Users data exported successfully!");
};






<div className="d-flex justify-content-between align-items-center mb-4">
  <h1 className="mb-0">All Users</h1>
  <button
    onClick={exportToExcel}
    className="btn btn-success d-flex align-items-center"
  >
    <i className="fa fa-file-excel-o me-2"></i> Export Users
  </button>
</div>





import Header from "../../common/header/dashboard/Header";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu";
import MobileMenu from "../../common/header/MobileMenu";
import Link from "next/link";
import Loader from '../../layout/Loader'
import * as XLSX from 'xlsx';
import { Fragment, useEffect, useState, useMemo } from 'react'
import { MDBDataTable } from 'mdbreact'
import { useDispatch, useSelector } from 'react-redux'
import { getSellers, deleteSeller, clearErrors } from '../../../redux/actions/productActions'
import { loadUser } from '../../../redux/actions/userActions'
import "jspdf-autotable";
// import Dialog from "../../Dialog";
import { CSVLink } from 'react-csv';
import Dialog from "../../dialog/Dialog";
import { toast } from 'react-toastify';

import { useRouter } from 'next/router'
import { DELETE_SELLER_RESET } from '../../../redux/constants/productConstants'

const index = () => {
  const router = useRouter()
  const dispatch = useDispatch();
  const [tableDataForExport, setTableDataForExport] = useState([]);
  const { loading, error, sellers } = useSelector(state => state.sellers);
  const { isDeleted } = useSelector(state => state.seller);
  const { user } = useSelector(state => state.auth);

  let seller_user;
  const isAdmin = user?.role == "admin";

  if (user?.id && sellers && user?.role == "user") {
    seller_user = sellers.filter((value) => value.user_id == user.id);
  }

  const csvData = JSON.parse(JSON.stringify(sellers ? sellers : (sellers ? sellers : [])));

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


  useEffect(() => {
    dispatch(getSellers());
    if (!user?.id) {
      dispatch(loadUser());
    }
    if (isDeleted) {
      router.push('/seller');
      toast.success("Seller has been deleted ");
      dispatch({ type: DELETE_SELLER_RESET })
      dispatch(clearErrors())
    }

  }, [dispatch, isDeleted])

  // Update export data when sellers change
  useEffect(() => {
    const dataToExport = isAdmin ? sellers : seller_user;

    if (dataToExport && dataToExport.length > 0) {
      const newExportData = dataToExport?.map((item, index) => ({
        id: index + 1,
        date: new Date(item.created_at).toLocaleDateString("en-In"),
        company_name: item.company_name || '',
        mobile: item.mobile_number || '',
        whatsapp: item.whatsapp_number || '',
        email: item.email || '',
        city: item.city || '',
        contact_person: item.contact_person || ''
      }));

      // Only update state if data has changed
      if (JSON.stringify(newExportData) !== JSON.stringify(tableDataForExport)) {
        setTableDataForExport(newExportData);
      }
    }
  }, [sellers, seller_user, isAdmin, tableDataForExport]);

  // Export to Excel function for sellers
  const exportToExcel = () => {
    if (tableDataForExport.length === 0) {
      toast.warning("No data to export");
      return;
    }

    // Prepare data for export
    const exportData = tableDataForExport.map(row => ({
      'Sr. No.': row.id,
      'Date': row.date,
      'Company Name': row.company_name,
      'Mobile': row.mobile,
      'WhatsApp': row.whatsapp,
      'Email': row.email,
      'City': row.city,
      'Contact Person': row.contact_person
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sellers");

    // Generate Excel file and download
    XLSX.writeFile(wb, `sellers_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast.success("Sellers data exported successfully!");
  };


  // Replace the entire setsellers() function with this:
  const tableData = useMemo(() => {
    const data = {
      columns: [
        {
          label: 'Date',
          field: 'date',
          sort: 'desc',
          width: 150,
        },
        {
          label: 'Company Name',
          field: 'company',
          sort: 'asc',
          width: 200,
        },
        {
          label: 'Mobile / WhatsApp',
          field: 'contact',
          sort: 'asc',
          width: 150,
        },
        {
          label: 'Email',
          field: 'email',
          sort: 'asc',
          width: 200,
        },
        {
          label: 'City',
          field: 'city',
          sort: 'asc',
          width: 150,
        },
        {
          label: 'Actions',
          field: 'actions',
          width: 120,
        },
      ],
      rows: []
    };

    const dataToDisplay = isAdmin ? sellers : seller_user;

    if (dataToDisplay) {
      dataToDisplay.forEach((item, i = 0) => {
        data.rows.push({
          company: item.company_name,
          contact: `${item.mobile_number} / ${item.whatsapp_number}`,
          email: item.email,
          city: item.city,
          date: new Date(item.created_at).toLocaleDateString("en-In"),
          actions: <Fragment>
            <button key={item.id} onClick={() => { window.location.href = `/update-seller/${item.id}` }} className="btn btn-primary py-1 px-2">
              <i className="fa fa-pencil"></i>
            </button>
            <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteSellerHandler(item.id, item.name)}>
              <i className="fa fa-trash"></i>
            </button>
          </Fragment>
        });
      });
    }

    return data;
  }, [sellers, seller_user, isAdmin]);

  const deleteSellerHandler = (id, title) => {
    handleDialog(`Are you sure you want to delete seller ${title}?`, true, title, id);
  }

  const areUSureDelete = (choose) => {
    if (choose) {
      dispatch(deleteSeller(dialog.id))
      handleDialog("", false);
    } else {
      handleDialog("", false);
    }
  }

  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header />

      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      <div className="dashboard_sidebar_menu">
        <div
          className="offcanvas offcanvas-dashboard offcanvas-start"
          tabIndex="-1"
          id="DashboardOffcanvasMenu"
          data-bs-scroll="true"
        >
          <SidebarMenu />
        </div>
      </div>
      {/* End sidebar_menu */}

      {/* <!-- Our Dashbord --> */}
      <section className="our-dashbord dashbord bgc-f7 pb50">
        <div className="container-fluid ovh">
          <div className="row" id="myDashboard">
            <div className="col-lg-12 maxw100flex-992">
              <div className="col-lg-12">
                <div className="dashboard_navigationbar dn db-1024">
                  <div className="dropdown">
                    <button
                      className="dropbtn"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#DashboardOffcanvasMenu"
                      aria-controls="DashboardOffcanvasMenu"
                    >
                      <i className="fa fa-bars pr10"></i> Dashboard Navigation
                    </button>
                  </div>
                </div>
              </div>

              <div className="row">
                <Fragment>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="mb-0">All Sellers</h1>
                    <button
                      onClick={exportToExcel}
                      className="btn btn-success d-flex align-items-center"
                    >
                      <i className="fa fa-file-excel-o me-2"></i> Export Data
                    </button>
                  </div>
                  <br />
                  <br />
                  {loading ? <Loader /> : (
                    <MDBDataTable
                      data={tableData}
                      className="cust-table px-3"
                      bordered
                      striped
                      hover scrollX
                      exportToCSV={false}
                    />
                  )}
                </Fragment>
                {/* <CSVButton  >Download me</CSVButton> */}
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




              <div className="row mt50">
                <div className="col-lg-12">
                  <div className="copyright-widget text-center">
                    <p>©{new Date().getFullYear()} ConstroBiz.com</p>
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End .col */}
          </div>
        </div>
      </section>
    </>
  );
};

export default index;
