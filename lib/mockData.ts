// lib/mockData.ts
import { Alumni, Event, NewsItem, Job } from "@/types";

export const mockAlumni: Alumni[] = [
  {
    id: "1",
    fullName: "Sneha Kurian",
    email: "sneha.k@alumni.mec.ac.in",
    department: "Computer Science",
    graduationYear: "2014",
    currentCompany: "Google",
    currentRole: "Senior Product Manager",
    location: "Kochi, Kerala",
    profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
    linkedin: "https://linkedin.com/in/snehakurian",
    website: "https://snehakurian.dev",
    skills: [
      "Product Management",
      "Agile Methodology",
      "User Research",
      "Data Analytics",
      "Leadership",
    ],
    bio: "Passionate product leader with over 9 years of experience in building scalable tech products. Currently leading product initiatives at Google. Dedicated to mentoring MEC students.",
    isOnline: true,
    experience: [
      {
        id: "e1",
        company: "Google",
        role: "Senior Product Manager",
        location: "San Francisco, CA",
        startYear: "2019",
        endYear: "Present",
      },
      {
        id: "e2",
        company: "Meta",
        role: "Product Manager",
        location: "Menlo Park, CA",
        startYear: "2016",
        endYear: "2019",
      },
    ],
    education: [
      {
        id: "ed1",
        institution: "Model Engineering College",
        degree: "Bachelor of Technology",
        field: "Computer Science & Engineering",
        startYear: "2010",
        endYear: "2014",
        activities: "Coding Club President, Placement Cell",
      },
    ],
  },
  {
    id: "2",
    fullName: "Rohan Nair",
    email: "rohan.n@alumni.mec.ac.in",
    department: "Electronics & Communication",
    graduationYear: "2020",
    currentCompany: "Goldman Sachs",
    currentRole: "Quantitative Associate",
    location: "Bengaluru, India",
    profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
    linkedin: "https://linkedin.com/in/rohannair",
    skills: [
      "Financial Modeling",
      "Embedded C++",
      "Risk Management",
      "Python",
      "Algorithmic Trading",
    ],
    bio: "ECE graduate specializing in quantitative engineering and financial modeling at Goldman Sachs. Eager to guide MEC juniors.",
    experience: [
      {
        id: "e1",
        company: "Goldman Sachs",
        role: "Quantitative Associate",
        location: "Bengaluru, India",
        startYear: "2020",
        endYear: "Present",
      },
    ],
    education: [
      {
        id: "ed1",
        institution: "Model Engineering College",
        degree: "Bachelor of Technology",
        field: "Electronics & Communication",
        startYear: "2016",
        endYear: "2020",
      },
    ],
  },
  {
    id: "3",
    fullName: "Ananya Varma",
    email: "ananya.v@alumni.mec.ac.in",
    department: "Computer Science",
    graduationYear: "2022",
    currentCompany: "Spotify",
    currentRole: "Data Engineer",
    location: "Stockholm, Sweden",
    profilePicture: "https://randomuser.me/api/portraits/women/68.jpg",
    linkedin: "https://linkedin.com/in/ananyavarma",
    skills: ["Python", "SQL", "Apache Spark", "Machine Learning", "Data Pipelines"],
    bio: "Data engineer turning high-volume data into actionable insights at Spotify. Love music, algorithms, and mentoring students.",
    isOnline: true,
    experience: [
      {
        id: "e1",
        company: "Spotify",
        role: "Data Engineer",
        location: "Stockholm, Sweden",
        startYear: "2022",
        endYear: "Present",
      },
    ],
    education: [
      {
        id: "ed1",
        institution: "Model Engineering College",
        degree: "Bachelor of Technology",
        field: "Computer Science & Engineering",
        startYear: "2018",
        endYear: "2022",
      },
    ],
  },
  {
    id: "4",
    fullName: "Abhijith Menon",
    email: "abhijith.m@alumni.mec.ac.in",
    department: "Electrical Engineering",
    graduationYear: "2015",
    currentCompany: "Netflix",
    currentRole: "Senior Systems Engineer",
    location: "Los Angeles, CA",
    profilePicture: "https://randomuser.me/api/portraits/men/52.jpg",
    linkedin: "https://linkedin.com/in/abhijithmenon",
    skills: [
      "Distributed Systems",
      "Power Electronics",
      "Cloud Infrastructure",
      "Go",
      "Linux Kernels",
    ],
    bio: "Systems engineer at Netflix working on high-concurrency video delivery infrastructure. EEE alumnus passionate about system design.",
    experience: [
      {
        id: "e1",
        company: "Netflix",
        role: "Senior Systems Engineer",
        location: "Los Angeles, CA",
        startYear: "2018",
        endYear: "Present",
      },
    ],
    education: [
      {
        id: "ed1",
        institution: "Model Engineering College",
        degree: "Bachelor of Technology",
        field: "Electrical & Electronics Engineering",
        startYear: "2011",
        endYear: "2015",
      },
    ],
  },
  {
    id: "5",
    fullName: "Priya Nair",
    email: "priya.n@alumni.mec.ac.in",
    department: "Electrical Engineering",
    graduationYear: "2017",
    currentCompany: "Tesla",
    currentRole: "Senior Hardware Engineer",
    location: "Austin, TX",
    profilePicture: "https://randomuser.me/api/portraits/women/26.jpg",
    skills: ["PCB Design", "Embedded Systems", "C++", "Python", "FPGA"],
    bio: "Hardware engineer working on next-generation EV battery management systems at Tesla. Passionate about sustainable technology.",
    experience: [
      {
        id: "e1",
        company: "Tesla",
        role: "Senior Hardware Engineer",
        location: "Austin, TX",
        startYear: "2020",
        endYear: "Present",
      },
    ],
    education: [
      {
        id: "ed1",
        institution: "Model Engineering College",
        degree: "Bachelor of Technology",
        field: "Electrical Engineering",
        startYear: "2013",
        endYear: "2017",
      },
    ],
  },
  {
    id: "6",
    fullName: "Gokul Das",
    email: "gokul.d@alumni.mec.ac.in",
    department: "Computer Science",
    graduationYear: "2019",
    currentCompany: "Microsoft",
    currentRole: "Software Engineer II",
    location: "Seattle, WA",
    profilePicture: "https://randomuser.me/api/portraits/men/61.jpg",
    linkedin: "https://linkedin.com/in/gokuldas",
    skills: ["TypeScript", "React", "Azure", "Node.js", "System Design"],
    bio: "Full-stack engineer at Microsoft working on cloud developer tools. MEC CSE alumnus and tech community mentor.",
    isOnline: true,
    experience: [
      {
        id: "e1",
        company: "Microsoft",
        role: "Software Engineer II",
        location: "Seattle, WA",
        startYear: "2021",
        endYear: "Present",
      },
    ],
    education: [
      {
        id: "ed1",
        institution: "Model Engineering College",
        degree: "Bachelor of Technology",
        field: "Computer Science & Engineering",
        startYear: "2015",
        endYear: "2019",
      },
    ],
  },
  {
    id: "7",
    fullName: "Reshma Pillai",
    email: "reshma.p@alumni.mec.ac.in",
    department: "Biomedical Engineering",
    graduationYear: "2016",
    currentCompany: "Johnson & Johnson",
    currentRole: "Biomedical R&D Lead",
    location: "Kochi, Kerala",
    profilePicture: "https://randomuser.me/api/portraits/women/55.jpg",
    skills: [
      "Medical Devices",
      "R&D",
      "Bio-Signal Processing",
      "MATLAB",
      "Project Management",
    ],
    bio: "Leading R&D initiatives in healthcare device innovation. BME alumna supporting student biomedical projects.",
    experience: [
      {
        id: "e1",
        company: "Johnson & Johnson",
        role: "Biomedical R&D Lead",
        location: "New Brunswick, NJ",
        startYear: "2020",
        endYear: "Present",
      },
    ],
    education: [
      {
        id: "ed1",
        institution: "Model Engineering College",
        degree: "Bachelor of Technology",
        field: "Biomedical Engineering",
        startYear: "2012",
        endYear: "2016",
      },
    ],
  },
  {
    id: "8",
    fullName: "Nevin Thomas",
    email: "nevin.t@alumni.mec.ac.in",
    department: "Mechanical Engineering",
    graduationYear: "2021",
    currentCompany: "Airbnb",
    currentRole: "Infrastructure Operations Engineer",
    location: "San Francisco, CA",
    profilePicture: "https://randomuser.me/api/portraits/men/23.jpg",
    skills: [
      "CAD/CAM",
      "Thermal Systems",
      "Python",
      "Automation",
      "Operations",
    ],
    bio: "Mechanical engineering graduate working on server thermal automation and infrastructure ops at Airbnb.",
    experience: [
      {
        id: "e1",
        company: "Airbnb",
        role: "Infrastructure Operations Engineer",
        location: "San Francisco, CA",
        startYear: "2022",
        endYear: "Present",
      },
    ],
    education: [
      {
        id: "ed1",
        institution: "Model Engineering College",
        degree: "Bachelor of Technology",
        field: "Mechanical Engineering",
        startYear: "2017",
        endYear: "2021",
      },
    ],
  },
];

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Class of 2014 Decennial Reunion",
    date: "October 15, 2024",
    time: "6:00 PM",
    location: "MEC Auditorium, Thrikkakkara",
    type: "reunion",
    description:
      "Celebrate 10 years since graduation with your fellow batchmates. Formal reception, campus tour, and alumni talk.",
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop",
    attendees: 147,
    isFeatured: true,
    isOnline: false,
  },
  {
    id: "2",
    title: "MEC Tech Alumni Meetup",
    date: "October 22, 2024",
    time: "7:00 PM",
    location: "Kochi Infopark",
    type: "networking",
    description:
      "Meet fellow MEC alumni in software, hardware, and core engineering. Network, share guidance, and explore ideas.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
    attendees: 89,
    isOnline: false,
  },
  {
    id: "3",
    title: "AI Ethics & Systems Webinar",
    date: "November 5, 2024",
    time: "4:00 PM",
    location: "Online Event",
    type: "webinar",
    description:
      "Join alumni engineers for an in-depth session on responsible AI development and system design principles.",
    attendees: 312,
    isOnline: true,
  },
  {
    id: "4",
    title: "ECE & Hardware Guidance Session",
    date: "November 12, 2024",
    time: "9:00 AM",
    location: "MEC Seminar Hall",
    type: "networking",
    description:
      "Guidance session for ECE and EEE students on embedded systems, VLSI, and core engineering career paths.",
    attendees: 43,
    isOnline: false,
  },
  {
    id: "5",
    title: "10-Year Engineering Reunion",
    date: "October 24, 2024",
    time: "5:00 PM",
    location: "MEC Quadrangle",
    type: "reunion",
    description:
      "Engineering class reunion with lab tours, student demos, and interactive alumni cell networking.",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop",
    attendees: 201,
    isFeatured: true,
    isOnline: false,
  },
];

export const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "MEC Alumni Relations Cell Launches Mentorship Portal",
    excerpt:
      "The Alumni Relations Cell has introduced a streamlined portal for students to connect with alumni for career guidance.",
    content: "Full content here...",
    date: "October 8, 2024",
    category: "Announcement",
    image:
      "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&auto=format&fit=crop",
    author: "Alumni Relations Cell",
  },
  {
    id: "2",
    title: "Sneha Kurian (CSE 2014) Delivers Tech Keynote",
    excerpt:
      "MEC Alumna Sneha Kurian shared insights on product management and system engineering with current students.",
    content: "Full content here...",
    date: "October 3, 2024",
    category: "Achievement",
    image:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&auto=format&fit=crop",
    author: "Communications Team",
  },
  {
    id: "3",
    title: "Department Guidance Circles Launched This Semester",
    excerpt:
      "Connect with alumni across CSE, ECE, EEE, Mechanical, and Biomedical departments for domain-specific mentoring.",
    content: "Full content here...",
    date: "September 28, 2024",
    category: "Programs",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop",
    author: "Alumni Cell",
  },
];

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "DesignCo",
    location: "Kochi, Kerala · Hybrid",
    type: "full-time",
    salary: "Competitive",
    isAlumniOwned: true,
    postedAt: "2h ago",
  },
  {
    id: "2",
    title: "Embedded Systems Intern",
    company: "GlobalTech Solutions",
    location: "Bengaluru, India",
    type: "internship",
    duration: "3 Months",
    postedAt: "2h ago",
  },
  {
    id: "3",
    title: "Systems Engineer",
    company: "DataSphere",
    location: "Kochi, Kerala · On-site",
    type: "full-time",
    postedAt: "5h ago",
  },
];

export const departments = [
  "CSE",
  "Electrical & Electronics Engineering",
  "Electronics & Communication Engineering",
  "Mechanical Engineering",
  "Biomedical Engineering",
];

export const graduationYears = Array.from({ length: 35 }, (_, i) =>
  String(new Date().getFullYear() - i),
);

export const locations = [
  "kochi",
  "thiruvananthapuram",
  "kozhikode",
  "bangalore",
  "chennai",
  "hyderabad",
  "mumbai",
  "delhi",
];

export const companies = [
  "All Companies",
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
  "Tesla",
  "Goldman Sachs",
  "Spotify",
  "Airbnb",
];

export const featuredAlumni = mockAlumni.slice(0, 3);

export const stats = {
  alumni: "Verified",
  jobs: "Active",
  events: "Upcoming",
  mentors: "Available",
};
