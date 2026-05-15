const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          About Our Food Platform
        </h1>

        <p className="text-gray-500 max-w-2xl mx-auto">
          We connect food lovers with talented chefs to deliver
          fresh, delicious, and homemade meals directly to your door.
        </p>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        
        {/* Image */}
        <div>
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            alt="Food"
            className="rounded-3xl shadow-lg w-full h-[400px] object-cover"
          />
        </div>

        {/* Text */}
        <div>
          <h2 className="text-3xl font-bold mb-4">
            Why Choose Us?
          </h2>

          <p className="text-gray-600 mb-5">
            Our platform helps customers discover amazing meals
            prepared by skilled local chefs. From traditional dishes
            to modern cuisine, we bring quality food to your table.
          </p>

          <div className="space-y-3">
            <div className="bg-base-200 p-4 rounded-xl">
              🍽️ Fresh & Hygienic Meals
            </div>

            <div className="bg-base-200 p-4 rounded-xl">
              🚚 Fast Delivery Service
            </div>

            <div className="bg-base-200 p-4 rounded-xl">
              👨‍🍳 Experienced Home Chefs
            </div>

            <div className="bg-base-200 p-4 rounded-xl">
              ⭐ Top Rated Food Experience
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;