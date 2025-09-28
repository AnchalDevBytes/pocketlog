import Link from "next/link";
import { Wallet, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Wallet className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">PocketLog</span>
            </Link>
            <p className="text-slate-300 mb-4 max-w-md">
              Take control of your finances with our intelligent expense
              tracking platform. Track, analyze, and optimize your spending
              habits.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/AnchalDevBytes"
                target="_blank"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/AnchalTwt"
                target="_blank"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:anchal.js.dev@gmail.com"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © {new Date().getFullYear()} PocketLog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
