import { createContext, useState } from "react";

import { axiosAuth } from "../api/axios";
import useLogout from "../hooks/useLogout";
import { User } from "../models";

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    let isFetching = false
    const logout = useLogout()

    const [auth, setAuth] = useState({})
    const [users, setUsers] = useState() // for storing users list in the context

    // checking if user is already logged in ( looking on localStorage)
    if(localStorage.getItem('refresh_token') && !auth?.user){
        console.log('Loading user from localStorage')
        try{
            const userObject = JSON.parse(localStorage.getItem('user'))
            const user = User.map(userObject)
            const access_token = localStorage.getItem('access_token')
            const refresh_token = localStorage.getItem('refresh_token')
            setAuth({user, access_token, refresh_token})
        }catch(e){
            console.error('Unable to load user from localStorage')
            console.error(e)
        }
    }

    const fetchUsers = async (force=false) => {
        
        // handling already fetching
        // handling user already fetched
        // allowing force fetching
        if(isFetching || (users?.length && !force))
            return

        console.log('Fetching users')
        // already fetching flag
        isFetching = true

        try{
            const res = await axiosAuth.get('/api/users/')
            if(typeof res?.data != typeof undefined){
                const users = User.mapArray(res.data)
                setUsers(users)
                isFetching = false
            }
        }catch(err){
            if(err.code === 'REFRESH_TOKEN_LOAD_FAIL'){
                // logging out
                logout()
            }
            isFetching = false
        }
    }

    return (
        <AuthContext.Provider value={{auth, setAuth, users, fetchUsers}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext