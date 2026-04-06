# VVS Banana Cold Store & Supply — Frontend

The customer-facing portal and admin dashboard for **VVS Banana Cold Store & Supply**, a banana procurement, cold storage, ripening, and wholesale/retail supply business based in Indore.

Built with **React 19 + Vite 8**.

---

## Tech Stack

| Layer        | Technology                                    |
| ------------ | --------------------------------------------- |
| Framework    | React 19 (JSX)                                |
| Bundler      | Vite 8                                        |
| Routing      | React Router DOM 7                            |
| HTTP Client  | Axios                                         |
| Charts       | Recharts                                      |
| Icons        | Lucide React                                  |
| Notifications| React Hot Toast                               |
| Fonts        | Inter (Google Fonts)                           |
| Linting      | ESLint 9 + React Hooks & Refresh plugins      |

---

## Project Structure

```
veggies-frontend/
├── public/                  # Static assets (favicon, icons)
├── src/
│   ├── assets/              # Images & media
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication state
│   ├── layouts/
│   │   ├── AdminLayout.jsx  # Admin sidebar + chrome
│   │   └── CustomerLayout.jsx
│   ├── pages/
│   │   ├── admin/           # Admin dashboard pages
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── StockPage.jsx
│   │   │   ├── RipeningPage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── PaymentsPage.jsx
│   │   │   ├── DeliveryPage.jsx
│   │   │   ├── CustomersPage.jsx
│   │   │   └── LoginPage.jsx
│   │   └── customer/        # Customer-facing pages
│   │       ├── HomePage.jsx
│   │       ├── ProductsPage.jsx
│   │       ├── OrderPage.jsx
│   │       └── ContactPage.jsx
│   ├── services/
│   │   └── api.js           # Axios instance & API helpers
│   ├── App.jsx              # Root component & routes
│   ├── App.css
│   ├── index.css            # Global styles & design tokens
│   └── main.jsx             # React DOM entry point
├── index.html               # HTML shell
├── vite.config.js           # Vite config (port 3000, API proxy → :5000)
├── eslint.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- The [veggies-backend](../veggies-backend) server running on port **5000**

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev
```

### Available Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start Vite dev server on port 3000 |
| `npm run build`   | Production build → `dist/`         |
| `npm run preview` | Preview production build locally   |
| `npm run lint`    | Run ESLint checks                  |

---

## API Proxy

During development, all `/api/*` requests are proxied to `http://localhost:5000` (configured in `vite.config.js`), so the backend must be running for full functionality.

---

## Key Features

### Customer Portal (`/`)
- **Home** — Hero section, business highlights, featured products
- **Products** — Browse available banana varieties & ripeness levels
- **Order** — Place wholesale/retail orders with quantity selection
- **Contact** — Business location (Google Maps), phone, WhatsApp link

### Admin Dashboard (`/admin`)
- **Dashboard** — KPI cards, revenue charts, recent activity
- **Stock Management** — Track incoming banana procurement
- **Ripening Batches** — Monitor ripening chamber status & progress
- **Products** — Manage product catalog, pricing, stock levels
- **Orders** — View & manage wholesale/retail orders
- **Payments** — Track payment status & history
- **Delivery** — Delivery scheduling & tracking
- **Customers** — Customer directory & purchase history

---

## License

Private — All rights reserved.
