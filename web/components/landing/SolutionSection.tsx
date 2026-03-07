export default function SolutionSection() {
  const steps = [
    {
      number: '01',
      title: 'Upload Resume',
      description: 'Upload your resume once to Swiftly. We support PDF, DOCX, and other popular formats.',
      color: 'bg-blue-600',
      borderColor: 'border-blue-500',
    },
    {
      number: '02',
      title: 'Extract Data',
      description: 'Our AI extracts structured information: name, contact, education, experience, skills, and more.',
      color: 'bg-green-600',
      borderColor: 'border-green-500',
    },
    {
      number: '03',
      title: 'Store Profile',
      description: 'Your information is securely stored in your account, ready to use whenever you need it.',
      color: 'bg-red-600',
      borderColor: 'border-red-500',
    },
    {
      number: '04',
      title: 'Reuse Everywhere',
      description: 'Use our browser extension to autofill job applications with a single click.',
      color: 'bg-gray-900',
      borderColor: 'border-gray-900',
    },
  ];

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Code-like background pattern */}
      <div className="absolute top-10 left-10 font-mono text-blue-500/10 text-xs">
        {'<solution />'}
      </div>
      <div className="absolute bottom-10 right-10 font-mono text-red-500/10 text-xs">
        {'{ autoFill: true }'}
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-mono font-medium border-2 border-blue-200">
              // THE SOLUTION
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            A <span className="text-blue-600 font-mono">smarter</span> way to apply
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Swiftly simplifies the entire job application process. <span className="font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Upload once, apply everywhere.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-linear-to-r from-gray-900 to-transparent -z-10" />
              )}
              
              <div className={`bg-white rounded-2xl p-8 border-2 ${step.borderColor} shadow-lg h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
                <div className={`${step.color} text-white w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold mb-6 font-mono shadow-lg`}>
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-mono">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
