# Shop Drawings Lookup Application

A React-based application for managing and searching shop drawings with Dropbox integration, Odoo ERP integration, and advanced calculation tools.

## 🚀 Features

- **File Management**: Upload and organize shop drawings
- **Dropbox Integration**: Seamless cloud storage integration
- **Odoo ERP Integration**: Connect with your ERP system
- **Advanced Calculations**: Built-in calculators for various products
- **PDF Preview**: View drawings directly in the browser
- **Search & Filter**: Powerful search and filtering capabilities
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: Supabase
- **File Storage**: Dropbox API
- **Build Tool**: Vite
- **Deployment**: Vercel, Netlify, Docker

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Dropbox Configuration
   VITE_DROPBOX_APP_KEY=your_dropbox_app_key
   VITE_DROPBOX_APP_SECRET=your_dropbox_app_secret

   # Odoo Configuration
   VITE_ODOO_URL=your_odoo_url
   VITE_ODOO_DB=your_odoo_database
   VITE_ODOO_USERNAME=your_odoo_username
   VITE_ODOO_PASSWORD=your_odoo_password
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 🏗️ Build

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🚀 Deployment Options

### 1. Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

Or connect your GitHub repository to Vercel dashboard for automatic deployments.

### 2. Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist/` folder to Netlify dashboard
3. Or connect your GitHub repository for automatic deployments

### 3. Docker

Build and run with Docker:

```bash
# Build the image
docker build -t shop-drawings-app .

# Run the container
docker run -p 80:80 shop-drawings-app
```

Or use Docker Compose:

```bash
# Development
docker-compose --profile dev up

# Production
docker-compose up
```

### 4. GitHub Actions

The repository includes GitHub Actions workflows for automatic deployment:

- **Vercel**: Set up `VERCEL_TOKEN`, `ORG_ID`, and `PROJECT_ID` secrets
- **Netlify**: Set up `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` secrets

## 📁 Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   │   └── products/       # Product-specific calculators
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services and calculations
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── supabase/              # Database migrations
├── .github/workflows/     # GitHub Actions
├── dist/                  # Build output
└── deployment files      # Various deployment configurations
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔌 API Endpoints

The Express.js server provides the following endpoints:

- `GET /api/health` - Health check
- `POST /api/upload` - File upload
- `GET /api/files` - List files
- `POST /api/odoo/*` - Odoo integration endpoints

## 🧮 Calculators

The application includes calculators for:

- Acoustic Louvre
- EasyMech CR
- EasyMech MR
- Guardrail
- RF Screen
- Span Plus
- Standard
- To Concrete
- To Roof
- Walkway

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_DROPBOX_APP_KEY` | Dropbox app key | Yes |
| `VITE_DROPBOX_APP_SECRET` | Dropbox app secret | Yes |
| `VITE_ODOO_URL` | Odoo server URL | Optional |
| `VITE_ODOO_DB` | Odoo database name | Optional |
| `VITE_ODOO_USERNAME` | Odoo username | Optional |
| `VITE_ODOO_PASSWORD` | Odoo password | Optional |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Build fails with "Module not found"**
   - Ensure all dependencies are installed: `npm install`
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

2. **Environment variables not working**
   - Ensure `.env` file is in the root directory
   - Restart the development server after adding new variables
   - Check that variables start with `VITE_` for client-side access

3. **Dropbox authentication fails**
   - Verify your Dropbox app credentials
   - Check redirect URLs in Dropbox app settings

4. **Supabase connection issues**
   - Verify your Supabase URL and keys
   - Check network connectivity
   - Ensure Supabase project is active

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using React, TypeScript, and modern web technologies. 