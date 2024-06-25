import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Unauthorized from '../../components/Unauthorized';
import Loading from '../../components/layout/Loader';
const Component = dynamic(() => import('../../components/user/UpdateAddress'), { ssr: false });

// Higher-order component for session handling
const withAdminAuth = (Component) => {
    return () => {
        const { data: session, status } = useSession();
        const [isClient, setIsClient] = useState(false)
        const router = useRouter();

        useEffect(() => {
            setIsClient(true)
            if (status === 'loading') return;

            if (!session || session?.user.role !== 'admin' && session?.user.role !== 'user') {
                router.push('/');
            }
        }, [session, status, router]);

        if (status === 'loading') {
            return isClient && <Loading />;
        }

        if (!session || session?.user.role !== 'admin' && session?.user.role !== 'user') {
            return <Unauthorized />; // Or render an alternative component
        }

        return isClient && <Component />;
    };
};

// Component wrapped with session handling
const Index = withAdminAuth(Component);

const IndexPage = () => <Index />;

export default IndexPage;

