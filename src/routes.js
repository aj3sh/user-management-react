import HomePage from 'pages/Home';
import NotFoundPage from 'pages/NotFound';
import LoginPage from 'pages/Login';

export const PATHS = {
    home: '/',
    login: '/login',
}

export const ROUTES = [
    {
        path: PATHS.home,
        component: HomePage,
        exact: true,
    },
    {
        path: PATHS.login,
        component: LoginPage,
        exact: true,
    },
    {
        path: '*',
        component: NotFoundPage,
        exact: true,
    },
]

export default ROUTES;