import { Fragment } from "react";
import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import Tc from "../components/tc";

const index = () => {
    return (
        <Fragment>
            <Seo pageTitle="Terms And Conditions" />
            <Tc />
        </Fragment>
    );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
