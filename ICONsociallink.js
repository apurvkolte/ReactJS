
//react cion best
// npm i react-icons
// https://react-icons.github.io/react-icons/
import { FaBeer } from "react-icons/fa";




// npm install --save @fortawesome/fontawesome-free
// import '@fortawesome/fontawesome-free/css/all.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
// https://fontawesome.com/icons



// npm install --save font-awesome
import 'font-awesome/css/font-awesome.min.css';


import { EmailIcon } from "react-share";
import {
    EmailIcon, FacebookIcon, FacebookMessengerIcon, GabIcon, HatenaIcon, InstapaperIcon, LineIcon,
    LinkedinIcon, LivejournalIcon, MailruIcon, OKIcon, PinterestIcon, PocketIcon, RedditIcon, TelegramIcon,
    TumblrIcon, TwitterIcon, ViberIcon, VKIcon, WeiboIcon, WhatsappIcon, WorkplaceIcon, XIcon, EmailShareButton,
    FacebookShareButton, GabShareButton, HatenaShareButton, InstapaperShareButton, LineShareButton,
    LinkedinShareButton, LivejournalShareButton, MailruShareButton, OKShareButton, PinterestShareButton,
    PocketShareButton, RedditShareButton, TelegramShareButton, TumblrShareButton, TwitterShareButton,
    ViberShareButton, VKShareButton, WhatsappShareButton, WorkplaceShareButton,
} from "react-share";

return (
    <div>

        Lets go for a <FaBeer />?





        <FontAwesomeIcon icon={faCoffee} />






        <ul>
            <li><a href="https://api.whatsapp.com/send?phone=919970399958&lang=en&text=Hii...! Welcome to Industry Central." target="_blank">
                <i class="fa fa-whatsapp fa-2x  text-success display-5" aria-hidden="true"></i></a></li>

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



            <EmailIcon size={16} round /> sales@indicent.co.in

            <li><Link to="/admin/productNew"><i className="fa fa-plus"></i> Create</Link></li>
            <li><Link to="/admin/products"><i className="fa fa-pencil"></i>Update</Link></li>
            <li>
                <Link to="/admin/orders"><i className="fa fa-check-circle"></i>Orders</Link>
                <Link to="/admin/orders/cancel"><i className="fa fa-window-close-o"></i>Cancel Orders</Link>
                <Link to="/admin/orders/return"><i className="fa fa-reply-all"></i>Return Orders</Link>
                <Link to="/admin/orders/fail"><i className="fa fa-times"></i>Fail Orders</Link>
            </li>

            <li><Link to="/admin/users"><i className="fa fa-users"></i> Users</Link></li>
            <li><Link to="/admin/category"><i className="fa fa-list"></i> Category</Link></li>

            <li><Link to="/admin/reviews"><i className="fa fa-star-half-o"></i> Reviews</Link></li>
            <li><Link to="/admin/banner"><i className="fa fa-picture-o"></i> Banner</Link></li>

            <li><Link to="/admin/report"><i className="fa fa-file-text"></i> Report</Link></li>
        </ul>
    </div>
)