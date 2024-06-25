import CouponAll from "../../../components/admin/CouponAll";
import { getSession } from 'next-auth/react';

const IndexPage = () => {
    return <CouponAll />;
};

export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req });
    if (!session || !session.user || session.user.role !== 'admin') {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        };
    }
    return {
        props: {}
    };
}

export default IndexPage;
