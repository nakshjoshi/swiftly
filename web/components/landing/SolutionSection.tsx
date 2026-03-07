export default function SolutionSection() {
  const steps = [
    {
      number: '01',
      title: 'Upload Resume',
      description: 'Upload your resume once to Swiftly. We support PDF, DOCX, and other popular formats.',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-500',
    },
    {
      number: '02',
      title: 'Extract Data',
      description: 'Our AI extracts structured information: name, contact, education, experience, skills, and more.',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-500',
    },
    {
      number: '03',
      title: 'Store Profile',
      description: 'Your information is securely stored in your account, ready to use whenever you need it.',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-500',
    },
    {
      number: '04',
      title: 'Reuse Everywhere',
      description: 'Use our browser extension to autofill job applications with a single click.',
      bgColor: 'bg-gray-900',
      textColor: 'text-white',
      borderColor: 'border-gray-900',
    },
  ];

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Geometric background elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-green-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-mono font-medium border-2 border-blue-200">
              How it works
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            A <span className="text-blue-600">smarter</span> way to apply
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Swiftly simplifies the entire job application process. Upload once, apply everywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Arrow connector for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-24 -right-3 z-10">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
              
              <div className={`relative bg-white rounded-3xl p-6 border-2 ${step.borderColor} shadow-lg h-full hover:shadow-xl transition-all duration-200 overflow-hidden group`}>
                {/* Top corner decoration */}
                <div className={`absolute -top-6 -right-6 w-24 h-24 ${step.bgColor} opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`}></div>
                
                {/* Badge positioned at top with step number */}
                <div className="relative flex items-start gap-4 mb-4">
                  <div className={`${step.bgColor} ${step.textColor} px-4 py-2 rounded-xl font-bold font-mono text-lg border ${step.borderColor} shrink-0`}>
                    {step.number}
                  </div>
                  <div className={`h-1 w-12 ${step.borderColor} border-t-2 mt-4 hidden sm:block`}></div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {step.description}
                </p>
                
                {/* Bottom corner accent */}
                <div className={`absolute -bottom-2 -left-2 w-16 h-16 border-2 ${step.borderColor} opacity-10 rounded-full`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
