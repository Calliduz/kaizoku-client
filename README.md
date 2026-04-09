<div align="center">

# 🏴‍☠️ Kaizoku

**A sleek, high-performance anime streaming client powered by dynamic scraping.**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Status-Beta-orange?style=for-the-badge)]()

![Project Preview](./kaizoku_preview_1775730767503.png)

</div>

---

## 🌟 Overview

**Kaizoku** (海賊 - *Pirate*) is a modern web application designed for the ultimate anime viewing experience. It bridges the gap between various content sources and a premium user interface, allowing users to discover, track, and stream their favorite anime seamlessly.

By utilizing advanced scraping techniques, Kaizoku aggregates high-quality metadata and streaming sources from across the web, presenting them in a unified, ad-free, and blazing-fast interface.

## ✨ Key Features

- 🎬 **Seamless Streaming**: Full HLS playback support for smooth, high-quality video.
- 🔍 **Dynamic Discovery**: Instant access to a vast library of anime via powerful search and scraping.
- ⚡ **Blazing Fast**: Built with **Vite** and **React** for near-instant load times and fluid transitions.
- 🖼️ **Premium UI**: Modern dark theme with lazy-loaded images for a polished aesthetic.
- 📱 **Responsive Design**: Optimized for a great experience across all device sizes.

## 🛠️ Tech Stack

- **Frontend Framework**: [React](https://react.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Video Playback**: [HLS.js](https://github.com/video-dev/hls.js/)
- **API Communication**: [Axios](https://axios-http.com/)
- **Image Handling**: [react-lazy-load-image-component](https://www.npmjs.com/package/react-lazy-load-image-component)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/kaizoku-client.git
   cd kaizoku-client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your backend API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## ⚖️ Disclaimer

> [!IMPORTANT]
> **This project is for educational and research purposes only.**
>
> Kaizoku is a frontend client that interacts with third-party web scrapers. It does **not** host, store, or distribute any media files or copyrighted content. The application simply provides a user interface to display information and links found publicly on the internet.
>
> The developers of Kaizoku are not responsible for how the software is used, nor for the content accessed through external scraping engines. Users should comply with their local laws and the terms of service of the content providers.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
