import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import { Fragment } from "react";

// Dynamically import the Enquiry component
const Enquiry = dynamic(() => import("../components/enquiry"), { ssr: false });

const Index = () => {
    return (
        <Fragment>
            <Seo pageTitle="Enquiry Form" />
            <Enquiry />
        </Fragment>
    );
};

export default Index;
