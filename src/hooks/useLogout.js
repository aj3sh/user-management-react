import useAuth from "./useAuth";
import { useNavigate } from 'react-router-dom';

const useLogout = () => {

    const {setAuth} = useAuth();
    const navigate = useNavigate()

    const logout = () => {
        setAuth({ user: null })
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        navigate('/login', { replace: true })
    }

    return logout
}

export default useLogout