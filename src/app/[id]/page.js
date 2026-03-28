import { notFound } from "next/navigation";
import Card from "../../comp/Card";
import { SITE_NAME } from "../../lib/constants";
import {
  buildAbsoluteUrl,
  getProfileDescription,
  getProfileImage,
  getPublicProfile,
} from "../../lib/pocketbase";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  try {
    const profile = await getPublicProfile(params.id);
    const title = `${profile.Name || "Profile"} | ${SITE_NAME}`;
    const description = getProfileDescription(profile);
    const image = getProfileImage(profile);
    const url = buildAbsoluteUrl(params.id);

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        type: "profile",
        title,
        description,
        url,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: profile.Name || SITE_NAME,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    return {
      title: "الصفحة غير موجودة",
      description: "تعذر العثور على الملف الشخصي المطلوب.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function ProfilePage({ params }) {
  try {
    const profile = await getPublicProfile(params.id);
    return <Card profileId={params.id} initialUserData={profile} />;
  } catch (error) {
    notFound();
  }
}
