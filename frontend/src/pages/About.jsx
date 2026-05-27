import React from 'react';
import { Award, Compass, Shield, Users } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const About = () => {
  const { content } = useSettings();

  const aboutCopy = content.about_page || {
    title: 'Pioneering Recruitment Excellence',
    introText: 'Founded in London, Infura Solutions has expanded into a global network of specialized recruitment experts, delivering outstanding results for elite clients.',
    mission: 'To bridge the gap between human brilliance and corporate vision, fostering professional relationships built on trust, transparency, and elite standards.',
    vision: 'To be the global benchmark for professional headhunting, recognized for our classic elegance, premium methodology, and consistent placement excellence.',
    teamText: 'Meet our partners and senior directors who steer our specialized recruitment desks.',
  };

  const team = [
    { name: 'Marcus Sterling', role: 'Managing Partner - Executive Search', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { name: 'Sarah Jenkins', role: 'Director - Finance & Banking Desk', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
    { name: 'Dr. Evelyn Vance', role: 'Head of Clinical & Medical Recruiting', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
    { name: 'Alistair Thorne', role: 'Principal Advisor - Software & Tech', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="pt-28 pb-16 bg-secondary-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-gold uppercase block">Who We Are</span>
          <h1 className="text-4xl sm:text-5xl font-serif text-dark font-medium leading-tight">
            {aboutCopy.title}
          </h1>
          <p className="text-sm text-dark-muted font-sans leading-relaxed">
            {aboutCopy.introText}
          </p>
        </div>

        {/* Narrative / Image grid */}
        <section className="bg-white rounded-lg border border-slate-100 p-8 md:p-12 shadow-card mb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-dark">Bridging Professional Milestones</h2>
            <p className="text-xs text-dark-muted font-sans leading-relaxed">
              Infura Solutions was built on a foundational philosophy: recruitment is not a transaction, it is a strategic partnership. Over the past decade, we have established search parameters that bypass standard volume databases, focusing instead on selective networks and candidate motivation factors.
            </p>
            <p className="text-xs text-dark-muted font-sans leading-relaxed">
              We coordinate candidate placements in high-risk domains like financial asset management, core software infrastructure, and clinical research. Our search desks are staffed by veteran recruitment managers who understand the nuances of talent acquisition and executive alignment.
            </p>
            
            {/* Mission / Vision columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2 border-l-2 border-gold pl-4">
                <h4 className="font-serif text-sm font-semibold text-dark">Our Mission</h4>
                <p className="text-[11px] text-dark-muted font-sans leading-relaxed">
                  {aboutCopy.mission}
                </p>
              </div>
              <div className="space-y-2 border-l-2 border-accent pl-4">
                <h4 className="font-serif text-sm font-semibold text-dark">Our Vision</h4>
                <p className="text-[11px] text-dark-muted font-sans leading-relaxed">
                  {aboutCopy.vision}
                </p>
              </div>
            </div>
          </div>

          <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-100 shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="Team Workshop"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Value Prop Columns */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm flex flex-col space-y-4">
            <div className="h-10 w-10 rounded bg-gold-light/40 flex items-center justify-center text-gold-dark shrink-0">
              <Shield size={20} />
            </div>
            <h3 className="font-serif text-base font-semibold text-dark">Corporate Security</h3>
            <p className="text-xs text-dark-muted font-sans leading-relaxed">
              We operate under NDA requirements, ensuring corporate search targets remain confidential, protecting your operations and strategic alignment.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm flex flex-col space-y-4">
            <div className="h-10 w-10 rounded bg-accent-light flex items-center justify-center text-accent shrink-0">
              <Compass size={20} />
            </div>
            <h3 className="font-serif text-base font-semibold text-dark">Global Reach</h3>
            <p className="text-xs text-dark-muted font-sans leading-relaxed">
              Our network covers major global hubs, including London, Frankfurt, Munich, New York, and Singapore, locating talent across geographic borders.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm flex flex-col space-y-4">
            <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center text-dark shrink-0">
              <Award size={20} />
            </div>
            <h3 className="font-serif text-base font-semibold text-dark">Technical Vetting</h3>
            <p className="text-xs text-dark-muted font-sans leading-relaxed">
              Our recruiters conduct preliminary assessments, referencing candidate design patterns, management styles, and technical competence.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold tracking-widest text-gold uppercase block">Desk Leadership</span>
            <h2 className="text-3xl font-serif text-dark font-semibold">Our Executive Partners</h2>
            <p className="text-sm text-dark-muted font-sans">
              {aboutCopy.teamText}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg border border-slate-150 overflow-hidden shadow-card card-hover-effect">
                <div className="aspect-[4/5] bg-slate-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h4 className="font-serif text-sm font-semibold text-dark">{member.name}</h4>
                  <p className="text-xs text-dark-muted font-sans mt-1">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
