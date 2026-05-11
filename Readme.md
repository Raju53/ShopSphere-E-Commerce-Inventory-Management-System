📦 Project Overview

ShopSphere: An E-Commerce & Inventory Management System

ShopSphere is an enterprise-grade logistics solution designed to bridge the gap between suppliers and customers.

* **For Customers**: A high-fidelity marketplace to discover products and track orders.

* **For Suppliers:** A powerful inventory console to manage stock health and listing assets.

* **For Admins:** A global command center for user moderation and order fulfillment pipelines.

Built with a stateless architecture using JWT and a utility-first UI via Tailwind CSS, ShopSphere is optimized for speed, security, and scalability.

🚀 Tech Stack

**Frontend**

* **React 18:** Component-based UI library.

* **Tailwind CSS:** Utility-first CSS framework for a premium SaaS aesthetic.

* **Lucide Icons:** Clean, scalable iconography.

* **Vite:** Ultra-fast frontend build tool.

**Backend**

  * **Spring Boot 3:** Robust Java framework for the RESTful API.

  * **Spring Security + JWT:** Secure, stateless authentication.

  * **Spring Data JPA:** Efficient database communication.

  * **MySQL:** Relational database for persistent storage.

✨ Key Features

1. **Unified Dashboard**

   * **Role-Based Access Control (RBAC):** Personalized views for Users, Suppliers, and Admins.

   * **Marketplace:** Explore a dynamic product catalog with high-precision Rupee (₹) currency localization and real-time stock status.

   * **Shopping Cart:** Real-time total calculation and streamlined checkout.

2. **Supplier Management**

   * **Inventory Console:** Monitor stock health and listing details.

   * **Add Product:** Launch new resources directly from the dashboard.

   * **Update Resource:** Edit existing listings, including the ability to replace placeholder images with live asset URLs.

3. **Admin Fulfillment Pipeline**

   * **Global Order Tracking:** Oversee every transaction in the system.

   * **Dynamic Status Colors:**

        🟠 **PENDING:** Initial order state.

        🔵 **SHIPPED:** Logistics in motion.

        🟢 **DELIVERED:** Successfully fulfilled.

        🔴 **CANCELLED:** Order voided.

🛠️ Setup Instructions

**Backend** (Spring Boot)

  * Ensure MySQL is running and create a database.

  * Update `application.properties` with your database credentials.

  * Enable CORS in your WebConfig to allow requests from http://localhost:5173.

  * Run the application via your IDE or
    ```
    ./mvnw spring-boot:run.
    ```

**Frontend** (React)

Clone the repository and navigate to the frontend folder.

**Install dependencies:**

```
npm install
```

**Start the development server:**

```
npm run dev
```

Access the app at http://localhost:5173.

🔐 Security Note

The system uses JWT (**JSON Web Tokens**) for session management. On login, the token is stored in localStorage and automatically appended to the Authorization header for all subsequent API calls via the apiCall utility.
