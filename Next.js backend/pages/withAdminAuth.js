import { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Unauthorized from '../components/Unauthorized';
import Loading from '../components/layout/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Higher-order component for session handling
const withAdminAuth = (importComponent) => {
    const DynamicComponent = dynamic(importComponent, { ssr: false });

    return () => {
        const { data: session, status } = useSession();
        const [isClient, setIsClient] = useState(false);
        const router = useRouter();

        useEffect(() => {
            setIsClient(true);

            if (status === 'loading') return;

            if (!session || session.user.role !== 'admin') {
                toast.error("Access denied. Please log in first", { position: "bottom-center" });
                router.push('/');
            }
        }, [session, toast, status, router]);

        if (status === 'loading') {
            return isClient && <Loading />;
        }

        if (!session || session.user.role !== 'admin') {
            return <Unauthorized />;
        }

        return (
            <Fragment>
                <ToastContainer />
                {isClient && <DynamicComponent />}
            </Fragment>
        );
    };
};

export default withAdminAuth;
