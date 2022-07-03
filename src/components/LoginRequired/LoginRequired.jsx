import useAuth from "hooks/useAuth"
import { useLocation, Navigate } from "react-router-dom"

const LoginRequired = ({ children }) => {
    const {auth} = useAuth();
    const location = useLocation();

    return (
        auth?.user
            ? children 
            : <Navigate to="/login" state={{ from: location }} replace />
    )

}

export default LoginRequired