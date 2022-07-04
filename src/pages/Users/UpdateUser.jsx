import {useState, useEffect} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {axiosAuth} from "../../api/axios"
import AdminRequired from '../../components/AdminRequired';
import Nav from "../../components/Nav"
import { PATHS } from '../../routes';

const UpdateUser = () => {
    // hooks
    const params = useParams();
    const userId = params?.id
    const navigate = useNavigate()
    const {state} = useLocation()

    // states
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [is_superuser, setSuperuser] = useState(false)
    const [is_admin, setAdmin] = useState(false)
    const [errors, setErrors] = useState({})
    const [isSaving, setSaving] = useState(false)

    useEffect(() => {
        setErrors({})
    }, [email, first_name, last_name])

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController()
        
        const getUserDetail = () => {
            // checking if user data is sent through react state
            // hitting detail api request only if doesn't exists
            if(state?.user){
                setFirstName(state.user.first_name)
                setLastName(state.user.last_name)
                setEmail(state.user.email)
                setSuperuser(state.user.is_superuser)
                setAdmin(state.user.is_admin)
                return;
            }

            axiosAuth.get(`/api/users/${userId}`, {
                signal: controller.signal
            }).then((res) => {
                if(isMounted){
                    // changing state
                    setFirstName(res.data.first_name)
                    setLastName(res.data.last_name)
                    setEmail(res.data.email)
                    setSuperuser(res.data.is_superuser)
                    setAdmin(res.data.is_admin)
                }
            }).catch((err) => {
                if(err.code === 'ERR_CANCELED')
                    return

                console.error(err)
                // handling response error
                toast.error("Unable to load user details. Please try again later.", {autoClose: 3000, hideProgressBar: true})
            })
        }

        getUserDetail()

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [userId, state])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // checking if already saving
        if(isSaving)
            return

        setSaving(true)
        setErrors({})

        axiosAuth.put(
            `/api/users/${userId}`, 
            JSON.stringify({ first_name, last_name, email, is_superuser, is_admin}),
        ).then((res) => {
            // setting isSaving to false (after request complete)
            setSaving(false)
            toast.success("User updated successfully!", {autoClose: 3000, hideProgressBar: true})
            
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
            <h1>Update User</h1>
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

export default UpdateUser