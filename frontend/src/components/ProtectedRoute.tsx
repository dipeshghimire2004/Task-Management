import { useAppSelector } from '@/store/Hooks';
import { selectIsAuthenticated } from '@/features/authSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { ReactNode } from 'react';


interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const [loading, setLoading]=useState(true);

    useEffect(() => {
        // If not authenticated, navigate to login page
        if (isAuthenticated!==null) {
            console.log(isAuthenticated)
            setLoading(false);
            if(!isAuthenticated){
                navigate('/login');
            }
        }
    }, [isAuthenticated, navigate]);

    if(loading){
        return <div>Loading....</div>
    }

    // If not authenticated, return null to avoid rendering children
    // if (!isAuthenticated) {
    //     return null;
    // }

    // If authenticated, render the children
    return <>{children}</>;
};

export default ProtectedRoute;
