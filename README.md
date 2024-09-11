![image](https://github.com/user-attachments/assets/7ff1af12-8ee1-422b-b739-266ef1df33cf)


# 🚀 Decentralized To-Do & NFT Rewards

<p align="center">
  <em>⚡ Powered by Modemobile ⚡</em>
</p>

<div align="center">

![TypeScript](https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=2F73BF)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Next.js](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![TurboRepo](https://img.shields.io/badge/Turborepo-2.0.14-orangered?logo=turborepo&link=https%3A%2F%2Fgithub.com%2Fvercel%2Fturbo%2Freleases%2Ftag%2Fv2.0.14)
![Shadcn/UI](https://img.shields.io/badge/Shadcn%2FUI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

</div>

## 📚 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Scaffolding and Architecture](#-scaffolding-and-architecture)
- [Local Setup](#️-local-setup)

## 📋 Project Overview

Welcome to the future of task management! Our Decentralized To-Do app combines productivity with blockchain technology, offering a unique and engaging experience.

### 🌟 Key Features

1. **📝 Task Management**

   - Create, organize, and track your daily tasks effortlessly
   - Intuitive user interface for seamless task handling

2. **🏆 NFT Rewards System**

   - Complete tasks to earn unique NFTs
   - Each NFT represents your achievements and productivity milestones

3. **🖼️ NFT Gallery**

   - Showcase your earned NFTs in a personalized digital gallery
   - Watch your collection grow as you accomplish more tasks

4. **🔥 NFT Burning Mechanism**
   - Option to burn NFTs for special effects or rewards
   - Adds an element of strategy and decision-making to your productivity

## 💻 Tech Stack

Our project leverages a powerful and modern tech stack:

- **Turborepo**: Monorepo management for high-performance build system
- **React**: Frontend library for building user interfaces
- **Next.js**: React framework for server-side rendering and static site generation
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **TypeScript**: Typed superset of JavaScript for enhanced developer experience
- **Express**: Fast, unopinionated, minimalist web framework for Node.js
- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine
- **Wagmi**: React Hooks library for Ethereum
- **RainbowKit**: React library for adding wallet connection to dApps

This combination provides a robust, scalable, and efficient foundation for our decentralized application, ensuring a smooth user experience and developer workflow.

## 🧱 Scaffolding and Architecture

![image](https://github.com/user-attachments/assets/36f366bd-f736-43f7-bde3-ef70ad6280bf)

Our project embraces the powerful concept of a `monorepo`, providing a unified and efficient development experience. This architecture allows us to manage all related code—from APIs to shared packages and web applications—within a single repository, fostering code reuse and maintaining consistency across the project.

```
monorepo
├── apps
│   ├── api
│   └── web
└── packages
    ├── common
    ├── eslint-config
    ├── types
    ├── typescript-config
    └── ui
```

### 💾 App - `api`

The `api` app serves as the backend for our project, handling server-side logic, database interactions, and API endpoints. Built with Express and Node.js, it provides a robust foundation for managing tasks, NFT rewards, and user data, ensuring seamless communication between the frontend and blockchain.

### 🖼️ App - `web`

The `web` app is the frontend of our project, built with React and Next.js. It provides a responsive and intuitive user interface for interacting with the task management system, NFT rewards, and digital gallery. This app communicates with the `api` backend and integrates with blockchain technologies for NFT functionality.

#### 🔐 Authentication

User authentication is handled securely using Ethereum signatures, providing a decentralized and robust security model.

#### 🎨 Styling

Tailwind CSS is used throughout the application, allowing for rapid development and easy customization of UI components.

#### 🔧 Best Practices

- Server-side rendering for improved SEO and initial load times
- Code splitting and lazy loading for optimal performance
- Responsive design principles for seamless mobile and desktop experiences
- Type safety with TypeScript
- Modular architecture for easy maintenance and scalability
- Components are created according to [Atomic Design](https://medium.com/@janelle.wg/atomic-design-pattern-how-to-structure-your-react-application-2bb4d9ca5f97) principles

### 🛠️ Package - `common`

The `common` package contains shared functionalities, utilities, and components that are used across multiple apps within the monorepo. This centralized approach promotes code reuse, maintains consistency, and simplifies updates across the project. It includes common types, helper functions, and shared business logic that can be imported and utilized by both the `api` and `web` apps, ensuring a unified codebase and reducing duplication of effort.

### 🛠️ Package - `types`

The `types` package contains shared TypeScript type definitions and interfaces used across the monorepo. It ensures type consistency and enhances code quality by providing a centralized location for common data structures, API responses, and other shared types used in both the `api` and `web` apps.

### 🛠️ Package - `ui`

The `ui` package houses a collection of reusable React components built with shadcn. This package serves as a centralized component library, ensuring consistency in design and functionality across the project. By leveraging shadcn's accessible and customizable components, this library provides a robust set of UI elements that can be easily integrated into various parts of the web application, promoting a cohesive user interface and streamlining the development process while maintaining high standards of accessibility and design.

## 🏃‍♂️ Local Setup

To set up the project locally, follow these steps:

1. Clone the repository and navigate to the project directory:

   ```
   git clone https://github.com/ftarantuviez/Web3-ToDo.git
   cd Web3-ToDo
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Copy the environment variables:

   ```
   cp ./apps/web/.env.example ./apps/web/.env.local
   ```

4. Start the development servers:
   ```
   pnpm run dev
   ```
   or
   ```
   turbo dev
   ```

This will start both the API server and the web application:

- API server will be running on `http://localhost:7979`
- Web application will be available at `http://localhost:3000`

You can now access the web application in your browser and the API server will be ready to handle requests.
