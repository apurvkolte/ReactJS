import dynamic from "next/dynamic";
import { getSession } from 'next-auth/react';

const UpdateCoupon = dynamic(() => import('../../../components/admin/UpdateCoupon'), { ssr: false });

const CouponPage = ({ session }) => {
    if (!session || session.user.role !== 'admin') {
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
        return null;
    }
    return <UpdateCoupon />;
};

export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req });

    // If session is not present or the user is not an admin, redirect.
    if (!session || session.user.role !== 'admin') {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    // Pass the session to the client component
    return {
        props: { session },
    };
}

export default CouponPage;
