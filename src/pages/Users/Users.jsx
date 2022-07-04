import { useEffect, useState } from "react"
import AdminRequired from "components/AdminRequired"
import {axiosAuth} from "api/axios"
import useLogout from "hooks/useLogout";
import Nav from "components/Nav"

const UsersList = () => {

    const [users, setUsers] = useState()
    
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
                    console.log(res?.data);
                    isMounted && setUsers(res?.data)
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
    }, [])

    return (
        <AdminRequired>
            <Nav/>
            <div className="container-fluid">
                <h1>Users List</h1>
                {
                    users?.length
                    ? (
                        <table className="table table-stripped">
                            <thead>
                                <tr>
                                    <th>S.N.</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            { users.map((user, i) => (
                                <tr key={i}>
                                    <td>{i+1}</td>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button className="btn btn-info btn-sm mr-2">Update</button>
                                        <button className="btn btn-danger btn-sm">Delete</button>
                                    </td>
                                </tr>
                            ) )}
                            </tbody>
                        </table>
                    )
                    : <p>No users available</p> 
                }
            </div>
        </AdminRequired>
    )
}

export default UsersList