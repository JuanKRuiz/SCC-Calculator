# SCC Cost Calculator 🛡️

![License](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg) ![React](https://img.shields.io/badge/react-v19.0-61DAFB?logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/typescript-v5.0-3178C6?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/vite-v6.0-646CFF?logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-v3.0-38B2AC?logo=tailwind-css&logoColor=white)

A professional cost estimation tool used to calculate and compare pricing for **Google Cloud Security Command Center (SCC)** across Premium and Enterprise tiers. This application helps architects and CISO teams project monthly costs based on workload consumption.

## ✨ Features

- **Detailed Cost Breakdown**: Granular estimation for Compute Engine, GKE (Standard/Autopilot), Cloud SQL, BigQuery, and Cloud Storage.
- **Model Armor Support**: Specialized calculator for GenAI security costs (based on 1k ops/prompts).
- **Tier Comparison**: Automatic comparison between "Pay-as-you-go" (Premium) and "Enterprise" (Subscription) models, with smart recommendations based on volume ($25k+ threshold).
- **Internationalization 🌍**: Complete support for **English**, **Spanish**, and **Portuguese**.
- **Data Privacy**: 100% client-side execution. No data is sent to external servers.
- **Export Capabilities**: Generate detailed CSV reports for business cases.
- **Demo Mode**: One-click population of demo data to explore capabilities.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Testing**: [Vitest](https://vitest.dev/)

## 🏗️ Architecture

The calculator uses object-oriented design patterns (Strategy, Factory, Facade) to efficiently handle **14 Google Cloud services** with only **6 calculator classes** and **7 billing rates**.

📖 **See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation** including:
- Mermaid diagram showing service → calculator → rate mappings
- Explanation of design patterns used
- How to add new services
- Testing strategy

**Key Benefits:**
- ✅ **DRY**: 7 services share the same `ComputeCostCalculator` logic
- ✅ **Testable**: 31 unit tests protect calculation logic
- ✅ **Maintainable**: Update 1 rate → affects multiple services automatically
- ✅ **Extensible**: Add new service types without duplicating code

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.0.0 or higher is required.
- **Package Manager**: `npm` (v9+) or `pnpm` (v8+).
- **Git**: For version control.

### 💻 Local Development Setup

Follow these steps to get the environment running on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/scc-cost-calculator.git
   cd scc-cost-calculator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # OR if using pnpm
   pnpm install
   ```

3. **Environment Configuration:**
   Copy the example environment file (if available) or create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *(Note: This project currently runs client-side simulation, so no complex API keys are strictly mandated for the base version).*

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   
   Access the app at: `http://localhost:3000`

### 🏗️ Building for Production

To create an optimized production build:

1. **Compile the project:**
   ```bash
   npm run build
   ```

2. **Preview the build:**
   ```bash
   npm run preview
   ```

The build artifacts will be generated in the `dist/` directory, ready for deployment to Vercel, Netlify, or GitHub Pages.

## 📂 Project Structure

The project follows a flattened structure for simplicity and ease of maintenance:

```
scc-cost-calculator/
├── components/         # UI Components (InputRow, CostCharts, etc.)
├── services/          # API Services (Pricing simulation)
├── App.tsx            # Main Application Component
├── LanguageContext.tsx # I18n Context Provider
├── translations.ts    # Dictionary for ES, EN, PT
├── types.ts           # Type definitions and interfaces
└── ...config files    # Vite, TypeScript, Tailwind configs
```

## 🤝 Contribution

Contributions are welcome! We want to make this the standard for SCC estimation.

Please read our **[Contributing Guidelines](CONTRIBUTING.md)** for details on how to report issues and the process for submitting pull requests.


Also check out our **[Technical FAQ](FAQ.md)** for more context on the architecture and design decisions.

## 📄 License

Distributed under the Creative Commons Attribution 4.0 International License (CC BY 4.0). See `LICENSE` for more information.
