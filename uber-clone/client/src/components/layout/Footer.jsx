import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Press', href: '#' }
    ],
    product: [
      { name: 'How it Works', href: '#' },
      { name: 'Features', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'FAQ', href: '#' }
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' }
    ],
    social: [
      { name: 'Facebook', href: '#', icon: 'fab fa-facebook' },
      { name: 'Twitter', href: '#', icon: 'fab fa-twitter' },
      { name: 'Instagram', href: '#', icon: 'fab fa-instagram' },
      { name: 'LinkedIn', href: '#', icon: 'fab fa-linkedin' }
    ]
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="text-2xl font-bold text-uber-black">
              UBER
            </Link>
            <p className="mt-4 text-gray-600">
              Book rides at your convenience with our reliable transportation service.
            </p>
            <div className="mt-6 flex space-x-4">
              {footerLinks.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={`${item.icon} text-xl`}></i>
                  <span className="sr-only">{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} Uber Clone. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        {/* App Store Badges */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <i className="fab fa-apple text-xl mr-2"></i>
            Download on the App Store
          </a>
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <i className="fab fa-google-play text-xl mr-2"></i>
            Get it on Google Play
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;