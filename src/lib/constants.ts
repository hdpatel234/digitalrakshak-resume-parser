export const APP_NAME = "Digitalrakshak Resume Parser";
export const APP_DESCRIPTION =
  "AI-powered resume parsing for enterprise HR platforms. Extract structured data from any resume in milliseconds. Built for ATS, recruiters, and HR tech teams.";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const ROUTES = {
  home: "/",
  pricing: "/pricing",
  about: "/about",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  settings: "/dashboard/settings",
  billing: "/dashboard/billing",
  admin: "/admin",
  adminUsers: "/admin/users",
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
