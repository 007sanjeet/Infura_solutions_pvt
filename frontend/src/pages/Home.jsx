import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Briefcase, CheckCircle, Award, Cpu, DollarSign, Activity, Palette, ShieldCheck, CheckSquare, Compass, Lock } from 'lucide-react';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';

const Home = () => {
  const { settings, content } = useSettings();
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Dynamic Lucide Icon Mapper
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="text-accent" size={28} />;
      case 'DollarSign': return <DollarSign className="text-accent" size={28} />;
      case 'Activity': return <Activity className="text-accent" size={28} />;
      case 'Palette': return <Palette className="text-accent" size={28} />;
      case 'Award': return <Award className="text-accent" size={28} />;
      case 'ShieldCheck': return <ShieldCheck className="text-gold" size={24} />;
      case 'CheckSquare': return <CheckSquare className="text-gold" size={24} />;
      case 'Compass': return <Compass className="text-gold" size={24} />;
      case 'Lock': return <Lock className="text-gold" size={24} />;
      default: return <Briefcase className="text-accent" size={28} />;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch banners
        const bannersRes = await axios.get('http://localhost:5000/api/banners');
        setBanners(bannersRes.data);
        setLoadingBanners(false);

        // Fetch categories
        const catsRes = await axios.get('http://localhost:5000/api/categories');
        setCategories(catsRes.data.slice(0, 5));

        // Fetch featured jobs
        const jobsRes = await axios.get('http://localhost:5000/api/jobs?isFeatured=true&limit=3');
        setFeaturedJobs(jobsRes.data.jobs);
        setLoadingJobs(false);

        // Fetch featured testimonials
        const testimonialsRes = await axios.get('http://localhost:5000/api/testimonials?featuredOnly=true');
        setTestimonials(testimonialsRes.data);
      } catch (err) {
        console.error('Failed to load home page content:', err);
        setLoadingBanners(false);
        setLoadingJobs(false);
      }
    };
    fetchData();
  }, []);

  // Slide interval for banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  const prevBanner = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextBanner = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  // Testimonial Navigation
  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  // Safe variables loaded from context website content
  const heroCopy = content.homepage_hero || {
    title: 'Connecting World-Class Talent With Elite Enterprises',
    subtitle: 'Infura Solutions is a premier corporate recruitment agency delivering tailored headhunting and hiring services with elegance and professional integrity.',
    primaryButtonText: 'Explore Career Opportunities',
    secondaryButtonText: 'Partner With Us',
  };

  const introCopy = content.homepage_intro || {
    title: 'Redefining Corporate Recruitment',
    subtitle: 'At Infura Solutions, we believe that an organization is only as strong as its leaders and core team.',
    description: 'Our bespoke recruitment methodologies focus on alignment, capability, and executive fit. We partner with Fortune 500 corporations, boutique financial firms, and innovative tech organizations to secure exceptional talent that drives sustainable growth.',
    statExperience: '12+ Years',
    statRetention: '98% Client Rate',
    statPositions: '5,000+ Placed',
  };

  const whyChooseUs = content.why_choose_us || [
    { title: 'Executive Search Expertise', desc: 'Our consultants hold decades of industry-specific knowledge, providing direct access to passive candidates and niche experts.', icon: 'ShieldCheck' },
    { title: 'Rigorous Candidate Vetting', desc: 'Every candidate undergoes extensive technical, cultural, and psychological assessments before presentation.', icon: 'CheckSquare' },
    { title: 'Bespoke Advisory Solutions', desc: 'We deliver tailormade recruitment programs and market insights, not generic database keyword matches.', icon: 'Compass' },
    { title: 'Uncompromising Discretion', desc: 'We operate with the highest level of confidentiality, protecting both client strategy and candidate privacy.', icon: 'Lock' },
  ];

  const recruitmentProcess = content.recruitment_process || [
    { step: '01', title: 'Consultation & Scope', desc: 'We deep dive into your business model, core culture, and technical requirements.' },
    { step: '02', title: 'Sourcing & Direct Search', desc: 'Our team headhunts matching talent across our global networks and proprietary database.' },
    { step: '03', title: 'Interviewing & Verification', desc: 'We conduct comprehensive validation interviews, technical trials, and reference checks.' },
    { step: '04', title: 'Placement & Integration', desc: 'We support negotiation, offer extension, onboarding, and regular post-placement evaluations.' },
  ];

  return (
    <div className="pt-20">
      {/* 1. Hero Section Banner Slider */}
      <section className="relative h-[80vh] min-h-[550px] overflow-hidden bg-slate-900 text-white">
        {loadingBanners ? (
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : banners.length > 0 ? (
          // Display slides
          banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8)), url(http://localhost:5000/${banner.imageUrl})`,
                }}
              />
              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-3xl space-y-6">
                    <span className="inline-block text-xs font-semibold tracking-widest text-gold uppercase bg-gold/10 border border-gold/30 px-3 py-1 rounded">
                      Global Recruitment Specialist
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
                      {banner.title}
                    </h1>
                    <p className="text-base sm:text-lg text-slate-300 font-sans max-w-xl">
                      {banner.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                      <Link
                        to={banner.linkUrl || '/jobs'}
                        className="flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase bg-gold hover:bg-gold-dark text-slate-900 px-6 py-4 rounded transition-all duration-300 shadow-lg hover:shadow-premium"
                      >
                        <span>Learn More</span>
                        <ArrowRight size={14} />
                      </Link>
                      <Link
                        to="/contact"
                        className="flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase border border-white/20 bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded transition-all duration-300"
                      >
                        <span>Get In Touch</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Default Banner Fallback
          <div className="absolute inset-0 bg-slate-900 flex items-center">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-transparent" />
            <div className="absolute inset-0 flex items-center z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl space-y-6">
                  <span className="inline-block text-xs font-semibold tracking-widest text-gold uppercase bg-gold/10 border border-gold/30 px-3 py-1 rounded">
                    Global Recruitment Specialists
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold leading-tight text-white">
                    {heroCopy.title}
                  </h1>
                  <p className="text-base sm:text-lg text-slate-300 font-sans max-w-2xl leading-relaxed">
                    {heroCopy.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Link
                      to="/jobs"
                      className="flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase bg-gold hover:bg-gold-dark text-slate-900 px-6 py-4 rounded transition-all duration-300"
                    >
                      <span>{heroCopy.primaryButtonText}</span>
                      <ArrowRight size={14} />
                    </Link>
                    <Link
                      to="/contact"
                      className="flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase border border-white/20 bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded transition-all duration-300"
                    >
                      <span>{heroCopy.secondaryButtonText}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide navigation controls */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevBanner}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextBanner}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </section>

      {/* 2. Company Introduction & Stats */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left text column */}
            <div className="space-y-6">
              <span className="text-xs font-bold tracking-widest text-gold uppercase block">About Infura Solutions</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-dark font-semibold leading-tight">
                {introCopy.title}
              </h2>
              <h3 className="text-lg font-serif italic text-accent font-medium">
                {introCopy.subtitle}
              </h3>
              <p className="text-sm text-dark-muted font-sans leading-relaxed">
                {introCopy.description}
              </p>
              {/* Stat counters (Static presentation but styled) */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                <div>
                  <p className="text-2xl sm:text-3xl font-serif font-semibold text-gold">{introCopy.statExperience}</p>
                  <p className="text-xs text-dark-muted uppercase tracking-wider font-semibold font-sans mt-1">Industry Standing</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-serif font-semibold text-gold">{introCopy.statRetention}</p>
                  <p className="text-xs text-dark-muted uppercase tracking-wider font-semibold font-sans mt-1">Retention Success</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-serif font-semibold text-gold">{introCopy.statPositions}</p>
                  <p className="text-xs text-dark-muted uppercase tracking-wider font-semibold font-sans mt-1">Talents Placed</p>
                </div>
              </div>
            </div>

            {/* Right graphic column */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-premium border border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=800&q=80"
                  alt="Executive Meeting"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-slate-900 text-white p-6 rounded-lg shadow-xl hidden sm:block border border-gold/10">
                <p className="font-serif italic text-gold text-lg">"Excellence is not an act, but a habit."</p>
                <p className="text-xs text-slate-400 mt-2 font-sans font-semibold uppercase tracking-widest">- Aristotle</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Infura Solutions */}
      <section className="py-24 bg-secondary-light border-y border-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-gold uppercase block">Core Advantages</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-dark font-semibold">
              Why Corporate Leaders Trust Us
            </h2>
            <p className="text-sm text-dark-muted font-sans">
              We bridge business strategy with executive personnel. Our commitment to client objectives sets us apart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((reason, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-card border border-slate-100 card-hover-effect flex flex-col space-y-4">
                <div className="h-12 w-12 rounded-lg bg-gold-light/40 flex items-center justify-center shrink-0">
                  {getIcon(reason.icon)}
                </div>
                <h3 className="font-serif text-base font-semibold text-dark">{reason.title}</h3>
                <p className="text-xs text-dark-muted font-sans leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Hiring Sectors / Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold tracking-widest text-gold uppercase block">Recruitment Verticals</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-dark font-semibold">Specialized Hiring Divisions</h2>
              <p className="text-sm text-dark-muted font-sans">
                Our advisors run dedicated desks, matching candidates within technical, financial, healthcare, and executive sectors.
              </p>
            </div>
            <Link
              to="/jobs"
              className="flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase text-accent hover:text-gold transition-colors font-sans"
            >
              <span>Explore All Sectors</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/jobs?categoryId=${category.id}`}
                className="bg-secondary-light p-6 rounded-lg border border-slate-100 flex flex-col items-center text-center space-y-4 card-hover-effect"
              >
                <div className="h-14 w-14 rounded-full bg-white shadow-soft flex items-center justify-center">
                  {getIcon(category.iconName)}
                </div>
                <h3 className="font-serif text-sm font-semibold text-dark">{category.name}</h3>
                <p className="text-[11px] text-dark-muted font-sans leading-relaxed line-clamp-2">
                  {category.description || 'Explore available roles in this division.'}
                </p>
                <span className="text-xs text-gold font-sans font-semibold inline-flex items-center space-x-1 group-hover:text-accent">
                  <span>View Jobs</span>
                  <ChevronRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Jobs Listing */}
      <section className="py-24 bg-secondary-light border-y border-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-gold uppercase block">Featured Positions</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-dark font-semibold">Current Premium Openings</h2>
            <p className="text-sm text-dark-muted font-sans">
              Exclusively represented by Infura Solutions. Connect with our principal desks regarding these corporate vacancies.
            </p>
          </div>

          {loadingJobs ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-64 bg-slate-200 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow-card border border-slate-150 p-6 flex flex-col justify-between card-hover-effect relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 h-16 w-16 overflow-hidden">
                    <div className="absolute top-2 right-[-24px] bg-gold/10 text-gold-dark text-[10px] font-bold py-1 w-20 text-center transform rotate-45 border border-gold/25 uppercase">
                      Featured
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-accent bg-accent-light px-2.5 py-1 rounded">
                      {job.category?.name || 'Recruitment'}
                    </span>
                    <h3 className="font-serif text-base font-semibold text-dark leading-snug line-clamp-2 pt-1">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-dark-muted font-sans">
                      <span className="bg-slate-50 px-2 py-1 rounded">{job.location}</span>
                      <span className="bg-slate-50 px-2 py-1 rounded">{job.jobType}</span>
                      <span className="bg-slate-50 px-2 py-1 rounded">{job.experienceLevel}</span>
                    </div>
                    {/* Excerpt */}
                    <div
                      className="text-xs text-dark-muted line-clamp-3 font-sans leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-dark-muted font-sans uppercase font-medium">Offered Package</p>
                      <p className="text-xs font-serif font-semibold text-gold-dark">{job.salaryRange}</p>
                    </div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-xs font-sans font-bold uppercase tracking-wider text-dark hover:text-accent transition-colors flex items-center space-x-1"
                    >
                      <span>Details</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center font-serif text-slate-500 italic">No featured listings currently available. Check back soon.</p>
          )}

          <div className="text-center mt-12">
            <Link
              to="/jobs"
              className="inline-flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase bg-dark hover:bg-gold-dark text-white px-8 py-4 rounded transition-all shadow-md"
            >
              <span>Browse All Positions</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Recruitment Process Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-bold tracking-widest text-gold uppercase block">Hiring Framework</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-dark font-semibold">Our Recruitment Methodology</h2>
            <p className="text-sm text-dark-muted font-sans">
              Our structured path ensures a high placement fit, reducing attrition rates and saving management resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-[40px] left-[12%] right-[12%] h-[1px] bg-slate-200 z-0"></div>

            {recruitmentProcess.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-4 relative z-10">
                <div className="h-20 w-20 rounded-full bg-secondary-light border border-slate-200 shadow-soft flex items-center justify-center font-serif text-xl font-bold text-gold-dark">
                  {step.step}
                </div>
                <h3 className="font-serif text-base font-semibold text-dark">{step.title}</h3>
                <p className="text-xs text-dark-muted font-sans leading-relaxed px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Testimonials Slider */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-secondary-light border-y border-secondary overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <span className="text-xs font-bold tracking-widest text-gold uppercase block">Client Reviews</span>
            <div className="font-serif text-xl sm:text-2xl text-dark leading-relaxed italic">
              "{testimonials[currentTestimonial].feedback}"
            </div>
            <div>
              <p className="font-serif text-base font-semibold text-dark">
                {testimonials[currentTestimonial].clientName}
              </p>
              <p className="text-xs text-dark-muted font-sans font-medium uppercase mt-0.5">
                {testimonials[currentTestimonial].clientRole} — {testimonials[currentTestimonial].company}
              </p>
            </div>
            
            {/* Dots navigation */}
            {testimonials.length > 1 && (
              <div className="flex justify-center space-x-2 pt-4">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      idx === currentTestimonial ? 'w-6 bg-gold' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 8. Partner Companies Logo Banner */}
      <section className="py-16 bg-white border-b border-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] text-dark-muted uppercase font-bold tracking-widest mb-10">TRUSTED BY ELITE CORPORATE ENTERPRISES</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-60">
            <span className="font-serif text-lg font-bold text-dark italic">VANCE GLOBAL</span>
            <span className="font-serif text-lg font-bold text-dark italic">AETHER CORP</span>
            <span className="font-serif text-lg font-bold text-dark italic">STERLING BANK</span>
            <span className="font-serif text-lg font-bold text-dark italic">BIOPHARMA CO</span>
            <span className="font-serif text-lg font-bold text-dark italic">LONDON ASSETS</span>
          </div>
        </div>
      </section>

      {/* 9. Recruitment CTA section */}
      <section className="py-24 bg-dark text-white relative overflow-hidden border-t border-gold/15">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80')" }}></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <span className="text-xs font-bold tracking-widest text-gold uppercase block">Partner With Us</span>
          <h2 className="text-3xl sm:text-5xl font-serif font-medium leading-tight">Secure Premium Talent Or Explore Executive Openings</h2>
          <p className="text-slate-400 font-sans text-sm max-w-2xl mx-auto leading-relaxed">
            Our search specialists are prepared to analyze your requirements and locate matching talent. Candidates can review current vacancies or submit an direct CV.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/contact"
              className="flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase bg-gold hover:bg-gold-dark text-slate-900 px-8 py-4 rounded transition-all duration-300 shadow-lg hover:shadow-premium"
            >
              <span>Submit Sourcing Scope</span>
            </Link>
            <Link
              to="/jobs"
              className="flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase border border-white/20 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded transition-all duration-300"
            >
              <span>Search Open Vacancies</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
