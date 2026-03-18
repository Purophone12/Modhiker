# ModHiker 🧭

ModHiker is a high-fidelity, immersive discovery tool for Minecraft projects, inspired by the aesthetic of Cloud Hiker. It allows users to "hike" through the vast landscape of the [Modrinth](https://modrinth.com) ecosystem, discovering random mods, resource packs, shaders, and modpacks.

## Features

- **Random Discovery**: One-click exploration to find your next favorite Minecraft project.
- **Smart Filtering**: Narrow your search by project type (Mods, Resource Packs, etc.) or categories (Adventure, Magic, Tech, etc.).
- **Immersive UI**: A modern, dark-themed interface with glassmorphism effects and responsive design.
- **Direct Access**: Quick links to view the project details and download directly from Modrinth.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Modrinth API (Search and Projects_Random endpoints)
- **Build Tool**: Vite

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Development

The project uses a custom service layer (`src/services/modrinth.ts`) to handle Modrinth API interactions. When filters are applied, the app uses a random-offset search strategy to ensure a truly unpredictable discovery experience despite API limitations.

---
*Inspired by Cloud Hiker. Powered by the Modrinth Engine.*
