import LoginRequired from "../../components/LoginRequired"
import Nav from "../../components/Nav"
import useAuth from "../../hooks/useAuth"

const HomePage = () => {
    const {auth} = useAuth()

    return (
        <LoginRequired>
            <Nav/>
            <div className="container-fluid mt-4 text-center">
                <h1>Welcome {auth?.user?.getFullName()}</h1>
            </div>
        </LoginRequired>
    )
}

export default HomePage