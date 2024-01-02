import { getSession } from 'next-auth/react'

import dynamic from "next/dynamic";
import Dashboard from "../components/admin/Dashboard";
import { getSession } from 'next-auth/react'


const dashboard = () => {
    return (
        <>
            <Dashboard />
        </>
    );
};

export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req })
    if (session?.user.role !== 'admin') {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    return {
        props: {}
    }
}

export default dynamic(() => Promise.resolve(dashboard), { ssr: false });
