import { useEffect, useState } from "react"
import AdminRequired from "components/AdminRequired"
import {axiosAuth} from "api/axios"
import useLogout from "hooks/useLogout";
// import AuthContext from "context/AuthProvider"

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
        
    }, [])

    return (
        <AdminRequired>
            <h1>Users List</h1>
            {
                users?.length
                ? (
                    <ul>
                        { users.map((user, i) => <li key={i}>{user.email}</li> )}
                    </ul>
                )
                : <p>No users available</p> 
            }
        </AdminRequired>
    )
}

// class UsersList extends Component{
//     componentDidMount(){
//         console.log(this.context)
//     }

//     render(){
//         return <>
//         Users List
//         </>
//     }
// }
// UsersList.contextType = AuthContext;

export default UsersList