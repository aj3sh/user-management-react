import { Link } from "react-router-dom"

import useAuth from "../../hooks/useAuth"
import useLogout from "../../hooks/useLogout"
import { PATHS } from "../../routes";

const Nav = () => {
    
    const logout = useLogout()
    const {auth} = useAuth()

    return (
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
            <Link className="navbar-brand" to={PATHS.home}>User Management</Link>
            <ul className="navbar-nav mr-auto">
                { (auth.user.is_superuser || auth.user.is_admin ) && <li className="nav-item">
                    <Link className="nav-link" to={PATHS.users}>Users</Link>
                </li>}
                <li className="nav-item">
                    <Link className="nav-link" to={PATHS.profile}>Profile</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to={PATHS.change_password}>Change Password</Link>
                </li>
            </ul>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <button className="nav-link btn btn-link" type="button" onClick={logout}>Logout</button>
                </li>
            </ul>
        </nav>
    )
}

export default Nav