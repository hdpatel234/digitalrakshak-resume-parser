import type { StatCard } from "@/types/dashboard";

export const dashboardStats: StatCard[] = [
  {
    title: "Total Resumes Parsed",
    value: "14,235",
    change: "+12.5%",
    changeType: "positive",
    icon: "file-json",
  },
  {
    title: "Monthly API Usage",
    value: "42,000",
    change: "+18.2%",
    changeType: "positive",
    icon: "activity",
  },
  {
    title: "Active Plan",
    value: "Pro",
    change: "Renewing in 12 days",
    changeType: "neutral",
    icon: "credit-card",
  },
  {
    title: "Success Rate",
    value: "99.8%",
    change: "+0.2%",
    changeType: "positive",
    icon: "check-circle",
  },
];

export const creditsStat: StatCard = {
  title: "Credits Remaining",
  value: "58,000",
  change: "Out of 100,000",
  changeType: "neutral",
  icon: "zap",
};

export const dailyParsingActivity = [
  { day: "Mon", resumes: 1200 },
  { day: "Tue", resumes: 1800 },
  { day: "Wed", resumes: 1500 },
  { day: "Thu", resumes: 2200 },
  { day: "Fri", resumes: 2800 },
  { day: "Sat", resumes: 900 },
  { day: "Sun", resumes: 1100 },
];

export const monthlyUsage = [
  { month: "Jan", usage: 12000 },
  { month: "Feb", usage: 15000 },
  { month: "Mar", usage: 18000 },
  { month: "Apr", usage: 22000 },
  { month: "May", usage: 35000 },
  { month: "Jun", usage: 42000 },
];

export const recentResumes = [
  {
    id: "res_001",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    skills: "React, Node.js, TypeScript",
    experience: "5 Yrs",
    uploadDate: "2023-10-25",
    status: "Success",
  },
  {
    id: "res_002",
    name: "Samantha Lee",
    email: "s.lee99@example.com",
    skills: "Python, Django, AWS",
    experience: "3 Yrs",
    uploadDate: "2023-10-25",
    status: "Success",
  },
  {
    id: "res_003",
    name: "Michael Chen",
    email: "mchen@example.com",
    skills: "Java, Spring Boot, SQL",
    experience: "8 Yrs",
    uploadDate: "2023-10-24",
    status: "Failed",
  },
  {
    id: "res_004",
    name: "Priya Patel",
    email: "priya.p@example.com",
    skills: "UI/UX, Figma, CSS",
    experience: "4 Yrs",
    uploadDate: "2023-10-24",
    status: "Success",
  },
  {
    id: "res_005",
    name: "David Kim",
    email: "dkim_dev@example.com",
    skills: "Go, Kubernetes, Docker",
    experience: "6 Yrs",
    uploadDate: "2023-10-23",
    status: "Processing",
  },
];
