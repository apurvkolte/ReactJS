import dynamic from "next/dynamic";
import BannerImages from "../../../components/admin/BannerImages";
import { getSession } from 'next-auth/react'
const index = () => {
    return (
        <>
            <BannerImages />
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

export default dynamic(() => Promise.resolve(index), { ssr: false });
