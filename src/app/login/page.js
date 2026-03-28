import Login from "../../comp/Login";

export const metadata = {
  title: "تسجيل الدخول",
  description: "سجّل الدخول إلى Waves NFC لإدارة ملفك الشخصي وروابطك ومحتوى بطاقتك الذكية.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <Login />;
}
