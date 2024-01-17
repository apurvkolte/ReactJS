const data = { buyItem: product, quantity: quantity, image: images[0] };
navigate('/shipping', { state: { prevPath: location.pathname, data } });


import { Link, useNavigate, useLocation } from 'react-router-dom'
const location = useLocation();
console.log("location", location);
console.log("location.state.data", location.state.data);

