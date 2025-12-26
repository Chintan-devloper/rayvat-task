import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginUser } from '../features/auth/authSlice';

const LoginPage = () => {
    const [username, setUsername] = useState('testadmin');
    const [password, setPassword] = useState('Test@123');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { status, error, isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/products', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({ username, password }));
    };

    return (
        <div className="login-page">
            <div className="card login-card">
                <div className="text-center mb-8">
                    <h1 className="page-title mb-2">Login</h1>
                    <p className="text-muted">Login in to continue to Rayvat Todo</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="error-alert">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        style={{ padding: '0.75rem' }}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center text-muted" style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
                    <p>Demo Credentials:</p>
                    <p>User: testadmin / Pass: Test@123</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
