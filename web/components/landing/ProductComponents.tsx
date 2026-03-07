export default function ProductComponents() {
  const products = [
    {
      title: 'Web Dashboard',
      description: 'Manage your profile, upload resumes, and track your job applications all in one place.',
      features: [
        'Upload & manage resumes',
        'Edit extracted data',
        'Application tracking',
        'Analytics dashboard',
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-blue-600',
      borderColor: 'border-blue-500',
      bgAccent: 'bg-blue-500/5',
    },
    {
      title: 'Backend API',
      description: 'Secure, fast API built with modern tech stack handling all data processing and storage.',
      features: [
        'Resume parsing',
        'Secure data storage',
        'RESTful endpoints',
        'Real-time sync',
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
      color: 'bg-red-600',
      borderColor: 'border-red-500',
      bgAccent: 'bg-red-500/5',
    },
    {
      title: 'Browser Extension',
      description: 'Chrome and Firefox extension that autofills job application forms with your stored data.',
      features: [
        'One-click autofill',
        'Works on major job sites',
        'Secure & private',
        'Offline support',
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      color: 'bg-green-600',
      borderColor: 'border-green-500',
      bgAccent: 'bg-green-500/5',
    },
  ];

  return (
    <section id="features" className="py-24 bg-gray-50 relative">
      {/* Code-like decorations */}
      <div className="absolute top-20 left-10 font-mono text-gray-300 text-xs opacity-30">
        {'const stack = ["web", "api", "extension"];'}
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-mono font-medium">
              {'<ecosystem />'}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            A complete <span className="text-blue-600 font-mono">ecosystem</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Swiftly combines a web application, powerful backend, and browser extension 
            to give you the <span className="font-mono bg-gray-900 text-white px-2 py-0.5 rounded">best</span> job application experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div 
              key={index}
              className={`bg-white rounded-2xl p-8 border-2 ${product.borderColor} shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${product.bgAccent} rounded-bl-3xl transition-all group-hover:w-32 group-hover:h-32`}></div>
              
              <div className={`${product.color} text-white w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg relative z-10`}>
                {product.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-mono relative z-10">
                {product.title}
              </h3>
              
              <p className="text-gray-600 mb-6 relative z-10">
                {product.description}
              </p>

              <ul className="space-y-3 relative z-10">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
