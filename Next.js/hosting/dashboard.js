import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Unauthorized from '../components/Unauthorized';
import Loading from '../components/layout/Loader';
const Component = dynamic(() => import('../components/admin/Dashboard'), { ssr: false });


// Higher-order component for session handling
const withAdminAuth = (Component) => {
    return () => {
        const { data: session, status } = useSession();
        const router = useRouter();

        useEffect(() => {
            if (status === 'loading') return;

            if (!session || session.user.role !== 'admin') {
                router.push('/');
            }
        }, [session, status, router]);

        if (status === 'loading') {
            return <Loading />;
        }

        if (!session || session.user.role !== 'admin') {
            return <Unauthorized />; // Or render an alternative component
        }

        return <Component />;
    };
};

// Component wrapped with session handling
const Index = withAdminAuth(Component);

const IndexPage = () => <Index />;

export default IndexPage;


// Optional: If you want to ensure session data is available immediately
// export async function getServerSideProps(context) {
//     const session = await getSession(context);

//     if (!session || session.user.role !== 'admin') {
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: false,
//             },
//         };
//     }

//     return {
//         props: { session },
//     };
// }
