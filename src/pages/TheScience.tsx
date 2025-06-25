import Header from "@/components/Header";

const TheScience = () => {
  return (
    <div className="min-h-screen bg-[#F8F8F5] p-8">
      <Header />
      <div className="max-w-[1905px] mx-auto">
        <h1 className="text-6xl font-normal text-[#1E1E1E] mb-8">
          The Science
        </h1>
        <p className="text-xl text-[#231F20] mb-16">
          A new era of wellbeing made by a team of neuroscientists and
          functional health doctors harnessing plant technology into powerful,
          delightful rituals.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-normal text-[#1E1E1E] mb-6">
              Neuroscience Meets Nature
            </h2>
            <p className="text-lg text-[#231F20] mb-8">
              Our research is backed by leading neuroscientists who understand
              the intricate workings of the mind and how functional mushrooms
              can enhance cognitive performance.
            </p>
            <div className="space-y-4">
              <div className="bg-white rounded-[20px] p-6">
                <h3 className="text-lg font-medium text-[#161616] mb-2">
                  Clinical Research
                </h3>
                <p className="text-sm text-[#B2AFAB]">
                  Peer-reviewed studies on cognitive enhancement
                </p>
              </div>
              <div className="bg-white rounded-[20px] p-6">
                <h3 className="text-lg font-medium text-[#161616] mb-2">
                  Expert Formulation
                </h3>
                <p className="text-sm text-[#B2AFAB]">
                  Developed by functional health doctors
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-[20px] overflow-hidden">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a760dbb1fd453f7e5e2af17f5fe0ba0eb31cb2e"
              alt="Neuroscience research"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheScience;
