import React from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle, Gift, Heart, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Careers = () => {
  const { content } = useSettings();

  const careerCopy = content.careers_page || {
    title: 'Build Your Legacy at Infura',
    introText: 'We are always looking for driven, ethical, and ambitious recruiters and support specialists to join our corporate office.',
    cultureText: 'We foster a collaborative, high-performance workspace where innovation is celebrated, integrity is mandatory, and personal growth is structured.',
    benefits: [
      { title: 'Uncapped Commissions', desc: 'An industry-leading, transparent bonus structure rewarding your excellence.' },
      { title: 'Global Mobility', desc: 'Opportunities to transfer across our London, New York, and Singapore hubs.' },
      { title: 'Wellness & Concierge', desc: 'Comprehensive health cover, private gym memberships, and bespoke wellness benefits.' },
      { title: 'Continuous Mentorship', desc: 'Direct learning paths coached by senior search partners and industry stalwarts.' },
    ],
  };

  const perkIcons = [<Award size={20} />, <Gift size={20} />, <Heart size={20} />, <CheckCircle size={20} />];

  return (
    <div className="pt-28 pb-16 bg-secondary-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-gold uppercase block">Work With Us</span>
          <h1 className="text-4xl sm:text-5xl font-serif text-dark font-medium leading-tight">
            {careerCopy.title}
          </h1>
          <p className="text-sm text-dark-muted font-sans leading-relaxed">
            {careerCopy.introText}
          </p>
        </div>

        {/* Culture & Image Grid */}
        <section className="bg-white rounded-lg border border-slate-100 p-8 md:p-12 shadow-card mb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-100 shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80"
              alt="Office Workspace"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-dark">Our Employee Culture</h2>
            <p className="text-xs text-dark-muted font-sans leading-relaxed">
              At Infura Solutions, we maintain an atmosphere of professional dedication combined with flat-hierarchy accessibility. Our team members manage distinct recruitment verticals with autonomy, supported by top-tier search databases and intelligence tools.
            </p>
            <p className="text-xs text-dark-muted font-sans leading-relaxed">
              {careerCopy.cultureText}
            </p>
            
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-white bg-dark hover:bg-gold hover:text-slate-900 transition-colors px-6 py-3.5 rounded shadow-soft"
              >
                <span>Connect With HR Desk</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold tracking-widest text-gold uppercase block">Perks & Compensation</span>
            <h2 className="text-3xl font-serif text-dark font-semibold">Infura Career Benefits</h2>
            <p className="text-sm text-dark-muted font-sans">
              We design our compensation models and workplace benefits to secure high employee retention and support continuous career development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {careerCopy.benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm flex flex-col space-y-4 card-hover-effect">
                <div className="h-10 w-10 rounded bg-gold-light/40 flex items-center justify-center text-gold-dark shrink-0">
                  {perkIcons[index % perkIcons.length]}
                </div>
                <h3 className="font-serif text-base font-semibold text-dark">{benefit.title}</h3>
                <p className="text-xs text-dark-muted font-sans leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Careers;
