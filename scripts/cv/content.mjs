// CV text in Vietnamese and English. Facts come from src/data/content.ts: keep the two in sync.
// The English CV writes every Vietnamese name without diacritics (person, companies, school, address).

const GITHUB = 'https://github.com/nguyenngoctuyen11032003';
const LINKEDIN = 'https://www.linkedin.com/in/tuy%E1%BB%81n-nguy%E1%BB%85n-ng%E1%BB%8Dc-40432243b/';
const PORTFOLIO = 'https://nguyenngoctuyen11032003.github.io/';
const LINGUO = 'https://nguyenngoctuyen11032003.github.io/Linguo/';
const FITORA = 'https://nguyenngoctuyen11032003.github.io/Fitora/';
const EMAIL = 'nguyenngoctuyen11032003@gmail.com';
const OCI_VERIFY = 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=';

const link = (label, href) => ({ label, href });

export const links = {
  email: link(EMAIL, `mailto:${EMAIL}`),
  phone: '+84399045920',
  portfolio: link('nguyenngoctuyen11032003.github.io', PORTFOLIO),
  github: link('github.com/nguyenngoctuyen11032003', GITHUB),
  linkedin: link('linkedin.com/in/tuyen-nguyen-ngoc', LINKEDIN),
  linguo: link('nguyenngoctuyen11032003.github.io/Linguo', LINGUO),
  fitora: link('nguyenngoctuyen11032003.github.io/Fitora', FITORA),
};

const stack = {
  languages: ['TypeScript', 'JavaScript', 'Java', 'Rust', 'Dart', 'Python', 'PHP', 'SQL'],
  frontend: ['React', 'Next.js', 'Tailwind CSS', 'Vite', 'PWA', 'Leaflet'],
  backend: ['Node.js', 'NestJS', 'REST API', 'JWT', 'RBAC'],
  data: ['PostgreSQL', 'MySQL', 'Redis', 'Supabase'],
  devops: ['Docker', 'Linux', 'Nginx', 'GitHub Actions', 'Vercel'],
  cloud: ['Oracle Cloud (OCI)', 'AWS', 'Firebase'],
  apps: ['Flutter', 'Android', 'Tauri'],
  quality: ['Git', 'Vitest', 'Playwright', 'Testing Library'],
};

const OCI_ARCHITECT = `${OCI_VERIFY}E74E09EA617AE459CCAFDE696119A4E6A47EE66142145452C646A6F68858EE75`;
const OCI_FOUNDATIONS = `${OCI_VERIFY}6C0481056659765AEBDF618C414528D51BEFF0EA24301F442262EAA98494389B`;

const TECH = {
  crm: 'NestJS · Next.js · PostgreSQL · Redis · Docker',
  vr360: 'Next.js · NestJS · PostgreSQL',
  mechmap: 'Leaflet · OpenStreetMap',
  elearning: 'Next.js · NestJS · PostgreSQL · Redis',
  hrm: 'Java · JSP',
  fofreexit: 'Rust · Tauri · PDFium · QPDF',
  linguo: 'React · TypeScript · Supabase · PWA · FSRS',
  fitora: 'React · TypeScript · Supabase · PostgreSQL',
  vyora: 'Next.js · TypeScript · Tailwind CSS · Vitest',
  hotel: 'PHP · MySQL · Chart.js · jQuery',
};

export const cv = {
  vi: {
    lang: 'vi',
    file: 'cv-vi.pdf',
    docTitle: 'CV Nguyễn Ngọc Tuyền — Kỹ sư Phần mềm Full-Stack',
    name: 'Nguyễn Ngọc Tuyền',
    title: 'Kỹ sư Phần mềm Full-Stack',
    tagline: 'NestJS · Next.js / React · PostgreSQL · Oracle Cloud',
    phone: '0399 045 920',
    address: 'Dương Lâm, Văn Quán, Hà Đông, Hà Nội',
    stats: [
      { value: '2+', label: 'năm kinh nghiệm CNTT' },
      { value: '10+', label: 'dự án đã triển khai' },
      { value: '2', label: 'chứng chỉ Oracle Cloud' },
      { value: '5', label: 'sản phẩm tự phát triển' },
    ],
    h: {
      contact: 'Liên hệ',
      summary: 'Giới thiệu',
      experience: 'Kinh nghiệm làm việc',
      stack: 'Kỹ năng kỹ thuật',
      competencies: 'Năng lực cốt lõi',
      projects: 'Dự án tiêu biểu',
      enterprise: 'Dự án doanh nghiệp & nhà nước',
      personal: 'Sản phẩm tự phát triển',
      certs: 'Chứng chỉ',
      education: 'Học vấn',
      languages: 'Ngoại ngữ',
      strengths: 'Thế mạnh',
      online: 'Xem trực tuyến',
      page: 'Trang 2/2',
    },
    stackGroups: [
      ['Ngôn ngữ', stack.languages],
      ['Frontend', stack.frontend],
      ['Backend & API', stack.backend],
      ['Cơ sở dữ liệu', stack.data],
      ['DevOps & CI/CD', stack.devops],
      ['Cloud', stack.cloud],
      ['Mobile & Desktop', stack.apps],
      ['Kiểm thử & công cụ', stack.quality],
    ],
    summary:
      'Kỹ sư phần mềm Full-Stack với <b>hơn 2 năm kinh nghiệm trong lĩnh vực CNTT</b>, hiện xây dựng các hệ thống cho doanh nghiệp và cơ quan nhà nước tại <b>Công ty CP An ninh mạng Quốc tế ICS</b>. Thành thạo hệ sinh thái TypeScript từ giao diện đến máy chủ (<b>NestJS, Next.js/React, PostgreSQL, Redis, Docker</b>), luôn đặt bảo mật lên hàng đầu khi xây dựng xác thực và phân quyền. Đạt chứng chỉ <b>Oracle Cloud Infrastructure 2025 Architect Associate</b>. Ngoài công việc chính, đã tự thiết kế và phát hành nhiều sản phẩm hoàn chỉnh, tiêu biểu là nền tảng học ngoại ngữ Linguo tích hợp AI và phần mềm chỉnh sửa PDF viết bằng Rust.',
    competencies: [
      'Phát triển full-stack trọn vòng: giao diện, API, cơ sở dữ liệu',
      'Thiết kế REST API, xác thực JWT, phân quyền theo vai trò',
      'PostgreSQL, Redis, Docker, CI/CD và triển khai cloud (OCI)',
      'PWA offline-first, tích hợp AI/LLM, kiểm thử tự động',
    ],
    jobs: [
      {
        role: 'Kỹ sư CNTT / Lập trình viên Full-Stack',
        org: 'Công ty CP An ninh mạng Quốc tế ICS',
        where: 'Hà Nội',
        dates: '07/2025 – nay',
        bullets: [
          'Phát triển tính năng từ giao diện đến máy chủ (Next.js/React, API NestJS, PostgreSQL/Redis) cho các hệ thống <b>doanh nghiệp và nhà nước</b>: CRM, HRM, e-learning, số hoá di tích VR360 và bản đồ số cơ giới hoá nông nghiệp ĐBSCL.',
          'Phụ trách <b>module Công việc của hệ thống CRM</b> (timeline, Kanban, lịch hẹn, duyệt việc, nhắc việc) và <b>cơ chế phân quyền</b> theo dự án/công việc.',
          'Xây dựng REST API, logic nghiệp vụ, <b>xác thực JWT và phân quyền theo phạm vi dữ liệu</b>, tuân thủ tiêu chuẩn bảo mật của một công ty an ninh mạng.',
          'Làm việc trong đội ngũ lớn theo quy trình Git trên môi trường Docker; bảo trì, sửa lỗi và mở rộng tính năng sau khi phát hành.',
        ],
      },
      {
        role: 'Lập trình viên Backend',
        org: 'Công ty CP Giáo dục Học Mãi',
        where: 'Hà Nội',
        dates: '09/2024 – 02/2025',
        bullets: [
          'Xây dựng và tối ưu <b>REST API (Node.js)</b> cho nền tảng học trực tuyến.',
          'Thiết kế lược đồ cơ sở dữ liệu, viết truy vấn SQL và xử lý nghiệp vụ phía máy chủ, bảo đảm dữ liệu nhất quán và dễ mở rộng.',
          'Phối hợp với đội frontend và kiểm thử (QA) để tích hợp API, khắc phục lỗi và đưa tính năng lên môi trường vận hành.',
        ],
      },
      {
        role: 'Quản lý đội ngũ kỹ thuật',
        org: 'Công ty TNHH Sản xuất & Xuất nhập khẩu Khang Minh',
        where: 'Hà Nội',
        dates: '03/2023 – 06/2024',
        bullets: [
          '<b>Dẫn dắt đội ngũ kỹ thuật</b>: phân công, theo dõi tiến độ và xử lý sự cố.',
          'Vận hành kênh thương mại điện tử; xây dựng và cập nhật website công ty bằng HTML, CSS và JavaScript.',
          'Ứng dụng <b>AI (Claude)</b> vào công việc hằng ngày: soạn nội dung, tự động hoá tác vụ lặp lại và hỗ trợ lập trình.',
        ],
      },
    ],
    enterprise: [
      {
        name: 'Hệ thống CRM cho doanh nghiệp',
        meta: 'Doanh nghiệp · 2025–2026',
        tech: TECH.crm,
        text: 'Quản lý khách hàng, marketing, bán hàng (báo giá, đơn hàng, hợp đồng), công việc và KPI; hành trình khách hàng dạng Kanban kéo-thả. Phụ trách module Công việc, phân quyền dự án/công việc và bố cục module Marketing.',
      },
      {
        name: 'Số hoá di tích VR360 cho xã, phường',
        meta: 'Nhà nước · 2025–2026',
        tech: TECH.vr360,
        text: 'Tour tham quan toàn cảnh 360° trên web, có bản đồ tuyến và thuyết minh song ngữ; trưng bày hiện vật đậu bạc dạng 3D (220–250 nghìn tam giác) có thể xoay, phóng to trực tiếp; quản lý danh mục di tích.',
      },
      {
        name: 'Bản đồ số cơ giới hoá nông nghiệp ĐBSCL',
        meta: 'Nhà nước · 2026',
        tech: TECH.mechmap,
        text: 'Đối chiếu năng lực máy nông nghiệp của các hợp tác xã với nhu cầu từng mùa vụ tại 11 tỉnh: bản đồ gom cụm, tô màu theo mức đáp ứng, bộ lọc đa tiêu chí, trang tổng quan, nhật ký đồng bộ với App HTX và danh mục định mức gắn văn bản ban hành.',
      },
      {
        name: 'Nền tảng đào tạo trực tuyến (e-learning)',
        meta: 'Doanh nghiệp · 2025–2026',
        tech: TECH.elearning,
        text: 'Danh mục khoá học và quy trình 4 bước đăng ký làm giảng viên; giảng viên tải lên video, tài liệu, bài kiểm tra và soạn nội dung với công cụ AI; hỗ trợ giao diện sáng/tối và đa ngôn ngữ.',
      },
      {
        name: 'Hệ thống quản trị nhân sự (HRM)',
        meta: 'Doanh nghiệp · 2025–2026',
        tech: TECH.hrm,
        text: 'Chấm công, quản lý dự án và công việc dạng Kanban, quy trình giao – nhận – duyệt việc, lịch sử thay đổi và thư viện tài liệu nội bộ.',
      },
    ],
    personal: [
      {
        name: 'Linguo — Ứng dụng học ngoại ngữ cho người Việt',
        meta: 'Sản phẩm · 2026',
        tech: TECH.linguo,
        text: 'Học tiếng Anh, Hàn, Nhật, Đức theo chuẩn CEFR, TOPIK, JLPT và Goethe: kiểm tra đầu vào thích ứng, lộ trình cá nhân hoá, ôn tập ngắt quãng FSRS, đề thi mô phỏng, gia sư AI và luyện hội thoại đóng vai. PWA học được khi mất mạng, AI qua Edge Function, bảo mật bằng RLS, CI/CD tự động.',
      },
      {
        name: 'FoFreeXit — Phần mềm chỉnh sửa PDF',
        meta: 'Mã nguồn mở · 2026',
        tech: TECH.fofreexit,
        text: 'Phần mềm desktop miễn phí thay thế Foxit: sửa nội dung trực tiếp như Word mà vẫn giữ font tiếng Việt, mã hoá AES-256, xoá thông tin nhạy cảm (redaction), chữ ký số PAdES, OCR tiếng Việt/Anh, chuyển đổi sang Word/Excel và trợ lý AI nhận lệnh bằng ngôn ngữ tự nhiên.',
      },
      {
        name: 'Fitora — Trợ lý dinh dưỡng & thể hình AI',
        meta: 'Sản phẩm · 2026',
        tech: TECH.fitora,
        text: 'Chụp ảnh món ăn để AI ước tính calo và macro; nhật ký ăn uống, lịch tập, theo dõi chỉ số cơ thể và báo cáo bằng biểu đồ; dữ liệu người dùng được bảo vệ bằng Row-Level Security; cài đặt được như ứng dụng (PWA).',
      },
      {
        name: 'Vyora — Giáo án tập gym 12 tuần',
        meta: 'Cá nhân · 2026',
        tech: TECH.vyora,
        text: 'Web app ưu tiên điện thoại, hiển thị buổi tập trong ngày kèm số hiệp, số lần lặp và video hướng dẫn; chú trọng trợ năng (điều hướng bằng bàn phím, giữ focus, vùng chạm lớn).',
      },
      {
        name: 'Hệ thống quản trị khách sạn (ERP)',
        meta: 'Cá nhân · 2024–2025',
        tech: TECH.hotel,
        text: 'Website đặt phòng cho khách và trang quản trị với dashboard doanh thu – lợi nhuận, quản lý phòng, chấm công, bảng lương, kho; nhập dữ liệu hàng loạt từ Excel; phân quyền quản trị viên và nhân viên.',
      },
    ],
    certs: [
      { name: 'OCI 2025 Certified Architect Associate', meta: 'Oracle · 10/2025 – 10/2027', href: OCI_ARCHITECT },
      { name: 'OCI 2025 Certified Foundations Associate', meta: 'Oracle · 10/2025 – 10/2027', href: OCI_FOUNDATIONS },
      { name: 'Chứng chỉ Tin học văn phòng', meta: '' },
    ],
    education: {
      degree: 'Kỹ sư Công nghệ thông tin',
      school: 'Trường Đại học Công nghệ Đông Á',
      meta: 'Hệ chính quy · 09/2021 – 06/2025',
    },
    languages: [
      ['Tiếng Việt', 'Bản ngữ', 5],
      ['Tiếng Anh', 'Đọc hiểu tài liệu kỹ thuật', 2],
    ],
    strengths: [
      ['Bảo mật là mặc định', 'Xác thực, phân quyền và mã hoá được tính đến ngay từ khâu thiết kế.'],
      ['Làm chủ toàn bộ vòng đời', 'Từ phân tích yêu cầu, thiết kế dữ liệu đến phát hành và bảo trì.'],
      ['Dẫn dắt và phối hợp', 'Từng quản lý đội kỹ thuật; phối hợp nhịp nhàng với frontend, backend và QA.'],
      ['Ứng dụng AI hiệu quả', 'Dùng AI để phát triển nhanh hơn và đưa tính năng AI vào sản phẩm thực tế.'],
    ],
    online: [
      ['Portfolio', links.portfolio],
      ['Linguo', links.linguo],
      ['Fitora', links.fitora],
      ['GitHub', links.github],
    ],
  },

  en: {
    lang: 'en',
    file: 'cv-en.pdf',
    docTitle: 'Nguyen Ngoc Tuyen — Full-Stack Software Engineer CV',
    name: 'Nguyen Ngoc Tuyen',
    title: 'Full-Stack Software Engineer',
    tagline: 'NestJS · Next.js / React · PostgreSQL · Oracle Cloud',
    phone: '(+84) 399 045 920',
    address: 'Duong Lam, Van Quan, Ha Dong, Hanoi, Vietnam',
    stats: [
      { value: '2+', label: 'years in IT' },
      { value: '10+', label: 'projects delivered' },
      { value: '2', label: 'Oracle certifications' },
      { value: '5', label: 'self-built products' },
    ],
    h: {
      contact: 'Contact',
      summary: 'Profile',
      experience: 'Work experience',
      stack: 'Technical skills',
      competencies: 'Core competencies',
      projects: 'Selected projects',
      enterprise: 'Enterprise & public sector',
      personal: 'Self-built products',
      certs: 'Certifications',
      education: 'Education',
      languages: 'Languages',
      strengths: 'Strengths',
      online: 'See it live',
      page: 'Page 2/2',
    },
    stackGroups: [
      ['Languages', stack.languages],
      ['Frontend', stack.frontend],
      ['Backend & API', stack.backend],
      ['Databases', stack.data],
      ['DevOps & CI/CD', stack.devops],
      ['Cloud', stack.cloud],
      ['Mobile & desktop', stack.apps],
      ['Testing & tooling', stack.quality],
    ],
    summary:
      'Full-Stack Software Engineer with <b>over two years of professional IT experience</b>, currently building enterprise and public-sector systems at <b>ICS International Cybersecurity JSC</b>. Fluent across the TypeScript ecosystem from interface to server (<b>NestJS, Next.js/React, PostgreSQL, Redis, Docker</b>), with security treated as a first-class concern in authentication and authorization. <b>Oracle Cloud Infrastructure 2025 Certified Architect Associate</b>. Also designs and ships complete products independently, including Linguo, an AI-powered language-learning platform, and a desktop PDF editor written in Rust.',
    competencies: [
      'End-to-end full-stack delivery: UI, API and database',
      'REST API design, JWT authentication, role-based access',
      'PostgreSQL, Redis, Docker, CI/CD and cloud (OCI)',
      'Offline-first PWAs, AI/LLM features, automated testing',
    ],
    jobs: [
      {
        role: 'IT Engineer / Full-Stack Developer',
        org: 'ICS International Cybersecurity JSC',
        where: 'Hanoi',
        dates: '07/2025 – Present',
        bullets: [
          'Build features from interface to server (Next.js/React, NestJS APIs, PostgreSQL/Redis) for <b>enterprise and government systems</b>: CRM, HRM, e-learning, VR360 digital heritage and a Mekong Delta agricultural-mechanization map.',
          'Own the <b>CRM Tasks module</b> (timeline, Kanban, appointments, approvals, reminders) and the <b>permission model</b> for projects and tasks.',
          'Develop REST APIs, business logic, <b>JWT authentication and data-scoped authorization</b> to the security standards of a cybersecurity company.',
          'Work in a large team with a Git branching workflow and Docker environments; maintain, fix and extend features after release.',
        ],
      },
      {
        role: 'Backend Developer',
        org: 'Hoc Mai Education JSC',
        where: 'Hanoi',
        dates: '09/2024 – 02/2025',
        bullets: [
          'Built and optimized <b>Node.js REST APIs</b> for an online learning platform.',
          'Designed database schemas, wrote SQL and implemented server-side logic that keeps data consistent and scalable.',
          'Worked with the frontend and QA teams to integrate APIs, fix defects and release features to production.',
        ],
      },
      {
        role: 'Technical Team Manager',
        org: 'Khang Minh Import-Export Manufacturing Co., Ltd',
        where: 'Hanoi',
        dates: '03/2023 – 06/2024',
        bullets: [
          '<b>Led the technical team</b>: assigned work, tracked progress and handled incidents.',
          'Ran the e-commerce channel; built and maintained the company website with HTML, CSS and JavaScript.',
          'Introduced <b>AI (Claude)</b> into daily work for content drafting, automating repetitive tasks and coding support.',
        ],
      },
    ],
    enterprise: [
      {
        name: 'Enterprise CRM System',
        meta: 'Enterprise · 2025–2026',
        tech: TECH.crm,
        text: 'Customers, marketing, sales (quotes, orders, contracts), tasks and KPIs, with a drag-and-drop Kanban customer journey. Responsible for the Tasks module, project and task permissions, and the Marketing layouts.',
      },
      {
        name: 'VR360 Digital Heritage for Local Authorities',
        meta: 'Government · 2025–2026',
        tech: TECH.vr360,
        text: 'Web-based 360° tours with route maps and bilingual narration; interactive 3D silver-filigree artifacts (220,000–250,000 triangles) that visitors can rotate and zoom; management of heritage sites.',
      },
      {
        name: 'Mekong Delta Agricultural Mechanization Map',
        meta: 'Government · 2026',
        tech: TECH.mechmap,
        text: 'Compares cooperatives’ machinery capacity with seasonal demand across 11 provinces: clustered map coloured by coverage, multi-criteria filters, an overview dashboard, sync logs with the cooperative app, and norms linked to official decrees.',
      },
      {
        name: 'E-learning Education Platform',
        meta: 'Enterprise · 2025–2026',
        tech: TECH.elearning,
        text: 'Course catalog and a 4-step instructor sign-up flow; instructors upload videos, materials and quizzes and draft content with AI tools; light and dark themes and multiple languages.',
      },
      {
        name: 'Human Resource Management System (HRM)',
        meta: 'Enterprise · 2025–2026',
        tech: TECH.hrm,
        text: 'Attendance, project and Kanban task management, an assign–accept–approve workflow, change history and an internal document library.',
      },
    ],
    personal: [
      {
        name: 'Linguo — Language Learning for Vietnamese Speakers',
        meta: 'Product · 2026',
        tech: TECH.linguo,
        text: 'English, Korean, Japanese and German aligned with CEFR, TOPIK, JLPT and Goethe: adaptive placement tests, personalized paths, FSRS spaced repetition, mock exams, an AI tutor and role-play conversations. Offline-first PWA, AI via Edge Functions, RLS security and automated CI/CD.',
      },
      {
        name: 'FoFreeXit — PDF Editor',
        meta: 'Open source · 2026',
        tech: TECH.fofreexit,
        text: 'A free desktop alternative to Foxit: Word-like editing that preserves Vietnamese fonts, AES-256 encryption, true redaction, PAdES digital signatures, Vietnamese/English OCR, Word/Excel conversion and an AI assistant that takes natural-language commands.',
      },
      {
        name: 'Fitora — AI Nutrition & Fitness Coach',
        meta: 'Product · 2026',
        tech: TECH.fitora,
        text: 'Snap a meal and AI estimates its calories and macros; food diary, workout planner, body tracking and chart-based reports; user data protected by Row-Level Security; installable as an app (PWA).',
      },
      {
        name: 'Vyora — 12-Week Gym Program',
        meta: 'Personal · 2026',
        tech: TECH.vyora,
        text: 'A mobile-first web app that shows the day’s workout with sets, reps and how-to videos; built for accessibility (keyboard navigation, focus management, large touch targets).',
      },
      {
        name: 'Hotel Management ERP System',
        meta: 'Personal · 2024–2025',
        tech: TECH.hotel,
        text: 'A guest booking website and an admin panel with a revenue and profit dashboard, rooms, attendance, payroll and inventory; bulk import from Excel; separate administrator and staff roles.',
      },
    ],
    certs: [
      { name: 'OCI 2025 Certified Architect Associate', meta: 'Oracle · 10/2025 – 10/2027', href: OCI_ARCHITECT },
      { name: 'OCI 2025 Certified Foundations Associate', meta: 'Oracle · 10/2025 – 10/2027', href: OCI_FOUNDATIONS },
      { name: 'Office Informatics Certificate', meta: '' },
    ],
    education: {
      degree: 'Bachelor of Engineering in Information Technology',
      school: 'Dong A University of Technology',
      meta: 'Full-time · 09/2021 – 06/2025',
    },
    languages: [
      ['Vietnamese', 'Native', 5],
      ['English', 'Reads technical documentation', 2],
    ],
    strengths: [
      ['Security by default', 'Authentication, authorization and encryption are planned from the design stage.'],
      ['Full life-cycle ownership', 'From requirements and data design to release and maintenance.'],
      ['Leadership & teamwork', 'Former technical team manager; works closely with frontend, backend and QA.'],
      ['Practical use of AI', 'Uses AI to ship faster and builds AI features into real products.'],
    ],
    online: [
      ['Portfolio', links.portfolio],
      ['Linguo', links.linguo],
      ['Fitora', links.fitora],
      ['GitHub', links.github],
    ],
  },
};
