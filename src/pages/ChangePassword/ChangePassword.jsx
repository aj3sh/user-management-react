import {useState, useEffect} from 'react';
import { ToastContainer, toast } from 'react-toastify';

import {axiosAuth} from "../../api/axios"
import LoginRequired from "../../components/LoginRequired"
import Nav from "../../components/Nav"

import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
    
    // states
    const [current_password, setCurrentPassword] = useState('')
    const [new_password, setNewPassword] = useState('')
    const [confirm_password, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [buttonText, setButtonText] = useState('Save')

    useEffect(() => {
        setErrors({})
        setButtonText('Save')
    }, [confirm_password, current_password, new_password])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        setErrors({})

        // avoiding multiple save actions        
        if(buttonText === 'Saving') 
            return
        
        // setting isSaving to true
        setButtonText('Saving')

        axiosAuth.post(
            '/api/users/change-password', 
            JSON.stringify({current_password, new_password, confirm_password}),
        ).then((res) => {
            // setting isSaving to false (after request complete)
            setButtonText('Saved')
            
            // resetting all inputs
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')

            toast.success("Password changed successfully!", {autoClose: 3000, hideProgressBar: true})
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
            <h1>Change Password</h1>
            { errors.non_field_errors?.map((err, i) => <div key={ 'error_'+i } className='alert alert-danger'>{err}</div> ) }
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" name="current_password" id="id_current_password" className="form-control"
                        onChange={(e) => setCurrentPassword(e.target.value)} value={current_password} required/>
                    <div>{ errors.current_password?.map((err, i) => 
                        <span key={ 'error_current_password_'+i } style={{ color: 'red' }}>{err} </span> ) }</div>
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <input type="password" name="new_password" id="id_new_password" className="form-control"
                        onChange={(e) => setNewPassword(e.target.value)} value={new_password} required/>
                    <div>{ errors.new_password?.map((err, i) => 
                        <span key={ 'error_new_password_'+i } style={{ color: 'red' }}>{err} </span> ) }</div>
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirm_password" id="id_confirm_password" className="form-control"
                        onChange={(e) => setConfirmPassword(e.target.value)} value={confirm_password} required/>
                    <div>{ errors.confirm_password?.map((err, i) => 
                        <span key={ 'error_confirm_password_'+i } style={{ color: 'red' }}>{err} </span> ) }</div>
                </div>
                <button className="btn btn-primary">{buttonText}</button>
            </form>
        </div>
        <ToastContainer/>
    </LoginRequired>
}

export default ChangePassword