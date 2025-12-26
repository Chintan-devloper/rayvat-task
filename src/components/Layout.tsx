import { Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

const Layout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="layout-root">
            <nav className="navbar">
                <div className="container flex items-center justify-between">
                    <div style={{ flex: 1, fontSize: '1.5rem', fontWeight: 'bold' }}>Rayvat Task</div>
                    <button onClick={handleLogout} className="btn btn-danger">
                        Logout
                    </button>
                </div>
            </nav>

            <main className="container main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
