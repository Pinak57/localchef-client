import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-green-50 border-t mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand + Contact */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              🍽️ Local<span className="text-green-600">Chef</span>
            </h2>

            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              Fresh homemade meals delivered from trusted local chefs with love and care.
            </p>

            <div className="space-y-2 text-sm text-gray-600">
              <p>📧 support@localchef.com</p>
              <p>📞 +880 1700 000000</p>
              <p>📍 Dhaka, Bangladesh</p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>

            <div className="flex gap-3">
              {[
                { icon: <FiFacebook />, link: "#" },
                { icon: <FiInstagram />, link: "#" },
                { icon: <FiTwitter />, link: "#" },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm border hover:bg-green-600 hover:text-white transition"
                >
                  {item.icon}
                </a>
              ))}
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Stay connected for latest meals & offers.
            </p>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Working Hours</h3>

            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex justify-between">
                <span>Mon - Fri</span>
                <span>8 AM - 10 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Saturday</span>
                <span>9 AM - 9 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Sunday</span>
                <span>10 AM - 6 PM</span>
              </p>
            </div>

            <div className="mt-4 inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              We are Open Now
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">

          <p className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} LocalChefBazaar. All rights reserved.
          </p>

          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <span className="text-red-500">❤</span> in Bangladesh
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer; 