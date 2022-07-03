import HomePage from 'pages/Home';
import NotFoundPage from 'pages/NotFound';
import LoginPage from 'pages/Login';
import UserList from 'pages/Users';

export const PATHS = {
    login: '/login',
    home: '/',
    users: '/users/',
}

export const ROUTES = [
    {
        path: PATHS.login,
        component: LoginPage,
        exact: true,
    },
    {
        path: PATHS.home,
        component: HomePage,
        exact: true,
    },
    {
        path: PATHS.users,
        component: UserList,
        exact: true,
    },
    {
        path: '*',
        component: NotFoundPage,
        exact: true,
    },
]

export default ROUTES;