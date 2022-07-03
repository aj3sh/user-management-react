import LoginRequired from "components/LoginRequired"
import useLogout from "hooks/useLogout"
import { Link } from "react-router-dom"

const HomePage = () => {
    const logout = useLogout()

    return (
        <LoginRequired>
            HomePage<br/>
            <Link to="/users">Users</Link><br/>
            <button type="button" onClick={logout}>Logout</button>
        </LoginRequired>
    )
}

export default HomePage