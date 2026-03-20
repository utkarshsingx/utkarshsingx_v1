# Utkarsh Singh - Portfolio

A modern portfolio website built with React, TypeScript, Vite, and Tailwind CSS.

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **React Scroll** - Smooth scrolling navigation

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build

```bash
npm run build
```

Output is in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Features

- **Dark/Light Mode** - Theme toggle with localStorage persistence
- **Contact Form** - Uses Formspree (free tier)
- **Responsive Design** - Mobile-first layout
- **SEO Optimized** - Open Graph, Twitter Cards, JSON-LD schema
- **Code Splitting** - Lazy-loaded sections for faster initial load

## Contact Form Setup

To enable the contact form:

1. Sign up at [Formspree](https://formspree.io/)
2. Create a new form and copy your form ID
3. In `src/Components/Contact.tsx`, replace `YOUR_FORM_ID` with your Formspree form ID:

```ts
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/your-actual-form-id';
```

## Deployment

The `dist` folder can be deployed to Vercel, Netlify, or any static hosting service.

## License

MIT
