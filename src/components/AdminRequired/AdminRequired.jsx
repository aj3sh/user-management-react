import Forbidden from "../Forbidden";
import useAuth from "../../hooks/useAuth"

const AdminRequired = ({ children }) => {
    const {auth} = useAuth();

    return (
        auth?.user?.is_admin || auth?.user?.is_superuser
            ? children 
            : <Forbidden/>
    )

}

export default AdminRequired