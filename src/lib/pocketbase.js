import { cache } from "react";
import PocketBase from "pocketbase";
import {
  DEFAULT_OG_IMAGE,
  POCKETBASE_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "./constants";

export const createPocketBaseClient = () => new PocketBase(POCKETBASE_URL);

export const getPublicProfile = cache(async (id) => {
  if (!id) {
    throw new Error("Missing profile id");
  }

  const pb = createPocketBaseClient();
  return pb.collection("User").getOne(id, {
    expand: "stories,regular_users_stories",
  });
});

export const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

export const getFileUrl = (record, fileName) => {
  if (!record || !fileName) {
    return DEFAULT_OG_IMAGE;
  }

  return createPocketBaseClient().files.getURL(record, fileName);
};

export const getProfileImage = (profile) =>
  profile?.Avatar ? getFileUrl(profile, profile.Avatar) : DEFAULT_OG_IMAGE;

export const getProfileDescription = (profile) => {
  const bio = stripHtml(profile?.Bio || "");
  if (bio) {
    return bio;
  }

  const fallback = `${profile?.Name || SITE_NAME}${
    profile?.job ? ` - ${profile.job}` : ""
  }`;

  return fallback || SITE_DESCRIPTION;
};

export const buildAbsoluteUrl = (slug = "") =>
  slug ? `${SITE_URL}/${slug.replace(/^\/+/, "")}` : SITE_URL;
