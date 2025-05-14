import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <h1 className="briki-logo">
              briki
              <span className="checkmark">✓</span>
            </h1>
            <p className="text-gray-500 text-base">
              Briki — Your Gateway to Better Insurance: Travel, Auto, Pet, and Health.
              Compare plans, find the perfect coverage, and protect what matters most.
            </p>
            <div className="flex space-x-6">
              <a href="https://www.instagram.com/briki_app?igsh=MW1mcmExM3UxcThrag==&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>

              <a href="https://www.linkedin.com/company/brikiapp" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Insurance</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/insurance-plans" className="text-base text-gray-500 hover:text-gray-900">
                      Travel Insurance Plans
                    </Link>
                  </li>
                  <li>
                    <Link href="/auto-insurance" className="text-base text-gray-500 hover:text-gray-900">
                      Auto Insurance Plans
                    </Link>
                  </li>
                  <li>
                    <Link href="/pet-insurance" className="text-base text-gray-500 hover:text-gray-900">
                      Pet Insurance Plans
                    </Link>
                  </li>
                  <li>
                    <Link href="/health-insurance" className="text-base text-gray-500 hover:text-gray-900">
                      Health Insurance Plans
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/" className="text-base text-gray-500 hover:text-gray-900">
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-base text-gray-500 hover:text-gray-900">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-base text-gray-500 hover:text-gray-900">
                      Help Center
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/learn-more" className="text-base text-gray-500 hover:text-gray-900">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-base text-gray-500 hover:text-gray-900">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-base text-gray-500 hover:text-gray-900">
                      Jobs
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-base text-gray-500 hover:text-gray-900">
                      Partners
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/" className="text-base text-gray-500 hover:text-gray-900">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-base text-gray-500 hover:text-gray-900">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-base text-gray-500 hover:text-gray-900">
                      Cookies
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="max-w-md mx-auto mb-8">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase text-center mb-4">
              Find Your Perfect Insurance
            </h3>
            <div className="flex">
              <input
                type="search"
                placeholder="Search for insurance plans, categories, or providers..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-r-md transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Briki, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
