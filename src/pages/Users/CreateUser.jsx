import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {axiosAuth} from "../../api/axios"
import AdminRequired from '../../components/AdminRequired';
import Nav from "../../components/Nav"
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes';

const CreateUser = () => {
    // hooks
    const {fetchUsers} = useAuth()
    const navigate = useNavigate()

    // states
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [is_superuser, setSuperuser] = useState(false)
    const [is_admin, setAdmin] = useState(false)
    const [errors, setErrors] = useState({})
    const [isSaving, setSaving] = useState(false)

    useEffect(() => {
        setErrors({})
    }, [email, first_name, last_name, password,])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // checking if already saving
        if(isSaving)
            return

        setSaving(true)
        setErrors({})

        axiosAuth.post(
            '/api/users/', 
            JSON.stringify({ first_name, last_name, email, password, is_superuser, is_admin}),
        ).then((res) => {
            // setting isSaving to false (after request complete)
            setSaving(false)
            toast.success("User created successfully!", {autoClose: 3000, hideProgressBar: true})
            
            // refetching user
            fetchUsers(true)

            // redirecting to the users list page
            navigate(PATHS.users, { replace: true })
        }).catch((err) => {
            // handling response error
            if(!err?.response){
                setErrors({'non_field_errors': ['No response from server.']})
            }else if(err.response?.status === 401 ){
                setErrors({'non_field_errors': [err.response?.data?.detail]})
            }else if(err.response?.status === 400 ){
                setErrors(err.response?.data)
            }
            setSaving(false)
        })
        
    }

    
    
    return <AdminRequired>
        <Nav/>
        <div className="container">
            <h1>Create User</h1>
            { errors.non_field_errors?.map((err, i) => <div key={ 'error_'+i } className='alert alert-danger'>{err}</div> ) }
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="first_name" id="id_first_name" className="form-control"
                        onChange={(e) => setFirstName(e.target.value)} value={first_name}/>
                    <div>{ errors.first_name?.map((err, i) => 
                        <span key={ 'error_first_name_'+i } style={{ color: 'red' }}>{err} </span> ) }</div>
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" name="last_name" id="id_last_name" className="form-control"
                        onChange={(e) => setLastName(e.target.value)} value={last_name}/>
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
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" id="id_password" className="form-control"
                        onChange={(e) => setPassword(e.target.value)} value={password}/>
                    <div>{ errors.password?.map((err, i) => 
                        <span key={ 'error_password_'+i } style={{ color: 'red' }}>{err} </span> ) }</div>
                </div>
                <div className="checkbox">
                    <label>
                        <input className="mr-2" type="checkbox" name="is_superuser" id="id_is_superuser" 
                            checked={is_superuser} 
                            onChange={ ()=> { setSuperuser(!is_superuser) }}
                        />
                        Is Superuser
                    </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input className="mr-2" type="checkbox" name="is_admin" id="id_is_admin" 
                            checked={is_admin} 
                            onChange={ ()=> { setAdmin(!is_admin) }}
                        />
                        Is Admin
                    </label>
                </div>
                <button className="btn btn-primary" disabled={isSaving}>{ isSaving ? 'Saving':'Save' }</button>
            </form>
        </div>
    </AdminRequired>
}

export default CreateUser