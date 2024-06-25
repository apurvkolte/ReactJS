import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import Policy from "../components/policy";
import { Fragment } from "react";

const index = () => {
    return (
        <Fragment>
            <Seo pageTitle="Shipping Policy" />
            <Policy />
        </Fragment>
    );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
