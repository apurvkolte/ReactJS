import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom'

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import TermsOfUse from './components/layout/TermsOfUse';
import ReturnPolicy from './components/layout/ReturnPolicy';
import Copyright from './components/layout/Copyright';
import Privacy from './components/layout/Privacy';
import Enquiry from './components/layout/Enquiry';
import Enquiry1 from './components/layout/Enquiry1';
import Home from './components/Home';
import ProductMenu from './components/ProductMenu';
import ProductMenu1 from './components/ProductMenu1';
import ProductDetails from './components/product/ProductDetails'

//Cart Imports
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder'
import OrderSuccess from './components/cart/OrderSuccess'
import OrderFail from './components/cart/OrderFail'
import OrderError from './components/cart/OrderError'

//Orders Imports
import ListOrders from './components/order/ListOrders';
import ListCancelOrders from './components/order/ListCancelOrders';
import ListReturnOrders from './components/order/ListReturnOrders';
import OrderDetails from './components/order/OrderDetails';

//Auth or User Imports
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import NewPassword from './components/user/NewPassword';
import UpdateUser from './components/admin/UpdateUser';

//Admin Imports
import Dashboard from './components/admin/Dashboard';
import ProductsList from './components/admin/ProductsList';
import ProductsListAll from './components/admin/ProductsListAll';
import StockList from './components/admin/StockList';
import NewProduct from './components/admin/NewProduct';
import OrderList from './components/admin/OrderList';
import OrderFailList from './components/admin/OrderFailList';
import OrdersCancelList from './components/admin/OrdersCancelList';
import OrdersReturnList from './components/admin/OrdersReturnList';
import OrderListAll from './components/admin/OrderListAll';
import ProcessOrder from './components/admin/ProcessOrder';
import UsersList from './components/admin/UsersList';
import CategoryList from './components/admin/CategoryList';

import ProtectedRoute from './components/route/ProtectedRoute'
import PageNotFound from './components/PageNotFound';

import { loadUser } from './actions/userActions';
import store from './store'
import './App.css';

import { useSelector } from 'react-redux'
import UpdateProduct from './components/admin/UpdateProduct';
import ProductReviews from './components/admin/ProductReviews';
import BannerImages from './components/admin/BannerImages';
import Report from './components/admin/Report';
import MyAddress from './components/user/MyAddress';
import AddNewAddress from './components/user/AddNewAddress';
import UpdateAddress from './components/user/UpdateAddress';
import Payment from './components/cart/Payment';
import ApplyCoupon from './components/admin/ApplyCoupon';
import CouponAll from './components/admin/CouponAll';
import UpdateCoupon from './components/admin/UpdateCoupon';
import Mysqldump from './components/admin/Mysqldump';

function App() {

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  const { user } = useSelector(state => state.auth)
  return (
    <div>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search/:keyword" element={<Home />} />
          <Route path="/products/:keyword" element={<ProductMenu />} />
          <Route path="/category/:keyword" element={<ProductMenu1 />} />
          <Route path="/product/:id" exact element={<ProductDetails />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<NewPassword />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/term_of_use" element={<TermsOfUse />} />
          <Route path="/return_policy" element={<ReturnPolicy />} />
          <Route path="/copyright" element={<Copyright />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/enquiry1" element={<Enquiry1 />} />

          <Route path="/me" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
          <Route path="/me/update" exact element={<ProtectedRoute> <UpdateProfile /> </ProtectedRoute>} />
          <Route path="/me/update/myaddress" exact element={<ProtectedRoute> <MyAddress /> </ProtectedRoute>} />
          <Route path="/me/update/address/new" exact element={<ProtectedRoute> <AddNewAddress /> </ProtectedRoute>} />
          <Route path="/me/update/myaddress/:id" exact element={<ProtectedRoute> <UpdateAddress /> </ProtectedRoute>} />
          <Route path="/password/update" exact element={<ProtectedRoute> <UpdatePassword /> </ProtectedRoute>} />
          <Route path="/shipping" element={<ProtectedRoute> <Shipping /> </ProtectedRoute>} />
          <Route path="/confirm" exact element={<ProtectedRoute> <ConfirmOrder /> </ProtectedRoute>} />
          <Route path="/success" element={<ProtectedRoute> <OrderSuccess /> </ProtectedRoute>} />
          <Route path="/fail" element={<ProtectedRoute> <OrderFail /> </ProtectedRoute>} />
          <Route path="/error" element={<ProtectedRoute> <OrderError /> </ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute> <Payment /> </ProtectedRoute>} />
          <Route path="/orders/me" exact element={<ProtectedRoute> <ListOrders /> </ProtectedRoute>} />
          <Route path="/orders/cancel/me" exact element={<ProtectedRoute> <ListCancelOrders /> </ProtectedRoute>} />
          <Route path="/orders/return/me" exact element={<ProtectedRoute> <ListReturnOrders /> </ProtectedRoute>} />
          <Route path="/order/:id" exact element={<ProtectedRoute> <OrderDetails /> </ProtectedRoute>} />

          <Route path="/dashboard" exact element={<ProtectedRoute isAdmin={true} > <Dashboard /> </ProtectedRoute>} />
          <Route path="/admin/products" exact element={<ProtectedRoute isAdmin={true}> <ProductsList /> </ProtectedRoute>} />
          <Route path="/admin/productsAll" exact element={<ProtectedRoute isAdmin={true}> <ProductsListAll /> </ProtectedRoute>} />
          <Route path="/admin/stocks" exact element={<ProtectedRoute isAdmin={true}> <StockList /> </ProtectedRoute>} />
          <Route path="/admin/productNew" exact element={<ProtectedRoute isAdmin={true}> <NewProduct /> </ProtectedRoute>} />
          <Route path="/admin/product/:id" exact element={<ProtectedRoute isAdmin={true}> <UpdateProduct /> </ProtectedRoute>} />

          <Route path="/admin/orders" exact element={<ProtectedRoute isAdmin={true}> <OrderList /> </ProtectedRoute>} />
          <Route path="/admin/orders/fail" exact element={<ProtectedRoute isAdmin={true}> <OrderFailList /> </ProtectedRoute>} />
          <Route path="/admin/orders/cancel" exact element={<ProtectedRoute isAdmin={true}> <OrdersCancelList /> </ProtectedRoute>} />
          <Route path="/admin/orders/return" exact element={<ProtectedRoute isAdmin={true}> <OrdersReturnList /> </ProtectedRoute>} />
          <Route path="/admin/ordersAll" exact element={<ProtectedRoute isAdmin={true}> <OrderListAll /> </ProtectedRoute>} />
          <Route path="/admin/order/:id" exact element={<ProtectedRoute isAdmin={true}> <ProcessOrder /> </ProtectedRoute>} />
          <Route path="/admin/users" exact element={<ProtectedRoute isAdmin={true}> <UsersList /> </ProtectedRoute>} />
          <Route path="/admin/category" exact element={<ProtectedRoute isAdmin={true}> <CategoryList /> </ProtectedRoute>} />
          <Route path="/admin/user/:id" exact element={<ProtectedRoute isAdmin={true}> <UpdateUser /> </ProtectedRoute>} />
          <Route path="/admin/reviews" exact element={<ProtectedRoute isAdmin={true}> <ProductReviews /> </ProtectedRoute>} />
          <Route path="/admin/banner" exact element={<ProtectedRoute isAdmin={true}> <BannerImages /> </ProtectedRoute>} />
          <Route path="/admin/report" exact element={<ProtectedRoute isAdmin={true}> <Report /> </ProtectedRoute>} />
          <Route path="/admin/coupons" exact element={<ProtectedRoute isAdmin={true}> <ApplyCoupon /> </ProtectedRoute>} />
          <Route path="/admin/couponAll" exact element={<ProtectedRoute isAdmin={true}> <CouponAll /> </ProtectedRoute>} />
          <Route path="/admin/coupon/:id" exact element={<ProtectedRoute isAdmin={true}> <UpdateCoupon /> </ProtectedRoute>} />
          <Route path="/admin/backup" element={<ProtectedRoute isAdmin={true}> <Mysqldump /></ProtectedRoute>} />

          <Route path="/404" element={<PageNotFound />} />
          <Route path="*" element={<PageNotFound />} />

        </Routes>
      </main>



      {(user && user.role) !== 'admin' && (
        <div>
          <Footer />
        </div>
      )}

    </div>

  );
}

export default App;
