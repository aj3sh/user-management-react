import Forbidden from "../Forbidden";
import useAuth from "../../hooks/useAuth"
import LoginRequired from "../LoginRequired";

const AdminRequired = ({ children }) => {
    /*
    Allows admin and superuser to access
    */
    const {auth} = useAuth();

    return (
        <LoginRequired>
            {
                auth?.user?.is_admin || auth?.user?.is_superuser
                ? children 
                : <Forbidden/>
            }
        </LoginRequired>
    )

}

export default AdminRequired