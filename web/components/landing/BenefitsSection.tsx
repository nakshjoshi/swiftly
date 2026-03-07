export default function BenefitsSection() {
  const benefits = [
    {
      title: 'Apply to More Jobs',
      description: 'With less time spent on each application, you can apply to 10x more companies and increase your chances of landing your dream job.',
      stat: '10x',
      statLabel: 'more applications',
    },
    {
      title: 'Save Valuable Time',
      description: 'Stop wasting hours on repetitive data entry. Spend that time preparing for interviews or learning new skills instead.',
      stat: '20min',
      statLabel: 'saved per application',
    },
    {
      title: 'Stay Organized',
      description: 'Keep all your career information in one place. Update once and it reflects everywhere. No more outdated resumes.',
      stat: '100%',
      statLabel: 'organized',
    },
    {
      title: 'Reduce Friction',
      description: 'The biggest barrier to applying is the tedious form filling. Remove that barrier and apply with confidence.',
      stat: '0',
      statLabel: 'form fatigue',
    },
  ];

  return (
    <section id="benefits" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-mono font-medium border-2 border-red-200">
              {'<benefits />'}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why job seekers <span className="text-blue-600 font-mono">love</span> Swiftly
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built for students, fresh graduates, and anyone looking to streamline their job search process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg hover:border-blue-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 font-mono">
                  {benefit.title}
                </h3>
                <div className="text-right ml-4">
                  <div className="text-3xl font-bold text-blue-600 font-mono">
                    {benefit.stat}
                  </div>
                  <div className="text-sm text-gray-600">
                    {benefit.statLabel}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-lg">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="mt-16 bg-gray-900 rounded-2xl p-12 text-center border-2 border-blue-500 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-br-3xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-red-500/10 rounded-tl-3xl"></div>
          
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-xl text-white mb-4">
              "Swiftly cut my application time from <span className="text-red-400 font-mono">30 minutes</span> to just <span className="text-blue-400 font-mono">3 minutes</span>. 
              I applied to 50 companies in a week and landed 5 interviews!"
            </blockquote>
            <div className="font-semibold text-white">Sarah Chen</div>
            <div className="text-gray-400">Computer Science Graduate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
