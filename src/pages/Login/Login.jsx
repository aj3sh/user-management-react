import {useState, useEffect} from 'react';
import axios from 'api/axios';
import useAuth from 'hooks/useAuth';
import {User} from 'models'
import { useLocation, useNavigate } from 'react-router-dom';
import NotLogged from 'components/NotLogged';

const LoginPage = () => {
    const {setAuth} = useAuth() // setAuth to store auth data in context api
    
    // for navigation
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/'

    // states
    const [email, setEmail] = useState('') // email input value
    const [password, setPassword] = useState('') // password input value
    const [errors, setErrors] = useState({}) // rendering login errors

    useEffect(() => {
        setErrors({})
    }, [email, password])

    const handleSubmit = async (e) => {
        // handling form submit
        e.preventDefault()
        axios.post(
            '/api/users/login', 
            JSON.stringify({email, password}),
            {
                headers: {'Content-Type': 'application/json',},
            }    
        ).then((res) => {
            const user = User.map(res.data.user)
            const access_token = res.data.access
            const refresh_token = res.data.refresh
            
            // saving user to the state
            setAuth({user})

            // saving access token, refresh token and user in local storage
            localStorage.setItem('access_token', access_token)
            localStorage.setItem('refresh_token', refresh_token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            
            // navigating to from page or home page
            navigate(from, { replace: true })

        }).catch((err) => {
            // handling response error
            if(!err?.response){
                setErrors({'non_field_errors': ['No response from server.']})
            }else if(err.response?.status === 401 ){
                setErrors({'non_field_errors': [err.response?.data?.detail]})
            }else if(err.response?.status === 400 ){
                setErrors(err.response?.data)
            }
        })
    }

    return (
         <NotLogged>
            <h1>Login</h1>
            { errors.non_field_errors?.map((err, i) => <div key={ 'error_'+i } className='alert alert-danger'>{err}</div> ) }
            <form autoComplete="off" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="id_email">Email</label>
                    <input 
                        className="form-control" 
                        type="text" 
                        id="id_email" 
                        name="email"
                        onChange={(e) => setEmail(e.target.value) }
                        value={email}
                        required
                    />
                    <div>{ errors.email?.map((err, i) => 
                        <span key={ 'error_email_'+i } style={{ color: 'red' }}>{err} </span> ) }</div>
                </div>
                <div className="form-group">
                    <label htmlFor="id_password">Password</label>
                    <input 
                        className="form-control" 
                        type="password" 
                        id="id_password" 
                        name="password"
                        onChange={(e) => setPassword(e.target.value) }
                        value={password}
                        required
                    />
                    <div>{ errors.password?.map((err, i) => 
                        <span key={ 'error_password_'+i } style={{ color: 'red' }}>{err} </span> ) }</div>
                </div>
                <button className="btn btn-primary">Login</button>
            </form>
        </NotLogged>
    )
}

export default LoginPage