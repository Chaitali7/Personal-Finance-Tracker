# Personal Finance Visualizer

A modern web application for tracking personal finances, built with Next.js, MongoDB, and TypeScript.

## Features

- Transaction Management (Add, Edit, Delete)
- Category-wise Expense and Income Tracking
- Monthly Budget Management
- Interactive Dashboard with Summary Cards
- Pie Charts for Category Distribution
- Recent Transactions List

## Tech Stack

- Frontend: Next.js 14, React, TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- Database: MongoDB
- Charts: Recharts
- Styling: Tailwind CSS, Shadcn UI

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd finance-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `MONGODB_URI`: MongoDB connection string

## Deployment

This application is deployed on Vercel. For deployment:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Project Structure

```
src/
├── app/                # Next.js app directory
│   ├── api/           # API routes
│   └── page.tsx       # Main page
├── components/        # React components
├── lib/              # Utility functions
└── models/           # MongoDB models
```

## Development

To add new features or modify existing ones:

1. Create new components in `src/components/`
2. Add new API routes in `src/app/api/`
3. Update the MongoDB models in `src/models/`
4. Modify the main page in `src/app/page.tsx`

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

MIT
