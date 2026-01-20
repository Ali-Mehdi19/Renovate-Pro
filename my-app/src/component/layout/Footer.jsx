import {
  Ruler,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center mb-4">
            <Ruler className="w-8 h-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold">RenovatePro</span>
          </div>
          <p className="text-gray-400">
            Professional room measurement and blueprint services.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/">Home</a></li>
            <li><a href="/bookingsurvey">Book Survey</a></li>
            <li><a href="/login">Login</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-gray-400">
            <li className="flex gap-2"><Phone /> +91 98765 xxxxx</li>
            <li className="flex gap-2"><Mail /> info@renovatepro.com</li>
            <li className="flex gap-2"><MapPin /> Mumbai</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-4 text-gray-400">
            <Facebook />
            <Twitter />
            <Instagram />
            <Linkedin />
          </div>
        </div>
      </div>
    </footer>
  );
}
