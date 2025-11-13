<div align="center">

# 🌿 ReTh!nk – AI That Helps You Rethink Items & Reward Tokens

</div>

<div align="center">

![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Fullstack-blue?style=for-the-badge)
![Tech](https://img.shields.io/badge/Tech-Next.js%20|%20Node.js%20|%20MongoDB-purple?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-GPT%20Vision-orange?style=for-the-badge)
![Blockchain](https://img.shields.io/badge/Blockchain-Polygon-7b3fe4?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![Made With Love](https://img.shields.io/badge/Made%20With-❤️-ff3366?style=for-the-badge)


</div>


<div align="center">

✨ _Turning Waste Into Wonder — Powered by AI, Automation & Blockchain_ ✨

![Re-Th-nk-Banner.png](https://i.postimg.cc/nVXfsBzc/Re-Th-nk-Banner.png)

</div>


## ♻️ 1. Problem Statement

Every year, millions of perfectly reusable items end up in landfills because people lack awareness or inspiration on how to repurpose them.

**ReTh!nk** combines:

- 🧠 _Artificial Intelegence_
- 🤖 _Automation_
- 🔗 _Blockchain_

to help users **discover creative reuse ideas** and **earn eco-reward tokens (Th!nk)** for sustainable actions.

---

## 🧩 2. System Architecture

**System Flow**

- **Frontend (Next.js)** → **Backend (Node.js + Express)**  
- **Backend** → **GPT-5 Vision** (image analysis)  
- **GPT-5 Vision** → **n8n Automations** (fetch tutorials)  
- **n8n** → **MongoDB Atlas** (database)  
- **MongoDB Atlas** → **Polygon Blockchain** (EcoToken smart contract)

**User Journey (high level)**

- **User** → *Uploads item image* → **AI** → *Suggests reuse ideas* → **User** → *Completes upcycle* → **Blockchain** → *Mints Th!nk tokens*





---

## 🛠️ 3. Stack Overview

- **Frontend:** Next.js, TailwindCSS
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas
- **AI:** GPT-5 Vision
- **Automation:** n8n (YouTube, Pinterest, Blogs)
- **Blockchain:** Polygon Testnet (EcoToken in Solidity)
- **Auth:** JWT
- **Hosting:** Vercel, Render, Railway

---

## 🔮 4. The Twist – Blockchain Th!nk System

Every verified upcycling activity rewards users with **Th!nk Tokens** — a blockchain-backed proof of sustainability.

### 🌱 Tokens Give You:

- On-chain **proof of eco-action**
- Redeemable perks: _NFT badges, partner discounts, leaderboards_
- Transparent, tamper-proof eco-tracking

---

## 🚀 5. Key Features (Visually Enhanced)

### 🔐 Authentication

- Secure JWT login, signup, logout

### 📦 CRUD

- Manage items, ideas, token history

### 🤖 AI Integration

- GPT-5 Vision analyzes photos
- Generates personalized reuse/upcycling ideas

### 🔗 Automations

- n8n fetches tutorials (YouTube, blogs, Pinterest) automatically

### 🔍 Search + Sort + Filter + Pagination

- Filter by category/material
- Sort by date, eco-score
- Paginated, fast results

### 🪙 Blockchain

- Polygon Testnet smart contract
- Tokens minted for each eco-action

### 🏆 Gamification

- Leaderboards
- Achievements
- Eco-badges

---

## 🧱 6. Tech Stack Table

| Layer              | Technologies                            |
| ------------------ | --------------------------------------- |
| **Frontend**       | Next.js, React, TailwindCSS, Axios      |
| **Backend**        | Node.js, Express.js                     |
| **Database**       | MongoDB Atlas (Mongoose)                |
| **Authentication** | JWT                                     |
| **AI**             | GPT-5 Vision                            |
| **Automation**     | n8n                                     |
| **Blockchain**     | Solidity, Polygon, Web3.js / Ethers.js  |
| **Hosting**        | Vercel, Render, Railway, Alchemy/Infura |

---

## 📡 7. API Overview

| Endpoint           | Method | Description                 | Access |
| ------------------ | ------ | --------------------------- | ------ |
| `/api/auth/signup` | POST   | Register new user           | Public |
| `/api/auth/login`  | POST   | Login user                  | Public |
| `/api/items`       | POST   | Upload item/photo           | Auth   |
| `/api/items`       | GET    | Search/sort/filter/paginate | Auth   |
| `/api/items/:id`   | GET    | Fetch item                  | Auth   |
| `/api/items/:id`   | PUT    | Update item                 | Auth   |
| `/api/items/:id`   | DELETE | Delete item                 | Auth   |

---

## 🧪 How to Run Locally

### Backend

```bash
npm install
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

---

## 🚀 Future Enhancements

- AR-based upcycling visualizer
- Eco marketplace
- NFT achievement ecosystem

---

## 🧩 License

MIT License

---

<div align="center">

<small>Made with ❤️</small>

</div>