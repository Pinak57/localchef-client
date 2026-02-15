import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-8 mt-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ✅ Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-orange-500 mb-3">
            LocalChefBazaar
          </h2>
          <p className="text-sm leading-relaxed">
            A marketplace for home-cooked meals, connecting chefs and food lovers.
          </p>
        </div>

        {/* ✅ Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-orange-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/meals" className="hover:text-orange-400 transition-colors">
                Meals
              </Link>
            </li>
            <li>
              <Link to="/favorites" className="hover:text-orange-400 transition-colors">
                Favorites
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-orange-400 transition-colors">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* ✅ Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="text-sm">Email: support@localchefbazaar.com</p>
          <p className="text-sm">Phone: +880-1234-567890</p>
          <p className="text-sm">Sylhet, Bangladesh</p>
        </div>
      </div>

      {/* ✅ Bottom Bar */}
      <div className="text-center text-sm text-gray-400 mt-6 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} LocalChefBazaar. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
