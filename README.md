# NGO Learning Management System

A modern Learning Management System (LMS) for NGOs, built with React, TypeScript, Vite, and Tailwind CSS. Features authentication, course management, and user progress tracking.

## Features

- User authentication (admin & student roles)
- Course creation, enrollment, and management
- Progress tracking for enrolled courses
- Responsive dashboard UI
- Built with React, TypeScript, Vite, Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

1. Install dependencies:
   ```sh
   npm install
   ```

2. Start the development server:
   ```sh
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Demo Credentials

- **Admin:**  
  Email: `admin@ngo.org`  
  Password: `admin123`

- **Student:**  
  Email: `student@example.com`  
  Password: `student123`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
  components/      # React components (Dashboard, Login, CourseCard, etc.)
  contexts/        # React context providers (Auth, Course)
  types/           # TypeScript types
  App.tsx          # Main app component
  main.tsx         # Entry point
  index.css        # Tailwind CSS
public/
  index.html       # Main HTML file
```

## Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## License

MIT
