import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear(); //automatically updates the copyright year

  return (
    <footer className="bg-background border-t border-border mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* brand column : 2 columns  */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <Image
                src="/6.png"
                alt="app_logo_strive"
                width={100}
                height={80}
              />
            </Link>
            <p className="text-xs text-foreground/60 leading-relaxed max-w-xs">
            Making the internet more accessible by helping great content find its audience through simple, human-centric SEO.
            </p>
          </div>
          {/* Product column  */}
          <div>
            <h3 className="text-xs font-extrabold text-foreground  mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/features"
                  className="text-xs text-foreground/60 hover:text-primary transition-colors"
                >
                  Features
                </Link>
              </li>
            
              <li>
                <Link
                  href="/roadmap"
                  className="text-xs text-foreground/60 hover:text-primary transition-colors"
                >
                Roadmap
                </Link>
              </li>
            </ul>
          </div>
          {/* Company column  */}
          <div>
            <h3 className="text-xs font-extrabold text-foreground  mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-xs text-foreground/60 hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
             
              <li>
                <Link
                  href="/contact"
                  className="text-xs text-foreground/60 hover:text-primary transition-colors"
                >
                Contact
                </Link>
              </li>
            </ul>
          </div>
          {/* legal column  */}
          <div>
            <h3 className="text-xs font-extrabold text-foreground  mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-xs text-foreground/60 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-xs text-foreground/60 hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom bar : copyright */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-foreground/50">
            &copy; {currentYear} STRIVE. All rights reserved
          </p>
          {/* optional : social icons space*/}
          <div className="flex space-x-4 mt-4 md:mt-0 text-foreground/50">
            <span className="hover:text-foreground cursor-pointer text-sm transition-colors">
              Twitter
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
