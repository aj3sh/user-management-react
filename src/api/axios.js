import axios from "axios";

const BASE_URL =  process.env.REACT_APP_API_BASE_URL

const REFRESH_TOKEN_EXCEPTION = { code: 'REFRESH_TOKEN_LOAD_FAIL', message: 'Failed to load new refresh token.' }

const axiosBase = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

export default axiosBase

export const axiosAuth = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

axiosAuth.interceptors.request.use(
    (config) => {
        // adding authorization headers
        const access_token = localStorage.getItem("access_token")
        config.headers['Authorization'] = `Bearer ${access_token}`
        return config
    },
    (error) => Promise.reject(error),
);

axiosAuth.interceptors.response.use(
    response => response, 
    async (error) => {
        const prevRequest = error?.config
        
        // checking if response of token invalid
        if(error?.response?.status === 401 && error?.response?.data?.code === "token_not_valid"){
            // getting new access token if expired
            const newAccessToken = await refreshToken()

            // adding authorization header and sending the request again
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
            return axiosAuth(prevRequest)
        }

        // returning other error response
        return Promise.reject(error)
    },
);


const refreshToken = async () => {
    try{
        // requesting for new access and refresh token
        var refresh = localStorage.getItem("refresh_token")
        const res = await axiosBase.post('/api/users/token-refresh', JSON.stringify({refresh}))
        const refresh_token = res?.data?.refresh
        const access_token = res?.data?.access
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        return access_token
    }catch(err){
        console.error('Failed to load new refresh token.')
        console.error(err)

        // exception raised if new access token is not retrieved.
        throw REFRESH_TOKEN_EXCEPTION
    }
}
