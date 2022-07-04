import {useState, useEffect} from 'react';
import LoginRequired from "components/LoginRequired"
import Nav from "components/Nav"
import useAuth from 'hooks/useAuth';
import {axiosAuth} from "api/axios"
import { User } from 'models';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const {auth, setAuth} = useAuth()
    
    // states
    const [firstName, setFirstName] = useState(auth?.user?.first_name)
    const [lastName, setLastName] = useState(auth?.user?.last_name)
    const [email, setEmail] = useState(auth?.user?.email)
    const [errors, setErrors] = useState({})
    const [buttonText, setButtonText] = useState('Save')

    useEffect(() => {
        setErrors({})
        setButtonText('Save')
    }, [email, firstName, lastName])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        setErrors({})

        // avoiding multiple save actions        
        if(buttonText === 'Saving') 
            return
        
        // setting isSaving to true
        setButtonText('Saving')

        axiosAuth.put(
            '/api/users/profile', 
            JSON.stringify({email: email, first_name: firstName, last_name: lastName}),
        ).then((res) => {
            const user = User.map(res.data)
            
            // saving user to the state
            setAuth({user})

            // saving access token, refresh token and user in local storage
            localStorage.setItem('user', JSON.stringify(res.data))
            
            // setting isSaving to false (after request complete)
            setButtonText('Saved')

            toast.success("Profile Updated", {autoClose: 3000, hideProgressBar: true})
        }).catch((err) => {
            // handling response error
            if(!err?.response){
                setErrors({'non_field_errors': ['No response from server.']})
            }else if(err.response?.status === 401 ){
                setErrors({'non_field_errors': [err.response?.data?.detail]})
            }else if(err.response?.status === 400 ){
                setErrors(err.response?.data)
            }
            setButtonText('Save')
        })
        
    }
    
    return <LoginRequired>
        <Nav/>
        <div className="container">
            <h1>Profile</h1>
            { errors.non_field_errors?.map((err, i) => <div key={ 'error_'+i } className='alert alert-danger'>{err}</div> ) }
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="first_name" id="id_first_name" className="form-control"
                        onChange={(e) => setFirstName(e.target.value)} value={firstName}/>
                    <div>{ errors.first_name?.map((err, i) => 
                        <span key={ 'error_first_name_'+i } style={{ color: 'red' }}>{err} </span> ) }</div>
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" name="last_name" id="id_last_name" className="form-control"
                        onChange={(e) => setLastName(e.target.value)} value={lastName}/>
                    <div>{ errors.last_name?.map((err, i) => 
                        <span key={ 'error_last_name_'+i } style={{ color: 'red' }}>{err} </span> ) }</div>
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" id="id_email" className="form-control"
                        onChange={(e) => setEmail(e.target.value)} value={email}/>
                    <div>{ errors.email?.map((err, i) => 
                        <span key={ 'error_email_'+i } style={{ color: 'red' }}>{err} </span> ) }</div>
                </div>
                <button className="btn btn-primary">{buttonText}</button>
            </form>
        </div>
        <ToastContainer/>
    </LoginRequired>
}

export default Profile