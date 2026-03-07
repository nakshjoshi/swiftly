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
      </div>
    </section>
  );
}
