import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';
import LoginPage from './pages/Login';
import UserList, { CreateUser, UpdateUser } from './pages/Users';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';

export const PATHS = {
    login: '/login',
    home: '/',
    profile: '/profile',
    change_password: '/change-password',
    users: '/users/',
    users_create: '/users/create',
    users_update: '/users/:id/update'
}

const ROUTES = [
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
        path: PATHS.profile,
        component: Profile,
        exact: true,
    },
    {
        path: PATHS.change_password,
        component: ChangePassword,
        exact: true,
    },
    {
        path: PATHS.users,
        component: UserList,
        exact: true,
    },
    {
        path: PATHS.users_create,
        component: CreateUser,
        exact: true,
    },
    {
        path: PATHS.users_update,
        component: UpdateUser,
        exact: true,
    },
    {
        path: '*',
        component: NotFoundPage,
        exact: true,
    },
]

export default ROUTES;