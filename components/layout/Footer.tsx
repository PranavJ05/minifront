"use client";

import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  X,
  BookOpen,
  Users,
  Calendar,
  Shield,
  ArrowRight,
} from "lucide-react";
import { FaLinkedin, FaFacebook, FaYoutube } from "react-icons/fa";
import Logo from "@/components/layout/Logo";
import { Badge } from "@/components/ui/badge";

export default function Footer() {
  const router = useRouter();

  const socialLinks = [
    {
      Icon: FaLinkedin,
      href: "https://www.linkedin.com/school/model-engineering-college/posts/?feedView=all",
      label: "LinkedIn",
    },
    {
      Icon: FaFacebook,
      href: "https://www.facebook.com/modelengineeringcollege",
      label: "Facebook",
    },
    {
      Icon: FaYoutube,
      href: "https://www.youtube.com/@ModelEngineeringCollege",
      label: "YouTube",
    },
  ];

  const quickLinks = [
    { label: "Alumni Directory", path: "/network/alumni", icon: Users },
    {
      label: "Mentorship Guidance",
      path: "/alumni-mentorship",
      icon: BookOpen,
    },
    { label: "Events & Campus News", path: "/events", icon: Calendar },
  ];

  const departments = [
    { code: "CSE", name: "Computer Science & Engg" },
    { code: "ECE", name: "Electronics & Comm" },
    { code: "EEE", name: "Electrical & Electronics" },
    { code: "ME", name: "Mechanical Engineering" },
    { code: "BME", name: "Biomedical Engineering" },
  ];

  return (
    <footer className="relative bg-background text-foreground border-t border-border mt-auto overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* SVG Background Mesh Pattern */}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_100%,#000_70%,transparent_100%)] opacity-20"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-border">
          {/* Brand Card Block (5 cols) */}
          <div className="md:col-span-5 bg-card/60 border border-border rounded-2xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Logo href="/" size="md" />
                <Badge variant="outline" className="text-[10px] font-semibold">
                  Alumni Cell
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                The official network portal for Model Engineering College,
                Thrikkakkara. Dedicated to connecting students, alumni, and
                faculty for lifelong mentorship and community growth.
              </p>
            </div>

            <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-foreground" /> Maintained by
                Alumni Relations Cell
              </span>

              {/* Social Links */}
              <div className="flex items-center gap-1.5">
                {socialLinks.map(({ Icon, href, label }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all cursor-pointer"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Platform Links Card (3 cols) */}
          <div className="md:col-span-3 bg-card/40 border border-border rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
                Platform Navigation
              </h3>

              <ul className="space-y-2.5 text-xs pt-1">
                {quickLinks.map((item, i) => (
                  <li key={i}>
                    <button
                      onClick={() => router.push(item.path)}
                      className="w-full flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors text-left cursor-pointer font-medium p-1.5 rounded-lg hover:bg-muted/40"
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="h-3.5 w-3.5 text-foreground" />
                        <span>{item.label}</span>
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground/60" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-border/50 text-[11px] text-muted-foreground">
              <span>Verified Roll No Authentication</span>
            </div>
          </div>

          {/* Contact & Address Card (4 cols) */}
          <div className="md:col-span-4 bg-card/40 border border-border rounded-2xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
                College & Contact
              </h3>

              <div className="space-y-3 text-xs text-muted-foreground pt-1">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-foreground font-semibold">
                      Model Engineering College
                    </p>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Office of Alumni Relations, Thrikkakkara
                      <br />
                      Kochi, Kerala 682021
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1 border-t border-border/40">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <a
                    href="tel:04842577379"
                    className="hover:text-foreground transition-colors text-[11px]"
                  >
                    0484 257 7379
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <a
                    href="mailto:mecalumni@gmail.com"
                    className="hover:text-foreground transition-colors text-[11px]"
                  >
                    mecalumni@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Department Chips */}
            <div className="pt-2 border-t border-border/50">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Departments:
              </p>
              <div className="flex flex-wrap gap-1">
                {departments.map((d) => (
                  <span
                    key={d.code}
                    className="text-[9px] font-semibold bg-background text-muted-foreground border border-border px-1.5 py-0.5 rounded"
                  >
                    {d.code}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-foreground" />
            <span>
              © {new Date().getFullYear()}Alumni Relations Cell, Model
              Engineering College.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <span className="h-1 w-1 rounded-full bg-border" />
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <span className="h-1 w-1 rounded-full bg-border" />
            <a href="#" className="hover:text-foreground transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
