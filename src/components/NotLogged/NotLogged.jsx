import { useLocation, Navigate } from "react-router-dom"

import useAuth from "../../hooks/useAuth"

const NotLogged = ({ children }) => {
    const {auth} = useAuth();
    const location = useLocation();

    return (
        auth?.user
            ? <Navigate to="/" state={{ from: location }} replace />
            : children
    )

}

export default NotLogged