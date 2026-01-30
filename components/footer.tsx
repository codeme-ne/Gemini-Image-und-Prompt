import Link from "next/link";
import MakerFooter from "./maker-footer";

export default function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" aria-label="Site Footer">
      <div className="mx-auto max-w-6xl w-full px-4 py-8">
  <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-center sm:text-left">
          {/* Product Section */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Product
            </h3>
            <nav aria-label="Product navigation">
              <ul className="space-y-2 flex flex-col items-center sm:items-start">
                <li>
                  <Link 
                    href="/" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    URL to Image Generator
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/gallery" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/pricing" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Resources Section */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Resources
            </h3>
            <nav aria-label="Resources navigation">
              <ul className="space-y-2 flex flex-col items-center sm:items-start">
                <li>
                  <Link 
                    href="/use-cases" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Use cases
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Company Section */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Company
            </h3>
            <nav aria-label="Company navigation">
              <ul className="space-y-2 flex flex-col items-center sm:items-start">
                <li>
                  <Link 
                    href="/about" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <a 
                    href="mailto:lukas@zangerlcoachingdynamics.com" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Legal Section */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Legal
            </h3>
            <nav aria-label="Legal navigation">
              <ul className="space-y-2 flex flex-col items-center sm:items-start">
                <li>
                  <Link 
                    href="/impressum" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Imprint
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/datenschutz" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/agb" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} URL → Image. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ in Mönchengladbach
            </p>
          </div>
        </div>

        {/* Maker Footer - Cross-links to other projects */}
        <MakerFooter />
      </div>
    </footer>
  );
}