# 🧳 BookIt: Experiences & Slots
**Fullstack Internship Assignment — End-to-End Booking Web App**

> A complete booking flow web application built using **React + TypeScript (Vite)** on the frontend and **Node.js + Express + MongoDB** on the backend.  
> Users can explore curated experiences, view available dates and slots, apply promo codes, and complete bookings seamlessly.

---

## 🌐 Live Demo
🔗 **Frontend (Vercel):** [https://book-it-app.vercel.app](#)  
🔗 **Backend (Vercel):** [https://book-it-lake.vercel.app](#)

---

## 🎯 Objective
This project was developed as a fullstack assignment to demonstrate:
- Real-world **frontend–backend integration**
- **Database handling** with MongoDB (Mongoose)
- **Dynamic booking flow**
- **Clean, responsive UI** matching the provided [Figma Design](https://www.figma.com/design/8X6E1Ev8YdtZ3erV0Iifvb/HD-booking?node-id=0-1&p=f&t=K4scwnxfIHmfbb2a-0)

---

## ⚙️ Tech Stack

### **Frontend**
- ⚛️ React + TypeScript (Vite)
- 🎨 TailwindCSS for styling
- 🍞 React Toastify for notifications
- 🌐 Axios / Fetch for API calls
- 🔄 React Router for navigation

### **Backend**
- 🧩 Node.js + Express.js
- 🗄️ MongoDB with Mongoose ODM
- 🔐 dotenv for environment variables
- 🌍 CORS configured for frontend connection

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|:--:|:--|:--|
| **GET** | `/experiences` | Fetch all available experiences |
| **GET** | `/experiences/:id` | Fetch details of a single experience |
| **GET** | `/experiences/:id/slots` | Get available slots for a date |
| **POST** | `/bookings` | Create a new booking |
| **POST** | `/promo/validate` | Validate and apply promo code |

---

## 🧩 Database Models (MongoDB)

### 🧭 Experience Model
```js
{
  experienceName,
  experiencePlace,
  experienceDescription,
  experienceImageURL,
  experiencePrice,
  experienceAbout,
  availableDates: [
    {
      date,
      slots: [
        { time, totalCount, bookedCount }
      ]
    }
  ]
}
```

### 🧾 Booking Model
```js
{
  fullName,
  email,
  experienceId,
  experienceName,
  date,
  time,
  quantity,
  subtotal,
  tax,
  total,
  promoCode,
  discount,
  finalAmount,
  status
}
```

### 💸 Promo Code Model
```js
{
  code,
  type: "PERCENT" | "FLAT",
  value,
  minPurchase,
  expiryDate,
  isActive
}
```

---

## ⚙️ Environment Variables

### **Backend (.env)**
```bash
PORT=3000
MONGODB_URI=<your-mongodb-uri>
FRONTEND_URL=http://localhost:5173
```

### **Frontend (.env)**
```bash
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🧰 Clone and Setup (GitHub)

### 1️⃣ Clone Repository
```bash
git clone https://github.com/icodervivek/BookIt.git
cd BookIt
```

### 2️⃣ Setup Backend
```bash
cd server
npm install
npm run dev
```
Runs on: `http://localhost:3000`

### 3️⃣ Setup Frontend
```bash
cd ../client
npm install
npm run dev
```
Runs on: `http://localhost:5173`

---

## 🔄 Booking Flow

1. **Home Page** — Displays all experiences fetched from backend.  
2. **View Details** — Shows full description, available dates, and slots.  
3. **Checkout Page** — Collects user info, validates promo code, shows price summary.  
4. **Result Page** — Displays booking confirmation with a reference ID.

---

## 💡 Features Implemented

✅ Fully functional backend with MongoDB  
✅ Dynamic slot management (prevents double booking)  
✅ Promo code validation with discount logic  
✅ Responsive & pixel-perfect UI from Figma  
✅ Toast feedback for all states (loading, success, error)  
✅ Centralized API configuration via `.env`  
✅ Deployed on cloud platforms for live demo  

---

## 👩‍💻 Author
**Vivek**  
Fullstack Developer Intern Candidate  
📧 [vivekpramanikbundu@gmail.com](mailto:vivekpramanikbundu@gmail.com)  
🌐 [GitHub Profile](https://github.com/icodervivek)
