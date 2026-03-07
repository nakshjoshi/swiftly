export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: 'Create Account',
      description: 'Sign up for free in seconds. No credit card required.',
      color: 'blue',
      codeSnippet: `// Quick signup
const user = await signup({
  email: "you@example.com",
  provider: "google"
});

console.log("✓ Account created!");`,
      features: [
        'Email & password',
        'Social login (Google)',
        'Instant access',
      ],
    },
    {
      step: 2,
      title: 'Upload Resume',
      description: 'Drag and drop your resume. AI extracts structured data automatically.',
      color: 'green',
      codeSnippet: `// AI-powered extraction
const data = await parseResume({
  file: "resume.pdf",
  extract: ["contact", "experience", 
            "education", "skills"]
});

// ✓ Data ready to use`,
      features: [
        'PDF & DOCX support',
        'AI extraction engine',
        'Review & edit data',
      ],
    },
    {
      step: 3,
      title: 'Install Extension',
      description: 'Add browser extension for seamless autofill across job sites.',
      color: 'red',
      codeSnippet: `// Browser extension API
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.action === "autofill") {
      fillFormFields(userData);
      sendResponse({status: "✓"});
    }
  }
);`,
      features: [
        'Chrome & Firefox',
        'One-click autofill',
        'Works everywhere',
      ],
    },
    {
      step: 4,
      title: 'Apply Faster',
      description: 'Visit application pages and autofill forms instantly with stored data.',
      color: 'purple',
      codeSnippet: `$ swiftly apply --company "TechCorp"

✓ Form detected
✓ Contact info filled
✓ Experience added
✓ Skills populated

Application submitted in 30s!`,
      features: [
        'Save 20+ min/application',
        'Update data anytime',
        'Track applications',
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500',
        border: 'border-blue-500',
        text: 'text-blue-600',
        bgLight: 'bg-blue-50',
        borderLight: 'border-blue-200',
      },
      green: {
        bg: 'bg-green-500',
        border: 'border-green-500',
        text: 'text-green-600',
        bgLight: 'bg-green-50',
        borderLight: 'border-green-200',
      },
      red: {
        bg: 'bg-red-500',
        border: 'border-red-500',
        text: 'text-red-600',
        bgLight: 'bg-red-50',
        borderLight: 'border-red-200',
      },
      purple: {
        bg: 'bg-purple-500',
        border: 'border-purple-500',
        text: 'text-purple-600',
        bgLight: 'bg-purple-50',
        borderLight: 'border-purple-200',
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="how-it-works" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Code-like background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-20 font-mono text-blue-500/10 text-4xl rotate-12">{'{ }'}</div>
      <div className="absolute bottom-20 left-20 font-mono text-green-500/10 text-4xl -rotate-12">{'[ ]'}</div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-mono font-medium border-2 border-green-200">
              // HOW IT WORKS
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Four <span className="text-green-600 font-mono">simple</span> steps to apply faster
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload once, apply everywhere. <span className="font-mono bg-green-100 text-green-700 px-2 py-0.5 rounded">Revolutionize</span> your job application process.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {steps.map((item, index) => {
            const colors = getColorClasses(item.color);
            return (
              <div 
                key={index}
                className="group relative"
              >
                {/* Card */}
                <div className={`bg-white rounded-2xl p-8 border-2 ${colors.border} shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden`}>
                  {/* Decorative corner */}
                  <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bgLight} rounded-bl-3xl opacity-50`}></div>
                  
                  {/* Step number badge */}
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className={`w-14 h-14 ${colors.bg} text-white rounded-xl flex items-center justify-center text-2xl font-bold font-mono shadow-lg`}>
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 font-mono">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono">Step {item.step}/4</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 relative z-10">
                    {item.description}
                  </p>

                  {/* Code snippet terminal */}
                  <div className="bg-gray-900 rounded-xl p-4 mb-6 border-2 border-gray-800 relative overflow-hidden group-hover:border-gray-700 transition-colors">
                    {/* Terminal header */}
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-500 ml-2 font-mono">terminal</span>
                    </div>
                    {/* Code */}
                    <pre className="text-xs font-mono text-gray-300 leading-relaxed overflow-x-auto">
                      <code>{item.codeSnippet}</code>
                    </pre>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-2 relative z-10">
                    {item.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className={`w-5 h-5 ${colors.bg} rounded flex items-center justify-center shrink-0`}>
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700 text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Connecting line (for desktop) */}
                {index < steps.length - 1 && index % 2 === 0 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 z-0">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
