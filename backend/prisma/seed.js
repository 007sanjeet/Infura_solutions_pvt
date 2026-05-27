const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // 1. Seed Admins
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@infurasolutions.com' },
    update: {},
    create: {
      email: 'admin@infurasolutions.com',
      password: adminPassword,
      name: 'Infura Admin',
      role: 'ADMIN',
    },
  });
  console.log(`Seeded admin: ${admin.email}`);

  // Seed Sub-Admin
  const subAdminPassword = await bcrypt.hash('subadmin123', 10);
  const subadmin = await prisma.admin.upsert({
    where: { email: 'subadmin@infurasolutions.com' },
    update: {},
    create: {
      email: 'subadmin@infurasolutions.com',
      password: subAdminPassword,
      name: 'Sarah Jenkins',
      role: 'SUB_ADMIN',
    },
  });
  console.log(`Seeded sub-admin: ${subadmin.email}`);

  // 2. Seed Job Categories
  const categories = [
    { name: 'Technology & Software', iconName: 'Cpu', description: 'Software engineering, devops, product management, and cybersecurity.' },
    { name: 'Finance & Banking', iconName: 'DollarSign', description: 'Investment banking, financial analysis, accounting, and compliance.' },
    { name: 'Healthcare & Medical', iconName: 'Activity', description: 'Clinical services, nursing, research development, and healthcare admin.' },
    { name: 'Marketing & Creative', iconName: 'Palette', description: 'Digital marketing, content strategy, brand design, and public relations.' },
    { name: 'Executive & Leadership', iconName: 'Award', description: 'C-suite advisory, executive recruitment, and operations directors.' },
  ];

  const seededCategories = [];
  for (const cat of categories) {
    const c = await prisma.jobCategory.upsert({
      where: { name: cat.name },
      update: { iconName: cat.iconName, description: cat.description },
      create: cat,
    });
    seededCategories.push(c);
  }
  console.log(`Seeded ${seededCategories.length} categories.`);

  // 3. Seed Settings
  const settings = await prisma.settings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
      companyName: 'Infura Solutions',
      address: '77 Premium Suite, Canary Wharf, London, UK',
      phone: '+44 20 7946 0958',
      email: 'info@infurasolutions.com',
      logoUrl: '',
      socialLinks: {
        facebook: 'https://facebook.com/infurasolutions',
        linkedin: 'https://linkedin.com/company/infurasolutions',
        twitter: 'https://twitter.com/infurasolutions',
        instagram: 'https://instagram.com/infurasolutions',
      },
      seoTitle: 'Infura Solutions | Premium Recruitment & Corporate Hiring Agency',
      seoDescription: 'Connecting world-class talent with elite enterprises. Professional recruitment solutions tailored to your business needs.',
      seoKeywords: 'recruitment, hiring agency, jobs, software jobs, finance recruitment, executive search',
      themeSettings: {
        primaryColor: '#ffffff',
        secondaryColor: '#f4f6f8',
        accentColor: '#0284c7',
        premiumAccent: '#c5a880',
      },
    },
  });
  console.log('Seeded default settings.');

  // 4. Seed Web Content
  const contents = [
    {
      key: 'homepage_hero',
      value: {
        title: 'Connecting World-Class Talent With Elite Enterprises',
        subtitle: 'Infura Solutions is a premier corporate recruitment agency delivering tailored headhunting and hiring services with elegance and professional integrity.',
        primaryButtonText: 'Explore Career Opportunities',
        secondaryButtonText: 'Partner With Us',
      },
    },
    {
      key: 'homepage_intro',
      value: {
        title: 'Redefining Corporate Recruitment',
        subtitle: 'At Infura Solutions, we believe that an organization is only as strong as its leaders and core team.',
        description: 'Our bespoke recruitment methodologies focus on alignment, capability, and executive fit. We partner with Fortune 500 corporations, boutique financial firms, and innovative tech organizations to secure exceptional talent that drives sustainable growth.',
        statExperience: '12+ Years',
        statRetention: '98% Client Rate',
        statPositions: '5,000+ Placed',
      },
    },
    {
      key: 'why_choose_us',
      value: [
        { title: 'Executive Search Expertise', desc: 'Our consultants hold decades of industry-specific knowledge, providing direct access to passive candidates and niche experts.', icon: 'ShieldCheck' },
        { title: 'Rigorous Candidate Vetting', desc: 'Every candidate undergoes extensive technical, cultural, and psychological assessments before presentation.', icon: 'CheckSquare' },
        { title: 'Bespoke Advisory Solutions', desc: 'We deliver tailormade recruitment programs and market insights, not generic database keyword matches.', icon: 'Compass' },
        { title: 'Uncompromising Discretion', desc: 'We operate with the highest level of confidentiality, protecting both client strategy and candidate privacy.', icon: 'Lock' },
      ],
    },
    {
      key: 'recruitment_process',
      value: [
        { step: '01', title: 'Consultation & Scope', desc: 'We deep dive into your business model, core culture, and technical requirements.' },
        { step: '02', title: 'Sourcing & Direct Search', desc: 'Our team headhunts matching talent across our global networks and proprietary database.' },
        { step: '03', title: 'Interviewing & Verification', desc: 'We conduct comprehensive validation interviews, technical trials, and reference checks.' },
        { step: '04', title: 'Placement & Integration', desc: 'We support negotiation, offer extension, onboarding, and regular post-placement evaluations.' },
      ],
    },
    {
      key: 'about_page',
      value: {
        title: 'Pioneering Recruitment Excellence',
        introText: 'Founded in London, Infura Solutions has expanded into a global network of specialized recruitment experts, delivering outstanding results for elite clients.',
        mission: 'To bridge the gap between human brilliance and corporate vision, fostering professional relationships built on trust, transparency, and elite standards.',
        vision: 'To be the global benchmark for professional headhunting, recognized for our classic elegance, premium methodology, and consistent placement excellence.',
        teamText: 'Meet our partners and senior directors who steer our specialized recruitment desks.',
      },
    },
    {
      key: 'careers_page',
      value: {
        title: 'Build Your Legacy at Infura',
        introText: 'We are always looking for driven, ethical, and ambitious recruiters and support specialists to join our corporate office.',
        cultureText: 'We foster a collaborative, high-performance workspace where innovation is celebrated, integrity is mandatory, and personal growth is structured.',
        benefits: [
          { title: 'Uncapped Commissions', desc: 'An industry-leading, transparent bonus structure rewarding your excellence.' },
          { title: 'Global Mobility', desc: 'Opportunities to transfer across our London, New York, and Singapore hubs.' },
          { title: 'Wellness & Concierge', desc: 'Comprehensive health cover, private gym memberships, and bespoke wellness benefits.' },
          { title: 'Continuous Mentorship', desc: 'Direct learning paths coached by senior search partners and industry stalwarts.' },
        ],
      },
    },
    {
      key: 'footer_content',
      value: {
        copyright: '© 2026 Infura Solutions. All rights reserved.',
        disclaimer: 'Infura Solutions is a registered employment agency. Licensing and compliance details are available upon request.',
      },
    },
  ];

  for (const item of contents) {
    await prisma.webContent.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: item,
    });
  }
  console.log('Seeded website content pages.');

  // 5. Seed Banners
  const banners = [
    {
      title: 'Connecting Elite Talent',
      subtitle: 'Premium executive search and professional hiring services.',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
      linkUrl: '/jobs',
      order: 1,
      isActive: true,
    },
    {
      title: 'Scale Your Corporate Vision',
      subtitle: 'Tailored recruitment consulting for market leaders and innovators.',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
      linkUrl: '/contact',
      order: 2,
      isActive: true,
    },
  ];

  for (const ban of banners) {
    await prisma.banner.create({
      data: ban,
    });
  }
  console.log('Seeded homepage banners.');

  // 6. Seed Testimonials
  const testimonials = [
    {
      clientName: 'Alexander Vance',
      clientRole: 'VP of Engineering',
      company: 'Aether Technology Group',
      feedback: 'Infura Solutions sourced three principal engineers for us in record time. Their technical screening was incredibly accurate; we hired almost every candidate they presented.',
      isFeatured: true,
    },
    {
      clientName: 'Victoria Sterling',
      clientRole: 'Director of Talent',
      company: 'Sterling & Co. Capital',
      feedback: 'Their professionalism, responsiveness, and understanding of the financial sector are outstanding. Infura is our exclusive partner for all director-level hires.',
      isFeatured: true,
    },
    {
      clientName: 'Derrick Reynolds',
      clientRole: 'Chief Operations Officer',
      company: 'BioPharma Global',
      feedback: 'Bespoke headhunting at its finest. Infura team understands the delicate nature of high-profile executive placements. Highly recommended.',
      isFeatured: true,
    },
  ];

  for (const test of testimonials) {
    await prisma.testimonial.create({
      data: test,
    });
  }
  console.log('Seeded testimonials.');

  // 7. Seed Jobs
  const techCat = seededCategories.find(c => c.name.startsWith('Technology'));
  const financeCat = seededCategories.find(c => c.name.startsWith('Finance'));
  const execCat = seededCategories.find(c => c.name.startsWith('Executive'));

  const jobs = [
    {
      title: 'Principal Full Stack Architect (Node & React)',
      description: '<p>We are seeking an experienced Full Stack Architect to lead the design and implementation of our cloud-native platforms. You will direct a team of 8 senior developers while collaborating with core product partners.</p><h3>Key Responsibilities</h3><ul><li>Architect modular microservices and frontend platforms.</li><li>Oversee code reviews, CI/CD integrations, and security standards.</li><li>Mentor junior and senior developers.</li></ul>',
      requirements: '<p>Minimum 8 years of software development experience, with at least 3 years in a technical leadership capacity. Strong mastery of Node.js, React, AWS, Docker, and PostgreSQL databases.</p>',
      skills: JSON.stringify(['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'System Design']),
      experienceLevel: 'Senior / Principal (8+ Years)',
      salaryRange: '£110,000 - £130,000',
      location: 'London (Hybrid)',
      jobType: 'Full-Time',
      isFeatured: true,
      categoryId: techCat ? techCat.id : seededCategories[0].id,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    {
      title: 'VP of Investment Operations',
      description: '<p>A prestigious asset management boutique is hiring a VP of Operations to lead portfolio support, trade settlement pipelines, and regulatory reporting procedures.</p><h3>Key Responsibilities</h3><ul><li>Manage post-trade clearance processes.</li><li>Liaise with compliance officers regarding FCA regulations.</li><li>Optimize operational workflow systems.</li></ul>',
      requirements: '<p>Extensive background in investment banking operations. Deep knowledge of trade settlements, global markets, and team leadership. CFA designation is a strong advantage.</p>',
      skills: JSON.stringify(['Asset Management', 'Settlements', 'FCA Regulations', 'CFA', 'Leadership']),
      experienceLevel: 'Director / Executive (10+ Years)',
      salaryRange: '£140,000 - £170,000',
      location: 'Canary Wharf, London',
      jobType: 'Full-Time',
      isFeatured: true,
      categoryId: financeCat ? financeCat.id : seededCategories[0].id,
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
    },
    {
      title: 'Managing Director of Operations',
      description: '<p>A rapid-growth clean technology company is looking for a Managing Director to scale European and Asian logistics, corporate supply networks, and regional office frameworks.</p>',
      requirements: '<p>Proven record scaling multinational systems, managing budgets upwards of £50M, and managing cross-functional global teams.</p>',
      skills: JSON.stringify(['Global Logistics', 'Supply Chain', 'Financial Budgeting', 'C-Suite Strategy']),
      experienceLevel: 'Executive / C-Suite',
      salaryRange: '£200,000+',
      location: 'London & Munich (Global Travel)',
      jobType: 'Full-Time',
      isFeatured: true,
      categoryId: execCat ? execCat.id : seededCategories[0].id,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
    },
  ];

  for (const job of jobs) {
    await prisma.job.create({
      data: job,
    });
  }
  console.log('Seeded sample job posts.');

  // 8. Seed Blog Posts
  const blogs = [
    {
      title: '5 Strategies to Secure Elite Executive Talent in 2026',
      content: '<p>The landscape for executive search is changing. Passive candidate outreach, cultural alignment, and corporate flexibility are key markers of successful headhunting efforts.</p><h3>1. Deep Personalization</h3><p>Avoid automated cold messages. High-value candidates respond to nuanced, research-led invitations.</p>',
      excerpt: 'Learn the modern techniques corporate boards are utilizing to secure world-class executive talent in a highly competitive market.',
      author: 'Jonathan Sterling, Senior Partner',
    },
    {
      title: 'Unlocking Technical Excellence: The Ultimate Tech Interview Blueprint',
      content: '<p>Technical interviews often fail because they test academic puzzle-solving rather than practical delivery. We outline how to rebuild your technical hiring pipeline for success.</p>',
      excerpt: 'How to structure tech assessments that evaluate real-world design, soft skills, and production capabilities accurately.',
      author: 'Clara Oswald, Tech Lead Recruiter',
    },
  ];

  for (const post of blogs) {
    await prisma.blogPost.create({
      data: post,
    });
  }
  console.log('Seeded blog posts.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
