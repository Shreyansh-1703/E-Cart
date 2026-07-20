# 🛒 E-Cart – Next Generation E-Commerce Platform

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-red?style=for-the-badge">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.x-success?style=for-the-badge">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge">
  <img src="https://img.shields.io/badge/MySQL-Database-blue?style=for-the-badge">
  <img src="https://img.shields.io/badge/JWT-Secure%20Authentication-orange?style=for-the-badge">
  <img src="https://img.shields.io/badge/REST-API-brightgreen?style=for-the-badge">
</p>

---

# 🚀 Overview

**E-Cart** is **not an Amazon clone.**

It is a **startup-oriented, full-stack e-commerce platform** designed to solve several real-world problems that existing marketplaces either don't solve or only partially address.

Instead of only focusing on buying and selling products, E-Cart expands into:

- 🚆 Railway Station Deliveries
- 💍 Wedding Essentials Marketplace
- 👗 Rental Fashion System
- 🏪 Multi-Vendor Marketplace
- ⚡ Hyperlocal Express Deliveries
- ⭐ Product Reviews
- ❤️ Wishlist
- 🔄 Return Management

The project was developed with **Java Spring Boot** following enterprise backend practices while using **React** for a responsive frontend.

---

# 💡 Why E-Cart is Different

Most Amazon clone projects include only:

- Login
- Products
- Cart
- Checkout
- Orders

E-Cart goes far beyond that.

Instead of copying Amazon's business model, it introduces **new business opportunities** that could become an independent startup.

---

# 🌟 Unique Startup Features

## 🚆 Railway Station Delivery

One of the biggest innovations in E-Cart.

Users can:

- Enter Train Number
- Verify PNR
- Deliver products directly to railway stations
- Track delivery status

This feature is designed for:

- Travelers
- Emergency medicine delivery
- Food delivery
- Last minute shopping while travelling

This feature alone differentiates E-Cart from conventional e-commerce websites.

---

## 💍 Wedding Essentials Marketplace

Planning a wedding usually requires booking services from multiple platforms.

E-Cart combines everything into one marketplace.

Customers can book:

- Photographers
- Mehendi Artists
- Makeup Artists
- Decorators
- Cakes
- Wedding Dresses
- Jewellery

instead of switching between multiple websites.

---

## 👗 Fashion Rental System

Instead of purchasing expensive clothing, users can rent:

- Bridal Lehengas
- Groom Sherwanis

The system supports:

- Rental duration
- Security agreement
- Damage policies
- Return workflow

---

## ⚡ Hyperlocal Express Delivery

Supports deliveries between:

- 30 Minutes
- 1 Hour
- 3 Hours

depending upon customer location.

Useful for:

- Grocery
- Medicines
- Emergency products

---

## 🏪 Multi Vendor Marketplace

Multiple sellers can:

- Register
- Manage Products
- Manage Inventory
- View Orders

instead of having only one administrator selling products.

---

## ❤️ Wishlist

Customers can save products for future purchases.

---

## ⭐ Product Reviews

Verified users can review products to improve customer trust.

---

## 🔄 Return Management

Dedicated return workflow with status tracking.

---

# 🔐 Enterprise Security (Spring Boot)

Security is one of the strongest parts of this project.

Instead of simple authentication, the backend follows modern Spring Security practices.

## Authentication

- JWT Authentication
- Stateless Sessions
- Token Based Authorization

---

## Authorization

Role Based Access Control (RBAC)

Different permissions for:

- Customer
- Seller
- Administrator

Each API endpoint is protected according to user roles.

---

## Password Security

Passwords are encrypted before storage using secure hashing provided by Spring Security.

No plain-text passwords are stored inside the database.

---

## Protected REST APIs

Sensitive endpoints require authenticated JWT tokens.

Examples:

- Order APIs
- Cart APIs
- Payment APIs
- Seller APIs
- Admin APIs

---

## Secure API Architecture

The backend follows a layered architecture:

```
Controller
      ↓
Service
      ↓
Repository
      ↓
Database
```

Business logic is isolated from controllers making the application scalable and maintainable.

---

# 🏗 Tech Stack

## Backend

- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- REST APIs
- Maven

---

## Frontend

- React
- JavaScript
- HTML5
- CSS3

---

## Database

- MySQL

---

## Tools

- Git
- GitHub
- Postman

---

# 📂 Major Modules

- Authentication
- User Management
- Product Management
- Categories
- Shopping Cart
- Orders
- Payments
- Wishlist
- Reviews
- Returns
- Railway Delivery
- Wedding Marketplace
- Vendor Management
- Seller Dashboard
- Admin Dashboard

---

# 🧩 System Architecture

```
React Frontend
        │
 REST APIs
        │
Spring Boot Backend
        │
Spring Security + JWT
        │
Business Services
        │
Spring Data JPA
        │
MySQL Database
```

---

# ✨ Project Highlights

✔ Enterprise REST API Architecture

✔ JWT Authentication

✔ Role Based Authorization

✔ Multi Vendor Marketplace

✔ Railway Delivery System

✔ Wedding Service Marketplace

✔ Rental Fashion Module

✔ Hyperlocal Delivery Concept

✔ Wishlist

✔ Reviews

✔ Return Management

✔ Secure Password Encryption

✔ Layered Spring Boot Architecture

✔ Clean Code Structure

---

# 🎯 Why This Isn't Just Another Amazon Clone

Most e-commerce projects simply recreate Amazon's existing features.

E-Cart instead focuses on solving **real Indian customer problems** through service innovation.

Examples include:

- Railway station delivery for travelers.
- Booking wedding services alongside shopping.
- Renting premium wedding attire instead of purchasing.
- Fast delivery of groceries and medicines.
- A marketplace where products and professional services coexist.

These ideas transform the platform from a traditional online store into a **service-driven commerce ecosystem**, opening opportunities for expansion into logistics, event management, rental commerce, and local vendor networks.

---

# 📈 Future Roadmap

- AI Product Recommendation Engine
- Personalized Shopping Experience
- Real-Time Delivery Tracking
- Dynamic Pricing
- Inventory Prediction
- Chat Support
- Microservices Architecture
- Docker & Kubernetes Deployment
- CI/CD Pipeline
- AWS Cloud Deployment
- Elasticsearch Product Search
- Redis Caching
- Payment Gateway Enhancements
- Notification Service (Email/SMS)

---

# 📚 Learning Outcomes

This project demonstrates practical experience with:

- Enterprise Java Development
- Spring Boot Best Practices
- Spring Security
- JWT Authentication
- RESTful API Design
- Database Design
- React Integration
- Role-Based Authorization
- Scalable Backend Architecture
- Full Stack Application Development

---

# 🌱 Startup Vision

**E-Cart is envisioned as a next-generation commerce platform rather than a conventional online shopping application.**

By combining retail products, professional services, rental commerce, and hyperlocal logistics into a unified ecosystem, the platform explores a business model that extends beyond traditional marketplaces. Its modular architecture also makes it well-suited for future expansion into cloud-native microservices, AI-powered recommendations, and nationwide logistics integrations.

---
# 📸 Project Screenshots

## 🔐 Sign In Page

A modern authentication page built using React with a clean UI. Users can securely authenticate using JWT-based login or continue as a guest.
![Sign In](./screenshots/signin.png)
---

## 🏠 Home Page

The landing page of E-Cart featuring product categories, search functionality, Railway Delivery, Wedding Marketplace, and personalized shopping experience.

<p align="center">
<img src="./screenshots/homepage.png" width="100%">
</p>

---

## 💍 Wedding Essentials Marketplace

A unique marketplace where customers can purchase or book wedding-related products and professional services including decorators, photographers, makeup artists, mehendi artists, cakes, jewellery, and more.

Unlike traditional e-commerce websites, E-Cart combines shopping with service booking in one platform.

<p align="center">
<img src="./screenshots/wedding.png" width="100%">
</p>

---

## 🚆 Railway Delivery System

One of the flagship features of E-Cart.

Customers can search their train using Train Number, verify their journey through PNR, and receive products securely at railway stations using OTP-based delivery verification.

This feature targets millions of railway passengers across India.

<p align="center">
<img src="./screenshots/railway.png" width="100%">
</p>

---

## 👗 Rental Checkout

Premium wedding attire can be rented instead of purchased.

The rental module includes:

- Rental Agreement
- Damage Policy
- Refundable Security Deposit
- Identity Verification
- Rental Duration Selection

making the platform suitable for luxury fashion rentals.

<p align="center">
<img src="./screenshots/rental-checkout.png" width="100%">
</p>

---

## 💳 Razorpay Payment Gateway Integration

E-Cart integrates Razorpay's secure payment gateway, allowing customers to complete transactions using Cards, UPI, Wallets, Net Banking, and Pay Later options.

The integration follows secure payment workflows and provides a seamless checkout experience.

<p align="center">
<img src="./screenshots/razorpay.png" width="100%">
</p>

---

## 👤 Customer Profile Dashboard

Customers can manage their personal information, account settings, profile details, saved items, and access quick links such as becoming a seller.

This dashboard provides a personalized shopping experience while maintaining secure user account management.

<p align="center">
<img src="./screenshots/customer-profile.png" width="100%">
</p>

---

## ⚙️ Admin Dashboard

A complete administration portal built for managing the entire platform.

Features include:

- Dashboard Analytics
- User Management
- Product Management
- Order Management
- Revenue Analytics
- Monthly Sales Reports
- Live Store Statistics
- Inventory Monitoring

The dashboard follows enterprise admin panel design principles and demonstrates full-stack application management capabilities.

<p align="center">
<img src="./screenshots/admin-dashboard.png" width="100%">
</p>

## 👨‍💻 Author

**Shreyansh Srivastava**

**Java Full Stack Developer**

Focused on building scalable, secure, and production-ready applications using Java, Spring Boot, React, and modern software engineering practices.
