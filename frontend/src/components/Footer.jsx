import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Send,
  Check
} from 'lucide-react';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { settings, content } = useSettings();

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email) return;

    try {
      setLoading(true);
      setError('');

      await axios.post(
        'http://localhost:5000/api/contact/subscribe',
        { email }
      );

      setSubscribed(true);
      setEmail('');
    } catch (err) {
      setError(
        err.response?.data?.error || 'Subscription failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (name) => {
    switch (name?.toLowerCase()) {
      case 'linkedin':
        return <Linkedin size={18} />;

      case 'facebook':
        return <Facebook size={18} />;

      case 'twitter':
        return <Twitter size={18} />;

      case 'instagram':
        return <Instagram size={18} />;

      default:
        return null;
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white pt-16 pb-8 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1: Brand Info */}
          <div className="flex flex-col space-y-6">
            <span className="font-serif text-2xl font-bold tracking-tight">
              Infura
              <span className="text-gold font-sans font-medium text-xs ml-1 tracking-widest">
                SOLUTIONS
              </span>
            </span>

            <p className="text-sm text-dark-muted leading-relaxed font-sans max-w-sm">
              Elite recruitment firm linking premium executive
              talent with world-class enterprises. Built on trust,
              elegance, and integrity.
            </p>

            {/* Social Links */}
            {settings?.socialLinks && (
              <div className="flex space-x-4">
                {Object.entries(settings.socialLinks).map(
                  ([platform, url]) => {
                    if (!url) return null;

                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center text-dark-muted hover:text-gold hover:bg-white/10 transition-all duration-300"
                        title={platform}
                      >
                        {getSocialIcon(platform)}
                      </a>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="font-serif text-base font-semibold tracking-wider uppercase text-gold mb-6">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-dark-muted font-sans">
              <li>
                <Link
                  to="/"
                  className="hover:text-gold transition-colors"
                >
                  Home Page
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="hover:text-gold transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/jobs"
                  className="hover:text-gold transition-colors"
                >
                  Career Opportunities
                </Link>
              </li>

              <li>
                <Link
                  to="/careers"
                  className="hover:text-gold transition-colors"
                >
                  Work With Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-gold transition-colors"
                >
                  Get In Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="font-serif text-base font-semibold tracking-wider uppercase text-gold mb-6">
              Contact Us
            </h3>

            <ul className="space-y-4 text-sm text-dark-muted font-sans">
              {settings?.address && (
                <li className="flex items-start space-x-3">
                  <MapPin
                    size={18}
                    className="text-gold shrink-0 mt-0.5"
                  />
                  <span>{settings.address}</span>
                </li>
              )}

              {settings?.phone && (
                <li className="flex items-center space-x-3">
                  <Phone
                    size={18}
                    className="text-gold shrink-0"
                  />
                  <span>{settings.phone}</span>
                </li>
              )}

              {settings?.email && (
                <li className="flex items-center space-x-3">
                  <Mail
                    size={18}
                    className="text-gold shrink-0"
                  />

                  <a
                    href={`mailto:${settings.email}`}
                    className="hover:text-gold transition-colors"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="font-serif text-base font-semibold tracking-wider uppercase text-gold mb-6">
              Newsletter
            </h3>

            <p className="text-sm text-dark-muted leading-relaxed font-sans mb-4">
              Subscribe to receive curated executive insights,
              market reports, and global job openings.
            </p>

            {subscribed ? (
              <div className="flex items-center space-x-2 text-gold font-medium text-sm bg-white/5 p-3 rounded border border-gold/20">
                <Check size={16} />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="space-y-2"
              >
                <div className="flex bg-white/5 rounded border border-white/10 focus-within:border-gold transition-colors">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    className="bg-transparent text-sm text-white px-3 py-2 w-full outline-none placeholder:text-slate-500"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-3 text-gold hover:text-white transition-colors"
                  >
                    <Send
                      size={16}
                      className={
                        loading ? 'animate-pulse' : ''
                      }
                    />
                  </button>
                </div>

                {error && (
                  <p className="text-xs text-red-400 font-sans">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-dark-muted font-sans">
          <div>
            {content?.footer_content?.copyright ||
              `© ${currentYear} Infura Solutions. All rights reserved.`}
          </div>

          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="hover:text-gold transition-colors"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="hover:text-gold transition-colors"
            >
              Terms of Business
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;