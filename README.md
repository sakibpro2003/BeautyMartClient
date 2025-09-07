# BeautyMart 💊 - Online Medicine E-Commerce Shop

## 🚀 Live Demo
🔗 [Live project](https://medi-mart-client-umber.vercel.app)

## 📌 About BeautyMart
BeautyMart is an online medicine e-commerce platform where users can browse and purchase medicines seamlessly. The platform offers a user-friendly experience, authentication system, order management, and an admin dashboard for handling inventory.

## ✨ Features
- 🛒 **E-commerce Functionality** - Browse, search, and purchase medicines.
- 🔐 **Authentication System** - Secure login and registration (NextAuth.js).
- 📦 **Order Management** - Track orders, order history, and status updates.
- 📊 **Admin Dashboard** - Manage products, orders, and users.
- 💬 **Live Chat Support** *(Coming Soon!)*

## 🛠️ Technologies Used
- **Frontend**: Next.js 15.1.1, TypeScript, Tailwind CSS, DaisyUI
- **State Management**: React Context API
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS + DaisyUI
- **Deployment**: Vercel

---

## 📥 Installation & Setup
### 1️⃣ Clone the Repository
```sh
  git clone https://github.com/yourusername/BeautyMart.git
  cd BeautyMart
```

### 2️⃣ Install Dependencies
```sh
  npm install
  # or
  yarn install
```

### 3️⃣ Set Up Environment Variables
Create a `.env.local` file in the root directory and add the necessary environment variables:
```env
NEXTAUTH_URL=your_deployed_url
NEXTAUTH_SECRET=your_secret_key
API_BASE_URL=your_api_url
```

### 4️⃣ Start Development Server
```sh
  npm run dev
  # or
  yarn dev
```
Access the app at: `http://localhost:3000`

---

## 🔀 Routing Overview
### 🏠 Home Page (`/`)
- Displays featured medicines and categories.

### 🔍 Product Details (`/product/:id`)
- Shows detailed medicine information with an "Add to Cart" button.

### 🛒 Cart Page (`/cart`)
- Displays items added to the cart and checkout options.

### 🔑 Authentication (`/login`, `/register`)
- Users can log in or register using email and password.

### 📦 Orders (`/orders`)
- Customers can track their order history and status.

### 🎛️ Admin Dashboard (`/admin`)
- Accessible only to admins, allowing product and order management.

---

## 🚀 Deployment
BeautyMart is deployed on **Vercel**.
To deploy, run:
```sh
vercel
```
Or push to GitHub, and Vercel will auto-deploy the latest changes.

---

## 🛠️ Troubleshooting & Common Issues
**Issue:** `Could not find a declaration file for module 'daisyui'`
**Fix:** Run
```sh
npm i --save-dev @types/daisyui
```

**Issue:** `An error occurred in the Server Components render`
**Fix:** Check API routes, authentication state, and ensure `useEffect` dependencies are correctly set.

---

## 📄 License
This project is **MIT Licensed**.

---

## 👨‍💻 Contributing
Contributions are welcome! Feel free to open issues and pull requests.

### ⭐ Star the Repo!
If you like this project, don't forget to **star ⭐** the repository!

