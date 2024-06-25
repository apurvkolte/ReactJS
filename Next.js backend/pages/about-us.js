import { Fragment } from "react";
import dynamic from "next/dynamic";
import Seo from "../components/common/seo";

// Dynamically import large components
const About = dynamic(() => import("../components/about-us"));
const Services = dynamic(() => import("../components/common/Services"));

const Index = () => {
    return (
        <Fragment>
            <Seo pageTitle="About US" />
            <About />
            <Services />
        </Fragment>
    );
};

export default Index;
