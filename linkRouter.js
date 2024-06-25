import { useDispatch, useSelector } from "react-redux";
const dispatch = useDispatch();
const { loading, error, product } = useSelector((state) => state.products);



//Next.js
import Link from 'next/link'
import { useRouter } from 'next/router'
const router = useRouter();
router.push("/admin/products");
router.push('/admin/ecommerce/products', { shallow: false }).then(() => router.reload()); //reload page


// histroy
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
const params = useParams();
console.log("params.id", params.id);

//useHistry replace by useNavigate
const navigate = useNavigate();
navigate('/home', { replace: true });


import { useHistory, useLocation } from 'react-router-dom';
history.push(location.pathname);

//location
import { useLocation, useMatch } from "react-router-dom";
const location = useLocation();

navigate('/shipping', { state: { prevPath: location.pathname } });




import { useRouter } from 'next/router'
const router1 = useRouter()
const id = router.query.id;




const greeting = 'https://youtu.be/zYIVjDFmYLE';

const greeting1 = 'https://www.youtube.com/watch?v=zYIVjDFmYLE';

if (greeting1.includes('?v=')) {
    console.log(greeting1.split('?v=')[1]);

} else {
    console.log(greeting.split('.be/')[1]);

}




//send data in link
   <Link href={`/all-products?product=${encodeURIComponent(cat.category)}`}>
      const router = useRouter();
    const { query } = router;

    console.log("router", decodeURIComponent(query.product));
	
	
	
	  <Link href={{ pathname: "/enquiry1", 
   query: { id: 5, name: "RO WATER PURIFIER 25 LPH", quantity: 1 } }}  >
  </Link>
    
    
    import { useRouter } from 'next/router'
    const router = useRouter();
    console.log("query", router);
	
	
//in react send data in linK
<Link to={{
  pathname: "/all-products",
  state: data
}}>
import { useLocation } from 'react-router-dom';
const location = useLocation();
  const { state } = location;
   