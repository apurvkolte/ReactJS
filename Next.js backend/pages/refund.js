import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import { Fragment } from "react";

// Dynamically import the Refund component
const OrderFail = dynamic(() => import("../components/cart/OrderFail"), { ssr: false });

const Index = () => {
    return (
        <Fragment>
            <Seo pageTitle="Order Fail" />
            <OrderFail />
        </Fragment>
    );
};

export default Index;
