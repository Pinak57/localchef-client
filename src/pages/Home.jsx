import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import MealCard from "../components/MealCard";
import { FiStar, FiArrowRight, FiShield, FiClock, FiHeart, FiTruck, FiCheck } from "react-icons/fi";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Home = () => {
  const [meals, setMeals]     = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Home | LocalChefBazaar";
    axios.get(`${API}/meals?limit=6&sort=latest`).then((res) => setMeals(res.data.meals || []));
    axios.get(`${API}/reviews`).then((res) => setReviews((res.data.reviews || []).slice(0, 6)));
  }, []);
  return (
    <div className="overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
        <div className="absolute top-10 right-10 w-72 h-72 bg-green-200 rounded-full opacity-30 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-yellow-200 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full py-20">
          <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-green-100 text-primary font-semibold text-sm px-4 py-1 rounded-full mb-4">🏠 Home-Cooked Goodness</span>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-dark leading-tight mb-6">
              Fresh Meals from <span className="text-primary">Local</span>{" "}<span className="text-secondary">Chefs</span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
              Discover authentic homemade food prepared by talented home cooks in your area. Order now and taste the difference of real cooking.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button onClick={() => navigate("/meals")} className="btn btn-primary text-white px-8 rounded-xl text-base gap-2">Explore Meals <FiArrowRight /></button>
              <button onClick={() => navigate("/register")} className="btn btn-outline btn-primary px-8 rounded-xl text-base">Become a Chef</button>
            </div>
            <div className="flex gap-8 mt-10">
              {[["500+", "Home Chefs"], ["10k+", "Happy Customers"], ["50+", "Daily Meals"]].map(([num, label]) => (
                <div key={label}>
                  <p className="font-display text-2xl font-bold text-primary">{num}</p>
                  <p className="text-gray-500 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative">
            <div className="relative w-full h-[420px] rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=800" alt="Delicious food" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/30 to-transparent"></div>
            </div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <span className="text-3xl">👨‍🍳</span>
              <div><p className="font-bold text-dark text-sm">Chef Rahima</p><p className="text-xs text-gray-500">⭐ 4.9 · 320 orders</p></div>
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 1 }} className="absolute -top-4 -right-4 bg-secondary rounded-2xl shadow-xl p-3 text-center">
              <p className="font-bold text-dark text-lg">৳120</p>
              <p className="text-xs text-dark">Avg. Price</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      

      {/* ═══════════════════════════════════════════
          3. DAILY MEALS
      ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Fresh Today</span>
          <h2 className="font-display text-4xl font-bold text-dark mt-2">Today's Daily Meals</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Handpicked homemade meals from our top chefs, ready for order today.</p>
        </motion.div>
        {meals.length === 0 ? (
          <div className="text-center py-16 text-gray-400"><div className="text-6xl mb-4">🍽️</div><p>No meals available right now.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {meals.map((meal, i) => (
              <motion.div key={meal._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <MealCard meal={meal} />
              </motion.div>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <button onClick={() => navigate("/meals")} className="btn btn-outline btn-primary px-10 rounded-xl gap-2">View All Meals <FiArrowRight /></button>
        </div>
      </section>

          {/* ═══════════════════════════════════════════
    7. CUSTOMER REVIEWS — PREMIUM UI
═══════════════════════════════════════════ */}
<section className="py-24 bg-gradient-to-b from-white to-green-50/40">
  <div className="max-w-7xl mx-auto px-6">

    {/* Section Header */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <div className="inline-flex items-center gap-2 bg-green-100 text-primary px-5 py-2 rounded-full text-sm font-semibold mb-5">
        ⭐ Customer Testimonials
      </div>

      <h2 className="font-display text-5xl font-black text-gray-900 mb-4">
        What Food Lovers Say
      </h2>

      <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
        Real experiences from customers who enjoyed delicious homemade meals from our talented chefs.
      </p>
    </motion.div>

    {/* Reviews Grid */}
    {reviews.length === 0 ? (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😔</div>
        <p className="text-gray-400 text-lg">
          No reviews available right now.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        {reviews.map((review, i) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="group relative bg-white rounded-[30px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
          >

            {/* Decorative Gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400"></div>

            {/* Quote Icon */}
            <div className="absolute top-5 right-5 text-[90px] font-black text-green-50 leading-none select-none">
              "
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4 mb-6 relative z-10">

              <div className="relative">
                <img
                  src={
                    review.reviewerImage ||
                    "https://i.pravatar.cc/100"
                  }
                  alt={review.reviewerName}
                  className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                />

                <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white w-5 h-5 rounded-full"></div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {review.reviewerName}
                </h3>

                <p className="text-sm text-gray-400">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-5">

              {Array.from({
                length: review.rating || 5,
              }).map((_, i) => (
                <div
                  key={i}
                  className="bg-yellow-100 p-1.5 rounded-lg"
                >
                  <FiStar
                    size={14}
                    className="text-yellow-500"
                    fill="currentColor"
                  />
                </div>
              ))}
            </div>

            {/* Comment */}
            <p className="text-gray-600 leading-relaxed text-[15px] relative z-10">
              {review.comment}
            </p>

            {/* Bottom Decoration */}
            <div className="mt-8 flex items-center justify-between">

              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => (
                  <img
                    key={item}
                    src={`https://i.pravatar.cc/40?img=${item + i}`}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    alt=""
                  />
                ))}
              </div>

              <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                Verified Order
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
</section>


        {/* ═══════════════════════════════════════
    WHY CHOOSE US
═══════════════════════════════════════ */}
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">

    {/* Heading */}
    <div className="text-center mb-14">
      <span className="bg-green-100 text-primary px-4 py-2 rounded-full text-sm font-semibold">
        Why Choose Us
      </span>

      <h2 className="text-4xl font-bold text-gray-900 mt-5 mb-3">
        Homemade Food You Can Trust
      </h2>

      <p className="text-gray-500 max-w-2xl mx-auto">
        Fresh meals prepared by trusted local chefs with fast delivery and real-time tracking.
      </p>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {[
        {
          icon: <FiShield size={30} />,
          title: "Trusted Chefs",
          desc: "Verified and experienced home chefs.",
          color: "from-green-400 to-emerald-500",
        },
        {
          icon: <FiClock size={30} />,
          title: "Fast Delivery",
          desc: "Fresh meals delivered quickly.",
          color: "from-yellow-400 to-orange-400",
        },
        {
          icon: <FiHeart size={30} />,
          title: "Made with Love",
          desc: "Healthy homemade meals every day.",
          color: "from-red-400 to-pink-500",
        },
        {
          icon: <FiTruck size={30} />,
          title: "Live Tracking",
          desc: "Track your order anytime.",
          color: "from-blue-400 to-cyan-500",
        },
      ].map((item, i) => (

        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="bg-white border border-gray-100 rounded-3xl p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
        >

          {/* Icon */}
          <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-r ${item.color} text-white flex items-center justify-center shadow-lg`}>
            {item.icon}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed">
            {item.desc}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      


      {/* ═══════════════════════════════════════════
          4. HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-green-50 to-yellow-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Simple Steps</span>
            <h2 className="font-display text-4xl font-bold text-dark mt-2">How It Works</h2>
            <p className="text-gray-500 mt-3">Order your favourite homemade meal in 3 easy steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {[
              { step: "01", icon: "🔍", title: "Browse Meals",  desc: "Explore a variety of homemade dishes from local chefs near you." },
              { step: "02", icon: "🛒", title: "Place Order",   desc: "Select your meal, confirm quantity and delivery address easily."  },
              { step: "03", icon: "🚀", title: "Get Delivered", desc: "Your fresh meal is prepared and delivered right to your door."    },
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Step {step.step}</div>
                <div className="text-5xl mb-4 mt-2">{step.icon}</div>
                <h3 className="font-display font-bold text-xl text-dark mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. FOOD CATEGORIES
      ═══════════════════════════════════════════ */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Explore</span>
          <h2 className="font-display text-4xl font-bold text-dark mt-2">Popular Categories</h2>
          <p className="text-gray-500 mt-3">Find your favourite type of homemade food</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { emoji: "🍛", label: "Biryani",    bg: "bg-orange-50 hover:bg-orange-100 border-orange-100" },
            { emoji: "🐟", label: "Fish",       bg: "bg-blue-50 hover:bg-blue-100 border-blue-100"       },
            { emoji: "🍗", label: "Chicken",    bg: "bg-yellow-50 hover:bg-yellow-100 border-yellow-100" },
            { emoji: "🥩", label: "Mutton",       bg: "bg-red-50 hover:bg-red-100 border-red-100"          },
            { emoji: "🥗", label: "Vegetarian", bg: "bg-green-50 hover:bg-green-100 border-green-100"    },
            { emoji: "🍰", label: "Desserts",   bg: "bg-pink-50 hover:bg-pink-100 border-pink-100"       },
          ].map((cat, i) => (
            <motion.button key={i} onClick={() => navigate("/meals")}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className={`${cat.bg} rounded-2xl p-5 text-center transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer border`}>
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <p className="font-semibold text-dark text-sm">{cat.label}</p>
            </motion.button>
          ))}
        </div>
      </section>

    {/* ═══════════════════════════════════════════
    BEAUTIFUL BECOME A CHEF SECTION
═══════════════════════════════════════════ */}
<section className="py-24 bg-white px-6">
  <div className="max-w-7xl mx-auto">

    <div className="grid lg:grid-cols-2 gap-14 items-center">

      {/* ───────────────── IMAGE SIDE ───────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative"
      >

        {/* Main Image */}
        <div className="relative overflow-hidden rounded-[32px] shadow-2xl">

          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600"
            alt="Chef cooking"
            className="w-full h-[650px] object-cover hover:scale-105 transition-transform duration-700"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Floating Review Card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute bottom-6 left-6 bg-white rounded-2xl p-5 shadow-2xl max-w-xs"
          >
            <div className="flex items-center gap-3 mb-3">

              <img
                src="https://i.pravatar.cc/100?img=12"
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />

              <div>
                <h4 className="font-bold text-gray-800">
                  Chef Rahima
                </h4>

                <p className="text-sm text-gray-500">
                  Earning ৳22,000/month
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              “This platform helped me turn my cooking passion into a successful business.”
            </p>
          </motion.div>
        </div>

        {/* Floating Stats Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -top-6 -right-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl shadow-2xl p-6 text-center"
        >
          <h3 className="text-4xl font-black text-black">
            4.9★
          </h3>

          <p className="text-black font-semibold text-sm">
            Chef Rating
          </p>
        </motion.div>
      </motion.div>

      {/* ───────────────── CONTENT SIDE ───────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full text-sm font-semibold mb-6">
          👨‍🍳 Become a Home Chef
        </div>

        {/* Heading */}
        <h2 className="text-5xl lg:text-6xl font-black leading-tight text-gray-900 mb-6">

          Turn Your
          <span className="block bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Cooking Skills
          </span>

          Into Income
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-xl">
          Join our growing community of passionate home chefs.
          Sell homemade meals, receive nearby orders, and earn money
          doing what you love every day.
        </p>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 gap-5 mb-10">

          {[
            {
              title: "Flexible Schedule",
              desc: "Cook whenever you want",
              icon: "⏰",
            },
            {
              title: "Nearby Customers",
              desc: "Receive local meal orders",
              icon: "📦",
            },
            {
              title: "Secure Payments",
              desc: "Fast & safe transactions",
              icon: "💳",
            },
            {
              title: "Build Reputation",
              desc: "Earn ratings & reviews",
              icon: "⭐",
            },
          ].map((item, i) => (

            <div
              key={i}
              className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-4">
                {item.icon}
              </div>

              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {item.title}
              </h3>

              <p className="text-sm text-gray-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5 mb-10">

          {[
            { value: "500+", label: "Chefs" },
            { value: "10K+", label: "Orders" },
            { value: "৳15K+", label: "Monthly Income" },
          ].map((item, i) => (

            <div
              key={i}
              className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-3xl p-6 text-center shadow-sm"
            >
              <h3 className="text-3xl font-black text-gray-900 mb-1">
                {item.value}
              </h3>

              <p className="text-sm text-gray-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-5">

          <button
            onClick={() => navigate("/register")}
            className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold shadow-xl hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              Start Cooking Today
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button
            onClick={() => navigate("/meals")}
            className="px-8 py-4 rounded-2xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
          >
            Explore Meals
          </button>
        </div>
      </motion.div>
    </div>
  </div>
</section>

   
{/* ═══════════════════════════════════════════
    8. FINAL CTA BANNER — WHITE PREMIUM DESIGN
═══════════════════════════════════════════ */}
<section className="py-24 px-6 bg-white">
  <div className="max-w-7xl mx-auto">

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative overflow-hidden rounded-[40px] border border-gray-100 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.08)]"
    >

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-green-100 to-yellow-100 rounded-full blur-3xl opacity-70"></div>

        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-green-50 to-orange-100 rounded-full blur-3xl opacity-70"></div>
      </div>

      <div className="relative z-10 grid lg:grid-cols-2 items-center gap-12 px-8 lg:px-16 py-16 lg:py-20">

        {/* ───────── LEFT CONTENT ───────── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 text-primary px-5 py-2 rounded-full text-sm font-semibold mb-6">
            🍽️ Fresh Homemade Meals
          </div>

          {/* Heading */}
          <h2 className="font-display text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">

            Hungry?
            <span className="block bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 bg-clip-text text-transparent">
              Let’s Fix That.
            </span>
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-lg leading-relaxed max-w-xl mb-10">
            Discover delicious homemade meals prepared by talented local chefs.
            Fresh ingredients, affordable prices, and fast delivery right to your doorstep.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-5">

            {/* Order Button */}
            <button
              onClick={() => navigate("/meals")}
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Order Now 🛒
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            {/* Join Button */}
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 rounded-2xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300 shadow-sm"
            >
              Join as Chef
            </button>
          </div>

          {/* Mini Stats */}
          <div className="flex flex-wrap gap-8 mt-12">

            {[
              { value: "10K+", label: "Happy Customers" },
              { value: "500+", label: "Home Chefs" },
              { value: "4.9★", label: "Average Rating" },
            ].map((item, i) => (

              <div key={i}>
                <h3 className="text-3xl font-black text-gray-900">
                  {item.value}
                </h3>

                <p className="text-gray-500 text-sm">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ───────── RIGHT IMAGE ───────── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative"
        >

          {/* Main Image */}
          <div className="relative overflow-hidden rounded-[32px] shadow-2xl">

            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200"
              alt="Delicious food"
              className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

            {/* Floating Delivery Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute bottom-6 left-6 bg-white rounded-2xl p-5 shadow-2xl"
            >
              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-3xl">
                  🚚
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 text-lg">
                    Fast Delivery
                  </h4>

                  <p className="text-gray-500 text-sm">
                    Delivered within 30 mins
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Floating Rating Card */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -top-6 -right-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl shadow-2xl p-6 text-center"
          >
            <h3 className="text-4xl font-black text-black">
              4.9★
            </h3>

            <p className="text-black font-semibold text-sm">
              Customer Rating
            </p>
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  </div>
</section>

    </div>
  );
};

export default Home;
