# RunBD Car Gallery & Watermark Studio

Professional, high-performance web application designed for car dealerships, importers, and automotive photographers in Bangladesh to automatically brand and watermark vehicle photos in batches.

---

## ✨ Key Features

1. **Batch Multi-Image Drag & Drop**: Upload dozens of car photos simultaneously and apply professional watermarks instantly.
2. **Smart Auto-Tone Detection**: Automatically analyzes each car image's luminance/brightness to apply the correct watermark styling.
3. **Dual Theme Styles (Light & Dark Photo Modes)**: Toggle between `Smart Auto`, `Light Photo`, and `Dark Photo` modes to ensure crystal-clear visibility on both light and dark vehicle shots.
4. **Professional Branding Layout**:
   - **Top**: Official RunBD branding logo with frosted glass backdrop (adjustable alignment: Left, Center, Right).
   - **Bottom**: Dual badges for **"📱 Download the Run BD App"** and **"🌐 www.runbd.org"**.
5. **Bilingual Support (English & Bengali)**: Instant language toggle between English and Bengali (`বাংলা`) for the entire user interface.
6. **High-Resolution HTML5 Canvas Processing**: Merges base car images and branding overlays at original resolution with zero quality loss.
7. **Instant & Batch Downloads**: Download individual processed photos or click **"Download All"** to batch download your branded gallery.
8. **Vercel Speed Insights**: Integrated performance monitoring for lightning-fast user experience.

---

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **Graphics Engine**: HTML5 Canvas API
- **Icons**: Lucide React
- **Performance**: `@vercel/speed-insights`
- **Build Tool**: Vite

---

## 🚀 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser at `http://localhost:3000`.

---

## 📦 Deployment (Vercel)

This project includes a pre-configured `vercel.json` and `.npmrc` to ensure smooth deployments on Vercel:
1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Vercel will automatically detect Vite and use `npm run build` with output directory `dist`.
