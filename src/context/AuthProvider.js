import { createContext, useState } from "react";
import { User } from "models";

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({})

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

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext