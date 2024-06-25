import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Loading from '../../components/layout/Loader';
const NewPassword = dynamic(() => import("../../components/user/NewPassword"));
// Higher-order component for session handling
const withAdminAuth = (NewPassword) => {
    return () => {
        const { data: session, status } = useSession();
        const [isClient, setIsClient] = useState(false)
        const router = useRouter();

        useEffect(() => {
            if (status === 'loading') return;

            if (session || session?.user.role == 'admin' && session?.user.role == 'user') {
                router.push('/');
            }
        }, [session, status, router]);

        if (status === 'loading') {
            return <Loading />;
        }

        return isClient && <NewPassword />;
    };
};

// Component wrapped with session handling
const Index = withAdminAuth(NewPassword);

const IndexPage = () => <Index />;

export default IndexPage;


