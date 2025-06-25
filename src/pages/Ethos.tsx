import Header from "@/components/Header";

const Ethos = () => {
  return (
    <div className="min-h-screen bg-[#F8F8F5] p-8">
                <Header />
      <div className="max-w-[1905px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-[20px] overflow-hidden">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f0bc87702f82d2d91ac7b2a3864f5948ad805ff7"
              alt="Our ethos"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl font-normal text-[#1E1E1E] mb-6">
              Mind-Body Connection
            </h2>
            <p className="text-lg text-[#231F20] mb-8">
              We believe in the profound connection between mental clarity and
              physical wellness. Our approach combines ancient wisdom with
              modern science.
            </p>
            <div className="space-y-6">
              <div className="bg-white rounded-[20px] p-6">
                <h3 className="text-lg font-medium text-[#161616] mb-2">
                  Sustainable Sourcing
                </h3>
                <p className="text-sm text-[#B2AFAB]">
                  Ethically sourced ingredients from trusted farms
                </p>
              </div>
              <div className="bg-white rounded-[20px] p-6">
                <h3 className="text-lg font-medium text-[#161616] mb-2">
                  Holistic Wellness
                </h3>
                <p className="text-sm text-[#B2AFAB]">
                  Supporting your entire well-being journey
                </p>
              </div>
              <div className="bg-white rounded-[20px] p-6">
                <h3 className="text-lg font-medium text-[#161616] mb-2">
                  Community Focus
                </h3>
                <p className="text-sm text-[#B2AFAB]">
                  Building a community of mindful wellness enthusiasts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ethos;
