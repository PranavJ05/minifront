"use client";

import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  X,
} from "lucide-react";
import { FaLinkedin, FaFacebook, FaYoutube } from "react-icons/fa";

import Logo from "@/components/layout/Logo";

export default function Footer() {
  const router = useRouter();

  const socialLinks = [
    {
      Icon: FaLinkedin,
      href: "https://www.linkedin.com/school/model-engineering-college/posts/?feedView=all",
    },
    { Icon: X, href: "https://x.com/MECKochi" },
    {
      Icon: FaFacebook,
      href: "https://www.facebook.com/modelengineeringcollege",
    },
    { Icon: FaYoutube, href: "https://www.youtube.com/@ModelEngineeringCollege" },
  ];

  const quickLinks = [
    { label: "Alumni Directory", path: "/alumni" },
    { label: "Events & News", path: "/events" },
    { label: "Opportunities", path: "/opportunities" },
  ];

  return (
    <footer className="bg-card text-card-foreground border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Logo href="/" size="md" />

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              The official platform for university alumni to network, mentor,
              and explore career opportunities. Connecting students with alumni
              across generations.
            </p>

            {/* Social */}
            <div className="flex gap-2 pt-1">
              {socialLinks.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-muted border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">
              Quick Links
            </h3>

            <ul className="space-y-2 text-xs">
              {quickLinks.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => router.push(item.path)}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">
              Contact
            </h3>

            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0 mt-0.5" />
                <div>
                  <p className="text-foreground font-medium">
                    Office of Alumni Relations
                  </p>
                  <p className="text-muted-foreground">
                    Model Engineering College
                    <br />
                    Thrikkakkara, Kochi, Kerala 682021
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                <a
                  href="tel:04842577379"
                  className="hover:text-foreground transition-colors"
                >
                  0484 257 7379
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                <a
                  href="mailto:mecalumni@gmail.com"
                  className="hover:text-foreground transition-colors"
                >
                  mecalumni@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Alumni Network. All rights reserved.
          </p>

          <div className="flex gap-4 text-xs text-muted-foreground">
            {["Privacy Policy", "Terms of Service", "Security"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-foreground transition-colors"
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
