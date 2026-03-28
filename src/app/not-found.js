import Lost404 from "../comp/Lost404";

export const metadata = {
  title: "الصفحة غير موجودة",
  description: "الصفحة المطلوبة غير موجودة على Waves NFC أو ربما تم نقلها.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <Lost404 />;
}
