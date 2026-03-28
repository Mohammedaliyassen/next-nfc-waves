"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PocketBase from "pocketbase";
import { POCKETBASE_URL } from "../lib/constants";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const pb = useRef(null);

    useEffect(() => {
        pb.current = new PocketBase(POCKETBASE_URL);

        if (pb.current.authStore.isValid) {
            router.replace("/edit");
        }
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await pb.current.collection("user").authWithPassword(username, password);
            router.push("/edit");
        } catch (err) {
            setError("فشل تسجيل الدخول. تأكد من صحة البريد الإلكتروني وكلمة المرور.");
            console.error("Login Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="login-shell" dir="rtl">
            <span className="login-orb login-orb-primary" aria-hidden="true" />

            <div className="login-card">
                <form onSubmit={handleLogin} className="login-form">
                    <Link href="/" className="login-homeLink">
                        العودة للرئيسية
                    </Link>

                    <div className="login-formHeader">
                        <span className="login-kicker">Waves NFC</span>
                        <h2>تسجيل الدخول</h2>
                        <p>
                            ادخل اسم المستخدم أو البريد الإلكتروني وكلمة المرور للوصول
                            إلى لوحة التحكم.
                        </p>
                    </div>

                    <div className="login-inputGroup">
                        <label htmlFor="username">اسم المستخدم</label>
                        <div className="login-inputWrap">
                            <span className="login-inputIcon" aria-hidden="true">
                                U
                            </span>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="اكتب الاسم أو البريد الإلكتروني"
                            />
                        </div>
                    </div>

                    <div className="login-inputGroup">
                        <label htmlFor="password">كلمة المرور</label>
                        <div className="login-inputWrap">
                            <span className="login-inputIcon" aria-hidden="true">
                                *
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                placeholder="********"
                            />
                            <button
                                type="button"
                                className="login-togglePassword"
                                onClick={() => setShowPassword((current) => !current)}
                                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                            >
                                {showPassword ? "إخفاء" : "إظهار"}
                            </button>
                        </div>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="login-submit" disabled={loading}>
                        {loading ? "جاري التحقق..." : "تسجيل الدخول"}
                    </button>

                    <p className="login-helperText">
                        بعد تسجيل الدخول سيتم تحويلك مباشرة إلى صفحة الإدارة.
                    </p>
                </form>
            </div>
        </section>
    );
};

export default Login;
