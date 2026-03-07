import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 relative overflow-hidden">
      {/* Geometric background */}
      <div className="absolute top-10 right-20 w-16 h-16 border-2 border-blue-500/10 rotate-45"></div>
      <div className="absolute bottom-10 left-20 w-20 h-20 bg-red-500/5 rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4 group">
              <div className="w-8 h-8 bg-white group-hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-gray-900 group-hover:text-white font-bold text-lg font-mono">S</span>
              </div>
              <span className="text-xl font-bold text-white"><span className="font-mono">Swift</span>ly</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Apply to jobs faster. Upload your resume once and reuse your information everywhere.
            </p>
            <div className="mt-4 flex gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 font-mono">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#extension" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Browser Extension
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 font-mono">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#blog" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 font-mono">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#privacy" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#terms" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm text-center font-mono">
            © {new Date().getFullYear()} Swiftly. <span className="text-blue-500">Built</span> with <span className="text-red-500">❤</span> and <span className="text-green-500">code</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
