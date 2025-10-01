<div align="center">

  <img src="https://raw.githubusercontent.com/sahebkhadem/risto/refs/heads/master/public/img/logo.webp" alt="Risto Logo" width="200" />

  ### A Modern Anime Tracker for Enthusiasts
  
  Track, organize, and manage your anime watchlist with a beautiful, intuitive interface.
  
  [![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://risto-peach.vercel.app/)
  [![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
  
</div>

---

## 🚀 Tech Stack

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

## ✨ Features

- 📺 **Anime Tracking** - Keep track of anime you're watching, completed, or planning to watch
- 🔐 **Authentication System** - Secure user authentication with email verification
- 🎨 **Modern UI** - Clean and responsive design built with Tailwind CSS v4 and shadcn/ui components
- 🔍 **Search & Filter** - Quickly find anime in your collection
- 📊 **Progress Tracking** - Monitor your watching progress and statistics
- 🌙 **Dark Mode** - Eye-friendly interface for late-night binge sessions
- 📱 **Fully Responsive** - Seamless experience across all devices
- ⚡ **Fast & Reliable** - Built on Next.js 15 with optimized performance
- ✅ **Type-Safe Forms** - Form validation powered by React Hook Form and Zod

## 🎯 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** / **yarn** / **pnpm** / **bun**
- **MongoDB** database instance

### Installation

1. **Clone the repository**
	```bash
	git clone https://github.com/sahebkhadem/risto.git
	cd risto
	```

2. **Install dependencies**
	```bash
	npm install
	# or
	yarn install
	# or
	pnpm install
	# or
	bun install
	```

3. **Set up environment variables**
	
	Copy the example environment file:
	```bash
	cp .env.example .env.local
	```
	
	Or use the automated setup script:
	```bash
	npm run setup-env
	```
	
	Then edit `.env.local` and fill in your actual values:
	```env
	# MongoDB connection string (Prisma needs this)
	DATABASE_URL="mongodb+srv://<YOUR_USERNAME>:<YOUR_PASSWORD>@<YOUR_CLUSTER>.mongodb.net/<YOUR_DATABASE>?retryWrites=true&w=majority"
	
	# Email provider / Resend API key
	RESEND_API_KEY="your_resend_api_key_here"
	
	# Base URL used in verification emails / links
	NEXT_PUBLIC_APP_URL="http://localhost:3000"
	
	# Cookie/session settings
	SESSION_COOKIE_NAME="session_token"
	
	# Node environment
	NODE_ENV="development"
	```

4. **Initialize Prisma**
	```bash
	npx prisma generate
	npx prisma db push
	```

5. **Run the development server**
	```bash
	npm run dev
	# or
	yarn dev
	# or
	pnpm dev
	# or
	bun dev
	```

6. **Open your browser**
	
	Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
risto/
├── prisma/                           # Prisma schema and migrations
│   └── schema.prisma                 # Database schema
├── scripts/                          # Project scripts (e.g. .env setup)
│   └── create-env.js                 # Example: setup placeholder .env file
├── src/
│   ├── app/                          # Next.js 15 App Router
│   │   ├── api/                      # API routes
│   │   │   ├── auth/                 # Auth endpoints (login, register, etc.)
│   │   │   ├── users/                # User-related endpoints
│   │   │   └── ...                   # Other API routes
│   │   ├── page.tsx                  # Application home page
│   │   └── layout.tsx                # Root layout
│   │
│   ├── assets/                       # Static assets (images, icons, fonts, etc.)
│   │   └── fonts/           
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── anime-dialog/             # Anime dialog
│   │   └── ...                       # Other reusable components
│   │
│   ├── emails/                       # Email templates
│   │   ├── VerificationEmail.tsx     # Email verification template
│   │   ├── PasswordResetEmail.tsx    # Password reset template
│   │   └── ...               
│   │
│   ├── generated/                    # Generated Prisma client
│   │   └── ...               
│   │
│   ├── hooks/                        # Custom React hooks
│   │   └── useDebounce.ts            # Example: debounce hook for searching          
│   │
│   ├── lib/                          # Utility functions and configs
│   │   ├── prisma.ts                 # Prisma client
│   │   ├── utils.ts                  # General helper functions
│   │   ├── session.ts                # Session utilities
│   │   └── ...               
│   │
│   ├── store/                        # State management (Zustand)
│   │   ├── useAuthStore.ts           # Example auth store
│   │   └── ...               
│   │
│   └── types/                        # TypeScript types
│       ├── Animets                   # Anime type for Jjikan API response
│       └── ...               
│
└── public/                           # Public static assets (served directly)
    └── img
	     └── logo.webp                # App logo
```

## 🛠️ Built With

### Core Technologies
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with modern features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM

### UI & Styling
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

### State & Forms
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[React Hook Form](https://react-hook-form.com/)** - Performant form handling
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Authentication & Email
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Password hashing
- **[Resend](https://resend.com/)** - Modern email API
- **[@react-email/components](https://react.email/)** - Email template components

### Developer Experience
- **[Jest](https://jestjs.io/)** - JavaScript testing framework
- **[ESLint](https://eslint.org/)** - Code linting
- **[Vercel](https://vercel.com/)** - Deployment and hosting

## 🎨 Key Technologies Explained

### Next.js 15 App Router
Leverages the latest features including:
- Server Components for improved performance
- Streaming and Suspense support
- Enhanced routing capabilities
- Built-in optimization features

### Tailwind CSS v4
Provides:
- Modern utility classes
- Just-in-Time compilation
- Custom design system
- Responsive design utilities

### Prisma ORM
Offers:
- Type-safe database queries
- Auto-generated TypeScript types
- Easy database migrations
- Intuitive data modeling

## 🚀 Deployment

The application is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables
4. Deploy with a single click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sahebkhadem/risto)

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Generate Prisma client and build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run setup-env    # Automated environment setup with placeholders
npm run test         # Run Jest tests
npm run test:watch   # Run Jest tests in watch mode
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built using modern web technologies
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Hosted on [Vercel](https://vercel.com/)

## 📧 Contact

**Saheb Khadem** - [GitHub](https://github.com/sahebkhadem)

**Project Link:** [https://github.com/sahebkhadem/risto](https://github.com/sahebkhadem/risto)

**Live Demo:** [https://risto-peach.vercel.app/](https://risto-peach.vercel.app/)

---

<div align="center">
  Made by Saheb Khadem
</div>