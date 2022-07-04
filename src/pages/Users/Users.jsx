import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

import {axiosAuth} from "../../api/axios"
import AdminRequired from "../../components/AdminRequired"
import Nav from "../../components/Nav"
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";
import { User } from "../../models";
import { PATHS } from "../../routes";

const UsersList = () => {
    const {auth} = useAuth()

    const [users, setUsers] = useState()
    const [reload, setReload] = useState(1)
    
    const logout = useLogout()
    
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController()

        const getUsers = async () => {
            try{
                const res = await axiosAuth.get('/api/users/', {
                    signal: controller.signal
                })
                if(typeof res?.data != typeof undefined){
                    const users = User.mapArray(res.data)
                    isMounted && setUsers(users)
                }
            }catch(err){
                if(err.code === 'REFRESH_TOKEN_LOAD_FAIL'){
                    // logging out
                    logout()
                }
            }
        }
        getUsers()
        return () => {
            isMounted = false;
            controller.abort();
        }
        
    // eslint-disable-next-line
    }, [reload])

    const handleDelete = (userId) => {
        if(!window.confirm('Are you sure you want to delete this user?'))
            return

        console.log(`Deleting ${userId}`);
        axiosAuth.delete(`/api/users/${userId}`, {
        }).then((res) => {
            setReload(reload+1)
        }).catch((err) => {
            console.error(err)
            // handling response error
            toast.error("Unable to delete user. Please try again later.", {autoClose: 3000, hideProgressBar: true})
        })
    }

    return (
        <AdminRequired>
            <Nav/>
            <div className="container-fluid mt-4">
                <div className="float-right">
                    <Link className="btn btn-primary" to={PATHS.users_create}>Create User</Link>
                </div>
                <h1>Users List</h1>
                <table className="table table-stripped">
                            <thead>
                                <tr>
                                    <th>S.N.</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Admin Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                {
                    users?.length
                    ? (
                        
                            <tbody>
                            { users.map((user, i) => (
                                <tr key={i}>
                                    <td>{i+1}</td>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.is_superuser && 'Superuser'} {user.is_admin && 'Admin'}</td>
                                    <td>
                                        <Link 
                                            className="btn btn-info btn-sm mr-2" 
                                            to={PATHS.users_update.replace(':id', user.id)}
                                            state={{ user: user }}
                                        >Update</Link>
                                        { auth.user?.id !== user.id && <button className="btn btn-danger btn-sm" onClick={ () => handleDelete(user.id) }>Delete</button> }
                                    </td>
                                </tr>
                            ) )}
                            </tbody>
                    )
                    : <tbody><tr><td colSpan="20" className="text-center">{ users ? 'No users available': 'Loading users'}</td></tr></tbody>
                }
                </table>

            </div>
        </AdminRequired>
    )
}

export default UsersList