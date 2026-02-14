import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Check } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-black text-slate-600 dark:text-slate-400">
      {/* ===== TOP SECTION ===== */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        {/* BRAND */}
        <div className="space-y-3">
          <Link
            to="/"
            className="
    inline-block text-3xl font-extrabold tracking-tight
    bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500
    bg-clip-text text-transparent

    hover:from-pink-500 hover:via-purple-500 hover:to-indigo-600
    hover:tracking-wide

    transition-all duration-300 ease-out
  "
          >
            LamhaStore
          </Link>

          <p className="text-sm">A premium watch e-commerce platform.</p>

          <p className="text-sm">
            Designed & Developed by{" "}
            <span className="font-medium text-black dark:text-white">
              Abdul Rahman Khan
            </span>
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-black dark:text-white">
            Quick Links
          </h4>

          <nav className="flex flex-col gap-2 text-sm">
            {[
              { name: "Home", to: "/" },
              { name: "Cart", to: "/cart" },
              { name: "Profile", to: "/profile" },
              { name: "Contact", to: "/contact" },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="w-fit
                           hover:text-indigo-600 dark:hover:text-indigo-400
                           hover:translate-x-1
                           transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* LEGAL */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-black dark:text-white">
            Legal
          </h4>

          <nav className="flex flex-col gap-2 text-sm">
            {[
              { name: "Terms & Conditions", to: "/terms" },
              { name: "Privacy Policy", to: "/privacy" },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="w-fit
                           hover:text-indigo-600 dark:hover:text-indigo-400
                           hover:translate-x-1
                           transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* WHY LAMHASTORE */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-black dark:text-white">
            Why LamhaStore?
          </h4>

          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check size={14} className="text-emerald-500" />
              100% Original Products
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-emerald-500" />
              Secure Payments
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-emerald-500" />
              Fast Delivery
            </li>
          </ul>

          {/* SOCIAL MEDIA */}
          <div className="flex gap-4 pt-3">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-blue-600 dark:hover:text-blue-400
                         hover:-translate-y-1
                         transition-all duration-200"
            >
              <Facebook size={18} />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-pink-500
                         hover:-translate-y-1
                         transition-all duration-200"
            >
              <Instagram size={18} />
            </a>

            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-sky-500
                         hover:-translate-y-1
                         transition-all duration-200"
            >
              <Twitter size={18} />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-blue-700 dark:hover:text-blue-400
                         hover:-translate-y-1
                         transition-all duration-200"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="border-t border-slate-200 dark:border-slate-800 text-center py-4 text-xs text-slate-500">
        © {new Date().getFullYear()} LamhaStore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
