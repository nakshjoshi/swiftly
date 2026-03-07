export default function ProblemSection() {
  const problems = [
    {
      title: 'Repetitive Typing',
      description: 'Every job application asks for the same information. Name, email, phone, education, experience...',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      title: 'Copy-Paste Hell',
      description: 'Switching between your resume PDF and application forms, copying and pasting line by line.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Wasted Time',
      description: 'Spending 20+ minutes on each application when you could be applying to more companies.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Form Fatigue',
      description: 'After the 10th application, you start making mistakes and missing fields.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 bg-white relative">
      {/* Geometric background */}
      <div className="absolute top-20 right-20 w-24 h-24 border-4 border-red-500/10 rotate-45"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-red-500/5 rounded-2xl"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-mono font-medium border-2 border-red-200">
              // THE PROBLEM
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Job applications are <span className="text-red-600 font-mono">frustrating</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every job portal requires manual form filling, even after you upload your resume. 
            It's tedious, time-consuming, and downright <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono">annoying</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 shadow-lg hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 group-hover:bg-red-500/10 transition-colors"></div>
              <div className="text-red-600 mb-4 relative z-10">
                {problem.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-mono relative z-10">
                {problem.title}
              </h3>
              <p className="text-gray-600 relative z-10">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
