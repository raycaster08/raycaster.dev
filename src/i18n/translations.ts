export type Language = 'en' | 'zh';

export interface LegalSection {
  title: string;
  content: string;
}

export interface LegalContent {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

export type Translations = {
  nav: {
    work: string;
    notes: string;
    experience: string;
    about: string;
    contact: string;
  };
  hero: {
    role: string;
    title: string;
    italic: string;
    desc: string;
    viewWork: string;
  };
  projects: {
    title: string;
    view: string;
  };
  notes: {
    title: string;
    viewAll: string;
    readArticle: string;
    backHome: string;
    articlesTitle: string;
    articlesDesc: string;
    pageInfo: string;
  };
  experience: {
    title: string;
    items: Array<{
      role: string;
      company: string;
      period: string;
      description: string;
    }>;
  };
  about: {
    title: string;
    p1: string;
    p2: string;
  };
  footer: {
    getInTouch: string;
    talk: string;
    rights: string;
    privacy: string;
    terms: string;
    backToTop: string;
  };
  notePage: {
    back: string;
    feedback: string;
    placeholder: string;
    postingAs: string;
    noComments: string;
    exit: string;
  };
  privacyPage: LegalContent;
  termsPage: LegalContent;
};

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      work: "Work",
      notes: "Notes",
      experience: "Experience",
      about: "About",
      contact: "Contact"
    },
    hero: {
      role: "Frontend Engineer with a strong sense of aesthetics",
      title: "BUILDING DIGITAL PRODUCTS WITH TASTE.",
      italic: "DIGITAL",
      desc: "Not a pure designer, but a frontend engineer who cares deeply about visual rhythm, interaction details, and product clarity.",
      viewWork: "View Work"
    },
    projects: {
      title: "SELECTED WORKS",
      view: "VIEW"
    },
    notes: {
      title: "NOTES",
      viewAll: "All Articles",
      readArticle: "Read Article",
      backHome: "Back to Home",
      articlesTitle: "ARTICLES.",
      articlesDesc: "A collection of thoughts on design, technology, and the creative process.",
      pageInfo: "Page {current} of {total} — {count} Articles"
    },
    experience: {
      title: "THE JOURNEY.",
      items: [
        {
          role: "Frontend Lead",
          company: "Semfoundry",
          period: "2024 — Present",
          description: "Spearheading the design and development of multi-platform client-side software for a blockchain fintech leader. Responsible for high-performance trading interfaces across mobile H5, desktop applications, and Telegram Mini Apps (TMA), specializing in quantitative products like grid trading."
        },
        {
          role: "Software Development Engineer",
          company: "Hubei Luojia Laboratory",
          period: "2023 — 2024",
          description: "Contributed to the 3D Fusion Perception Team at a premier national laboratory led by Wuhan University. Developed high-performance software for real-time LiDAR 3D visualization and advanced point cloud data processing, supporting the laboratory's mission in cutting-edge aerospace information and intelligent navigation technologies."
        },
        {
          role: "Fullstack Engineer",
          company: "AllyBot",
          period: "2020 — 2023",
          description: "Focused on low-speed autonomous robots (cleaning, inspection, 3D mapping). Developed robot terminal software, 3D visualization mapping software, and map post-processing software. Involved in fullstack development and software design."
        }
      ]
    },
    about: {
      title: "HELLO.",
      p1: "I am a frontend engineer who loves aesthetics. I care about how a product looks, but even more about how it feels when people use it.",
      p2: "My work focuses on turning product ideas into polished interfaces: clear structure, intentional motion, and details that make the experience feel reliable and refined."
    },
    footer: {
      getInTouch: "Get in touch",
      talk: "LET'S TALK.",
      rights: "© 2024 RAYCASTER.DEV. ALL RIGHTS RESERVED.",
      privacy: "PRIVACY",
      terms: "TERMS",
      backToTop: "BACK TO TOP"
    },
    notePage: {
      back: "Back to Notes",
      feedback: "FEEDBACK",
      placeholder: "Write an anonymous comment...",
      postingAs: "Posting as anonymous user",
      noComments: "No comments yet — be the first",
      exit: "Exit Article"
    },
    privacyPage: {
      title: "PRIVACY POLICY",
      lastUpdated: "Last updated: February 24, 2024",
      intro: "Your privacy is important to us. This policy explains how we handle your information.",
      sections: [
        {
          title: "1. Data Collection",
          content: "We do not collect any personal data through this website. We do not use cookies for tracking or marketing purposes."
        },
        {
          title: "2. Anonymous Feedback",
          content: "When you leave a comment on our notes, it is stored anonymously. No IP addresses or identifying information are linked to your feedback."
        },
        {
          title: "3. Third-Party Links",
          content: "Our site may contain links to external sites. We are not responsible for the privacy practices of those sites."
        }
      ]
    },
    termsPage: {
      title: "TERMS OF SERVICE",
      lastUpdated: "Last updated: February 24, 2024",
      intro: "By using this website, you agree to the following terms.",
      sections: [
        {
          title: "1. Use of Content",
          content: "All content on this site is for informational purposes. You may not reproduce or distribute our content without explicit permission."
        },
        {
          title: "2. Disclaimer",
          content: "The information on this site is provided 'as is'. We make no warranties regarding the accuracy or completeness of the content."
        },
        {
          title: "3. Modifications",
          content: "We reserve the right to modify these terms at any time. Your continued use of the site constitutes acceptance of the updated terms."
        }
      ]
    }
  },
  zh: {
    nav: {
      work: "作品",
      notes: "笔记",
      experience: "经历",
      about: "关于",
      contact: "联系"
    },
    hero: {
      role: "有审美意识的前端工程师",
      title: "做有品味的数字产品界面。",
      italic: "数字",
      desc: "我不是纯设计师，而是一个在意视觉节奏、交互细节和产品表达的前端工程师。",
      viewWork: "查看作品"
    },
    projects: {
      title: "精选作品",
      view: "查看"
    },
    notes: {
      title: "笔记",
      viewAll: "全部文章",
      readArticle: "阅读文章",
      backHome: "返回首页",
      articlesTitle: "文章列表.",
      articlesDesc: "关于设计、技术和创意过程的一些思考。",
      pageInfo: "第 {current} 页，共 {total} 页 — {count} 篇文章"
    },
    experience: {
      title: "职业历程.",
      items: [
        {
          role: "前端开发主管",
          company: "Semfoundry",
          period: "2024 — 至今",
          description: "在区块链金融科技领军企业负责全平台客户端软件的设计与开发。主导移动端 H5、桌面端应用及 Telegram Mini App (TMA) 的高性能交易界面实现，专注于网格交易等量化金融产品。"
        },
        {
          role: "软件开发工程师",
          company: "湖北珞珈实验室 (Hubei Luojia Laboratory)",
          period: "2023 — 2024",
          description: "在武汉大学牵头的国家级实验室三维融合感知团队中负责核心软件开发。主导开发了激光雷达三维实时可视化软件及点云图像后期处理系统，助力实验室在时空基准、智能导航及空天信息处理领域的关键技术攻关。"
        },
        {
          role: "全栈开发工程师",
          company: "AllyBot",
          period: "2020 — 2023",
          description: "专注于低速无人驾驶机器人（清洁、巡检、点云三维建图）。负责机器人终端软件、三维可视化建图软件及地图后期处理软件的开发，涵盖前后端开发与软件设计。"
        }
      ]
    },
    about: {
      title: "你好.",
      p1: "我是一个喜欢美学的前端工程师。我在意界面是否好看，但更在意用户使用时是否自然、顺畅、可信。",
      p2: "我更擅长把产品想法落成完成度高的界面：清晰的信息结构、克制但有效的动效，以及经得起使用的细节。"
    },
    footer: {
      getInTouch: "保持联系",
      talk: "聊聊吧.",
      rights: "© 2024 RAYCASTER.DEV. 保留所有权利。",
      privacy: "隐私政策",
      terms: "服务条款",
      backToTop: "回到顶部"
    },
    notePage: {
      back: "返回笔记",
      feedback: "反馈",
      placeholder: "写下你的匿名评论...",
      postingAs: "以匿名用户身份发布",
      noComments: "暂无评论 — 成为第一个留言的人",
      exit: "退出文章"
    },
    privacyPage: {
      title: "隐私政策",
      lastUpdated: "最后更新：2024年2月24日",
      intro: "您的隐私对我们非常重要。本政策说明了我们如何处理您的信息。",
      sections: [
        {
          title: "1. 数据收集",
          content: "我们不会通过本网站收集任何个人数据。我们不使用 Cookie 进行跟踪或营销。"
        },
        {
          title: "2. 匿名反馈",
          content: "当您在笔记中留下评论时，它将以匿名方式存储。您的反馈不会链接到任何 IP 地址或身份信息。"
        },
        {
          title: "3. 第三方链接",
          content: "我们的网站可能包含指向外部网站的链接。我们不对这些网站的隐私惯例负责。"
        }
      ]
    },
    termsPage: {
      title: "服务条款",
      lastUpdated: "最后更新：2024年2月24日",
      intro: "通过使用本网站，您同意以下条款。",
      sections: [
        {
          title: "1. 内容使用",
          content: "本网站的所有内容仅供参考。未经明确许可，您不得复制或分发我们的内容。"
        },
        {
          title: "2. 免责声明",
          content: "本网站上的信息按“原样”提供。我们不对内容的准确性或完整性作任何保证。"
        },
        {
          title: "3. 条款修改",
          content: "我们保留随时修改这些条款的权利。您继续使用本网站即表示接受更新后的条款。"
        }
      ]
    }
  }
};
