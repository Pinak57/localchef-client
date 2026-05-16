🍲 LocalChefBazaar
📌 Project Purpose
LocalChefBazaar is a role‑based web platform where users, chefs, and admins interact seamlessly.

Users can browse meals, place orders, add favorites, and manage reviews.

Chefs can create, update, and manage their meals, and handle order requests.

Admins can manage users, requests, and view platform statistics.

This project ensures secure role‑based access with JWT authentication and provides a smooth dashboard experience for each role.

🌐 Live URL
👉 LocalChefBazaar Live  : https://localchefbazaaar.netlify.app/

🚀 Key Features
Authentication & Authorization

JWT‑based login/register with secure cookies

Role‑based routes (User, Chef, Admin)

Dashboards

User Dashboard → Orders, Favorites, Profile

Chef Dashboard → Meals CRUD, Order Requests

Admin Dashboard → Manage Users, Orders, Stats

Meals Management

Browse meals with pagination

Add, update, delete meals (Chef only)

Orders

Place orders (User)

Accept/Reject orders (Chef)

View all orders (Admin)

Favorites

Add/remove meals from favorites

Reviews

Submit and view reviews with ratings

Payments

Stripe integration for secure checkout

Webhook support for payment confirmation

Requests

Role upgrade requests (User → Chef/Admin)

Admin approval/rejection flow

📦 NPM Packages Used
express → Backend framework

cors → Cross‑origin resource sharing

dotenv → Environment variable management

mongodb → Database driver

jsonwebtoken (jwt) → Authentication & authorization

cookie-parser → Parse cookies for JWT

stripe → Payment gateway integration

bcrypt → Password hashing (if used for local auth)

react, react-router-dom → Frontend routing

react-hot-toast → Notifications

tailwindcss → Styling framework
