# Student Assessment Management System

A modern, responsive web application for managing student assessments and exams, built with Next.js 15 and React 19.

## 🚀 Features

- **Dashboard**: Responsive grid layout (1/2/3 columns) with exam cards
- **Search & Filter**: Real-time search and filtering by subject/status
- **CRUD Operations**: Create, read, update, and delete exams
- **Form Validation**: Comprehensive validation for all form fields
- **Data Persistence**: LocalStorage integration for client-side data persistence
- **Export Functionality**: Export exam data to JSON
- **Accessibility**: ARIA-compliant components, keyboard navigation, focus management
- **Dark Mode**: Full dark mode support via next-themes
- **Animations**: Smooth transitions using Framer Motion

## 📋 Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm package manager

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Theme**: next-themes for dark mode

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd grade-track
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
grade-track/
├── src/
│   ├── app/
│   │   ├── components/       # Feature components
│   │   │   ├── ExamCard.tsx  # Exam card component
│   │   │   ├── ExamForm.tsx  # Create/Edit exam form
│   │   │   ├── Sidebar.tsx   # Navigation sidebar
│   │   │   └── Topbar.tsx    # Top navigation bar
│   │   ├── providers.tsx     # Global state providers
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main dashboard page
│   ├── components/
│   │   └── ui/               # Reusable UI components
│   └── lib/
│       └── utils.ts          # Utility functions and types
├── public/                   # Static assets
└── tailwind.config.ts        # Tailwind configuration
```

## 🏛️ Architecture Decisions

### State Management
- **React Context API** was chosen over external state management libraries (Redux, Zustand) for simplicity
- Global state includes exam data and filter/search criteria
- LocalStorage sync happens in the provider for persistence

### Component Architecture
- **Separation of concerns**: UI components (`components/ui/`) are separated from feature components (`app/components/`)
- **Composition pattern**: Complex components are built from smaller, reusable primitives
- **Client-side rendering**: Used where interactivity is needed (forms, modals)

### Form Validation
- **Client-side validation** with real-time feedback
- Validation rules:
  - Required fields: Course Name, Teacher Name, Obtained Marks, Total Marks
  - Numeric constraints: Marks must be positive numbers
  - Percentage format: Must be in "XX%" format
  - Focus management: Auto-focus on first error field

### Data Persistence
- **LocalStorage** chosen for simplicity and client-side requirements
- Data is persisted on every CRUD operation
- Initial load checks for existing data in storage

### Styling Approach
- **Tailwind CSS v4**: Utility-first approach for rapid development
- **CSS Variables**: For theme customization and dark mode
- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🔑 Key Features Explained

### Exam Management
- Create new exams with comprehensive details (course, teacher, marks, date, etc.)
- Edit existing exams with pre-filled form data
- Delete exams with confirmation
- View exam details in responsive cards

### Search & Filtering
- Real-time search across course names and teacher names
- Filter by subject categories
- Combined search and filter functionality

### Export
- One-click export of all exam data to JSON format
- Downloads as `exams.json` file

## 🎯 Assumptions Made

1. **Date Input**: Simplified as text input matching the design format (e.g., "November 25, 2025") instead of a date picker for faster development
2. **Grade Now Button**: Implemented as a placeholder action without navigation, as grading functionality was not part of the requirements
3. **Mock Data**: Year and attempt counts use mock values when not explicitly provided
4. **Authentication**: Not implemented as it was not part of the requirements
5. **Backend**: All data is stored client-side; no backend/API integration
6. **Browser Support**: Optimized for modern browsers (Chrome, Firefox, Safari, Edge)

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy with default settings (no configuration needed)

### Manual Build
```bash
npm run build
npm start
```

The production build will be optimized and ready to deploy to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes with meaningful commit messages
4. Push to your branch
5. Open a pull request

## 📄 License

This project is part of a technical assessment.

---

Built with ❤️ using Next.js and React
