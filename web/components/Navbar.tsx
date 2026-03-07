import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b-2 border-gray-900/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo with dev theme */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-9 h-9 bg-black group-hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md group-hover:shadow-blue-500/50">
                <span className="text-white font-bold text-lg font-mono">S</span>
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold font-mono text-gray-900 group-hover:text-blue-600 transition-colors">Swiftly</span>
              {/* <span className="text-xl font-bold text-gray-900">ly</span> */}
              <span className="text-xs font-mono text-gray-400 ml-1">.nakshjoshi.in</span>
            </div>
          </Link>

          {/* Navigation links with code style */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="#how-it-works" className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-mono text-sm relative group">
              <span className="relative z-10">howItWorks()</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="#features" className="px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-mono text-sm relative group">
              <span className="relative z-10">features()</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="#benefits" className="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-mono text-sm relative group">
              <span className="relative z-10">benefits()</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </div>

          {/* Action buttons with dev style */}
          <div className="flex items-center gap-3">
            <Link 
              href="/signin" 
              className="hidden sm:inline-flex px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-mono text-sm border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50"
            >
              <span className="mr-1 text-blue-600">{'<'}</span>
              signIn
              <span className="ml-1 text-blue-600">{'/>'}</span>
            </Link>
            <Link 
              href="/signup" 
              className="px-5 py-2 bg-black text-white rounded-lg hover:bg-blue-600 transition-all font-mono text-sm shadow-md hover:shadow-blue-500/50 border-2 border-black hover:border-blue-600 group"
            >
              <span className="flex items-center gap-2">
                <span className="text-green-400">$</span>
                <span>start</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Code-like decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent"></div>
    </nav>
  );
}
