// src/components/LoginPage.js

import { React, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PocketBase from 'pocketbase';
import './Login.css';
import SEOHead from './SEOHead.tsx';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const pb = useRef(null);

    useEffect(() => {
        pb.current = new PocketBase('https://waves.pockethost.io');
        if (pb.current.authStore.isValid) {
            navigate('/edit');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await pb.current.collection('user').authWithPassword(email, password);
            navigate('/edit');
        } catch (err) {
            setError('فشل تسجيل الدخول. تأكد من صحة البريد الإلكتروني وكلمة المرور.');
            console.error('Login Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEOHead
                title="تسجيل الدخول"
                description="سجّل الدخول إلى Waves NFC لإدارة ملفك الشخصي وروابطك ومحتوى بطاقتك الذكية."
                image="/logo.png"
                slug="login"
                noIndex={true}
            />
            <div className="login-container">
                <form onSubmit={handleLogin} className="login-form">
                    <h2>تسجيل الدخول</h2>
                    <div className="input-group">
                        <label htmlFor="username">البريد الإلكتروني</label>
                        <input
                            type="text"
                            id="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="user name"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">كلمة المرور</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="********"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default Login;
