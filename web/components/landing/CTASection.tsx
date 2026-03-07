import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24 bg-linear-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Geometric background elements */}
      <div className="absolute top-10 right-20 w-32 h-32 border-4 border-blue-500/20 rotate-45"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-red-500/10 rounded-2xl rotate-12"></div>
      <div className="absolute top-1/2 left-10 w-2 h-2 bg-blue-500 rounded-full"></div>
      <div className="absolute top-1/3 right-10 w-3 h-3 bg-red-500 rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-mono font-medium border-2 border-white/20">
              {'<ready_to_start />'}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Stop <span className="text-red-400 font-mono">retyping</span> your resume for every <span className="text-blue-400 font-mono">application</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of job seekers who are applying faster and landing more interviews with Swiftly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/signup" 
              className="px-8 py-4 bg-white text-gray-900 text-lg font-medium rounded-full hover:bg-blue-50 transition-colors text-center shadow-xl group"
            >
              <span className="flex items-center justify-center gap-2">
                Create Account
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link 
              href="#how-it-works" 
              className="px-8 py-4 bg-transparent text-white text-lg font-medium rounded-full border-2 border-white hover:bg-white hover:text-gray-900 transition-colors text-center"
            >
              Learn More
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-300">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-mono">Easy to use</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-mono">Secure storage</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-mono">Save time</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
