export interface ParsedResume {
  personal_information: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
    github?: string;
  };
  professional_summary: string;
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
  };
  experience: {
    company: string;
    role: string;
    location: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    description: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field_of_study: string;
    graduation_date: string;
    gpa?: string;
  }[];
  projects: {
    name: string;
    description: string;
    url?: string;
    technologies: string[];
  }[];
  certifications: {
    name: string;
    issuer: string;
    issue_date: string;
  }[];
  languages: {
    language: string;
    proficiency: string;
  }[];
}

export const mockParsedResume: ParsedResume = {
  personal_information: {
    first_name: "Alex",
    last_name: "Johnson",
    email: "alex.j@example.com",
    phone: "+1 (555) 123-4567",
    address: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "github.com/alexjdev",
  },
  professional_summary:
    "Senior Full-Stack Engineer with 5+ years of experience designing, developing, and deploying highly scalable cloud-native web applications. Proven expertise in modern React architectures, Node.js microservices, and leading agile development teams to deliver enterprise-grade software solutions.",
  skills: {
    languages: ["TypeScript", "JavaScript", "Python", "Go", "SQL", "HTML/CSS"],
    frameworks: ["React", "Next.js", "Node.js", "Express", "Django", "Tailwind CSS"],
    tools: ["Git", "Docker", "Kubernetes", "AWS (EC2, S3, Lambda)", "PostgreSQL", "Redis"],
  },
  experience: [
    {
      company: "TechNova Solutions",
      role: "Senior Software Engineer",
      location: "San Francisco, CA",
      start_date: "2021-03",
      end_date: "Present",
      is_current: true,
      description: [
        "Architected and migrated a monolithic legacy application to a React/Next.js and Node.js microservices architecture, reducing page load times by 40%.",
        "Lead a team of 4 frontend engineers, conducting code reviews and establishing internal CI/CD testing standards using GitHub Actions.",
        "Implemented real-time collaboration features using WebSockets and Redis pub/sub.",
      ],
    },
    {
      company: "Innovate AI",
      role: "Full Stack Developer",
      location: "Austin, TX (Remote)",
      start_date: "2018-06",
      end_date: "2021-02",
      is_current: false,
      description: [
        "Developed custom dashboard analytics using React and D3.js, serving over 10,000 daily active users.",
        "Designed RESTful APIs in Python/Django for machine learning model inference.",
        "Optimized database queries in PostgreSQL, resolving critical bottlenecks during peak traffic.",
      ],
    },
  ],
  education: [
    {
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field_of_study: "Computer Science",
      graduation_date: "2018-05",
      gpa: "3.8/4.0",
    },
  ],
  projects: [
    {
      name: "OpenSource Parser",
      description: "A lightweight CLI tool for parsing JSON logs at scale.",
      url: "github.com/alexjdev/os-parser",
      technologies: ["Go", "CLI", "JSON"],
    },
    {
      name: "SaaS Boilerplate",
      description: "A highly starred Next.js boilerplate incorporating Stripe billing and Magic Link auth.",
      url: "alexjdev.com/saas-starter",
      technologies: ["Next.js", "TypeScript", "Stripe", "Prisma"],
    },
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      issue_date: "2022-08",
    },
  ],
  languages: [
    { language: "English", proficiency: "Native" },
    { language: "Spanish", proficiency: "Professional Working" },
  ],
};

export const mockRawText = `ALEX JOHNSON
San Francisco, CA | +1 (555) 123-4567 | alex.j@example.com
linkedin.com/in/alexjohnson | github.com/alexjdev

PROFESSIONAL SUMMARY
Senior Full-Stack Engineer with 5+ years of experience designing, developing, and deploying highly scalable cloud-native web applications. Proven expertise in modern React architectures, Node.js microservices, and leading agile development teams to deliver enterprise-grade software solutions.

SKILLS
Languages: TypeScript, JavaScript, Python, Go, SQL, HTML/CSS
Frameworks: React, Next.js, Node.js, Express, Django, Tailwind CSS
Tools: Git, Docker, Kubernetes, AWS (EC2, S3, Lambda), PostgreSQL, Redis

EXPERIENCE
TechNova Solutions | San Francisco, CA
Senior Software Engineer | Mar 2021 - Present
- Architected and migrated a monolithic legacy application to a React/Next.js and Node.js microservices architecture, reducing page load times by 40%.
- Lead a team of 4 frontend engineers, conducting code reviews and establishing internal CI/CD testing standards using GitHub Actions.
- Implemented real-time collaboration features using WebSockets and Redis pub/sub.

Innovate AI | Austin, TX (Remote)
Full Stack Developer | Jun 2018 - Feb 2021
- Developed custom dashboard analytics using React and D3.js, serving over 10,000 daily active users.
- Designed RESTful APIs in Python/Django for machine learning model inference.
- Optimized database queries in PostgreSQL, resolving critical bottlenecks during peak traffic.

EDUCATION
University of California, Berkeley
Bachelor of Science in Computer Science | May 2018 | GPA: 3.8/4.0

PROJECTS
OpenSource Parser
A lightweight CLI tool for parsing JSON logs at scale. (Go, CLI, JSON)

SaaS Boilerplate
A highly starred Next.js boilerplate incorporating Stripe billing and Magic Link auth. (Next.js, TypeScript, Stripe, Prisma)

CERTIFICATIONS
AWS Certified Solutions Architect – Associate | Amazon Web Services | Aug 2022

LANGUAGES
English (Native), Spanish (Professional Working)
`;
