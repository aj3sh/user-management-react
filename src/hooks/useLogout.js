import { useNavigate } from 'react-router-dom';

import axios from "../api/axios";
import { PATHS } from "../routes";
import useAuth from "./useAuth";

const useLogout = () => {

    const {setAuth} = useAuth();
    const navigate = useNavigate()

    const logout = () => {
        
        // logging out on server
        const refresh = localStorage.getItem('refresh_token') 
        axios.post('/api/users/logout', JSON.stringify({refresh}))
        .catch((e) => console.log('Error logging out.'))
        
        // setting state to null
        setAuth({ user: null })

        // removing tokens and user from localStorage
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')

        // navigating to login page
        navigate(PATHS.login, { replace: true })

    }

    return logout
}

export default useLogout