// components/layout/Footer.tsx
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Facebook,
  Youtube,
  X
} from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { Icon: Linkedin, href: "https://www.linkedin.com/school/model-engineering-college/posts/?feedView=all" },
    { Icon: X, href: "https://x.com/MECKochi" },
    { Icon: Facebook, href: "https://www.facebook.com/modelengineeringcollege" },
    { Icon: Youtube, href: "https://www.youtube.com/@ModelEngineeringCollege" }
  ];

  return (
    <footer className="bg-navy-950 text-gray-300 border-t border-navy-900">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* BRAND */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="bg-gold-500 p-2.5 rounded-lg">
                <GraduationCap className="h-5 w-5 text-navy-950" />
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                Alumni
              </h2>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              The official platform for university alumni to network, mentor, and explore career opportunities. 
              Connecting students with alumni across generations.
            </p>

            {/* SOCIAL */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-navy-900 border border-navy-800 hover:border-gold-500 hover:bg-navy-800 transition"
                >
                  <Icon className="h-4 w-4 hover:text-gold-400 transition" />
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="space-y-5">
            <h3 className="text-white font-semibold text-base border-b border-gold-500/40 pb-1 inline-block">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              {[
                "Alumni Directory",
                "Events & News",
                "Opportunities"
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gold-400 transition"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="space-y-5">
            <h3 className="text-white font-semibold text-base border-b border-gold-500/40 pb-1 inline-block">
              Contact
            </h3>

            <div className="space-y-4 text-sm">

              {/* ADDRESS */}
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gold-500 mt-1" />
                <div>
                  <p className="text-white font-medium">
                    Office of Alumni Relations
                  </p>
                  <p className="text-gray-400">
                    Model Engineering College<br />
                    Thrikkakkara, Kochi, Kerala 682021
                  </p>
                </div>
              </div>

              {/* PHONE */}
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gold-500" />
                <a
                  href="tel:04842577379"
                  className="text-gray-400 hover:text-gold-400 transition"
                >
                  0484 257 7379
                </a>
              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gold-500" />
                <a
                  href="mailto:mecalumni@gmail.com"
                  className="text-gray-400 hover:text-gold-400 transition"
                >
                  mecalumni@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-12 pt-6 border-t border-navy-900 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-xs text-gray-500 text-center md:text-left">
            © 2026 MECCONNECT. All rights reserved.  
            <span className="block md:inline md:ml-2">
              Access restricted to verified members.
            </span>
          </p>

          <div className="flex gap-6 text-xs uppercase tracking-wide">
            {["Privacy", "Terms", "Security"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-500 hover:text-gold-400 transition"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}