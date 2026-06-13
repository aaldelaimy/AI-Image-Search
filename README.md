# AI Image Search

A full-stack web app for generating AI images with OpenAI DALL-E, sharing them in a community gallery, and searching past creations by prompt or author.

---

## Overview

AI Image Search is a MERN-style application that connects a React frontend to an Express API backed by MongoDB. Users enter a text prompt, generate a 1024×1024 image via the DALL-E API, and publish it to a shared feed. Images are uploaded to Cloudinary for persistent storage, and the gallery supports debounced client-side search and one-click downloads.

The project demonstrates end-to-end product development: REST API design, third-party integrations (OpenAI, Cloudinary), database modeling, CORS configuration for production, and deployment across separate frontend and backend hosts.

## Features

- **AI image generation**: Create images from natural-language prompts using OpenAI DALL-E
- **Community gallery**: Browse and discover images shared by other users
- **Search**: Filter posts by prompt or author name with debounced input
- **Surprise Me**: One-click random prompt suggestions to spark creativity
- **Download**: Save any gallery image locally
- **Responsive UI**: Mobile-friendly layout built with Tailwind CSS

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite, React Router, Tailwind CSS |
| **Backend** | Node.js, Express |
| **Database** | MongoDB, Mongoose |
| **AI** | OpenAI DALL-E API |
| **Media** | Cloudinary |
| **Deployment** | Vercel (client), Render (server) |

## Architecture

```
┌─────────────┐     REST API      ┌─────────────┐
│   React     │ ◄──────────────► │   Express   │
│   (Vite)    │                   │   Server    │
└─────────────┘                   └──────┬──────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
              ┌──────────┐       ┌────────────┐      ┌───────────┐
              │ MongoDB  │       │  OpenAI    │      │ Cloudinary│
              │ (posts)  │       │  DALL-E    │      │ (images)  │
              └──────────┘       └────────────┘      └───────────┘
```

**Request flow (create post):**
1. User submits a prompt → backend calls DALL-E → returns base64 image
2. User confirms and shares → backend uploads image to Cloudinary
3. Post metadata (name, prompt, image URL) is saved to MongoDB
4. Gallery page fetches all posts and renders a searchable grid

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- OpenAI API key
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/aaldelaimy/AI-Image-Search.git
cd AI-Image-Search
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
MONGODB_URL=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend:

```bash
npm start
```

The API runs at `http://localhost:8080`.

### 3. Set up the client

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

> **Note:** For local development, update the API URLs in `client/src/pages/Home.jsx` and `client/src/pages/CreatePost.jsx` to point to `http://localhost:8080` instead of the production Render URL.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/post` | Fetch all community posts |
| `POST` | `/api/v1/post` | Create a post (uploads image to Cloudinary) |
| `POST` | `/api/v1/dalle` | Generate an image from a text prompt |

## Project Structure

```
AI-Image-Search/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Reusable UI (Card, FormField, Loader)
│       ├── pages/          # Home (gallery) and CreatePost
│       └── utils/          # Helpers (random prompts, image download)
└── server/                 # Express backend
    ├── mongodb/            # Database connection and Post model
    └── routes/             # postRoutes, dalleRoutes
```

## Deployment

- **Frontend:** [Vercel](https://ai-image-search-five.vercel.app) (static React build)
- **Backend:** [Render](https://ai-image-search.onrender.com) (Node.js API with environment variables for MongoDB, OpenAI, and Cloudinary)

CORS is configured on the server to allow requests from the Vercel domain and localhost during development.

## Author

[Ayoob](https://github.com/aaldelaimy)

---

Built as a portfolio project to explore AI APIs, full-stack JavaScript, and cloud deployment.
