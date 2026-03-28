import EditPage from "../../comp/EditPage";

export const metadata = {
  title: "لوحة التحكم",
  description: "إدارة الملف الشخصي والروابط والأعمال الخاصة ببطاقة Waves NFC.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EditRoute() {
  return <EditPage />;
}
