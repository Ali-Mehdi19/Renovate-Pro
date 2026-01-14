import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">RenovatePro</h3>
            <p className="mb-4">Streamlining renovation projects from survey to blueprint since 2023</p>
          </div>
          
          {['Product', 'Company', 'Resources', 'Legal'].map((category, index) => (
            <div key={index}>
              <h4 className="text-white font-medium mb-4">{category}</h4>
              <ul className="space-y-2">
                {['Features', 'Solutions', 'Pricing'].map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link href="#" className="hover:text-white transition">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          {/* <p>&copy; 2023 RenovatePro. All rights reserved.</p> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;