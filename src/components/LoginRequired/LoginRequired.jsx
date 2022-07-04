import { useLocation, Navigate } from "react-router-dom"

import useAuth from "../../hooks/useAuth"

const LoginRequired = ({ children }) => {
    /*
    Allows logged in users to access
    */
    const {auth} = useAuth();
    const location = useLocation();

    return (
        auth?.user
            ? children 
            : <Navigate to="/login" state={{ from: location }} replace />
    )

}

export default LoginRequired