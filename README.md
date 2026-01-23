# VinFast Dashboard - VF9 Club Edition

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node.js](https://img.shields.io/badge/Node.js-23%2B-green)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

---

## 🔄 **Status Update** (January 2026)

> **Dashboard is back online!** The X-HASH authentication issue has been resolved.
>
> ✅ **What changed?** API authentication is now working properly.
> ⚠️ **Important limitation**: SOH (State of Health) battery data is **no longer available** in the API response.
> 📚 **Documentation**: API documentation and technical reports remain available for reference.
> 🎯 **For details**: See [SUNSET.md](./SUNSET.md) and [API Documentation](./docs/api/)

**The dashboard is functional again, but SOH (battery health) data is no longer provided by the API.**

---

## 📖 Introduction

This project is an open-source dashboard designed specifically for VinFast EV owners. It leverages the vehicle's telemetry data to provide a "Digital Twin" experience, offering real-time insights into battery health, charging status, tire pressure, and environmental conditions.

Our goal is to create a UI that matches the premium quality of the car itself—clean, modern, and informative.

## ✨ Features

- **Digital Twin Visualizer**: Accurate representation of vehicle status including doors, locks, and tires.
- **Mobile-First Experience**: Optimized specifically for phone screens with zero scrollbars, fixed viewports, and touch-friendly layouts.
- **Real-time Telemetry**: Monitoring of Battery SOC, Range, Power consumption, and Charging time.
- **Safety Monitor**: Integrated alerts for Tire Pressure (TPMS), Door Ajar, and Intrusion.
- **System Health**: Overview of ECU versions (BMS, Gateway, MHU) and FOTA updates.
- **Responsive Design**: A "Bento Grid" layout that adapts seamlessly from Desktop to Mobile.

## 🛠 Tech Stack

- **Core**: React (Vite/Astro), Tailwind CSS, Nanostores.
- **API**: Serverless Proxy (Astro SSR) for CORS & Rate Limiting.
- **Integration**: Official/Reverse-Engineered VinFast API.

## 🚀 Quick Start

You can get the whole system running in minutes.

### Prerequisites

- Node.js v22 or later
- A VinFast Connected Car Account

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/VF9-Club/VFDashboard.git
    cd VFDashboard
    ```

2.  **Start the Dashboard**:
    ```bash
    npm install
    npm run dev
    ```
    _Dashboard will open at `http://localhost:4321`_

### Deployment

To deploy the dashboard to Cloudflare Pages:

```bash
npm run deploy
```

_Note: Requires Cloudflare authentication (`npx wrangler login`)._

## ⚠ Disclaimer

**This software is not affiliated with, endorsed by, or connected to VinFast Auto or its subsidiaries.**  
It is an unofficial, open-source project created by the community for educational and personal use. Use at your own risk.

## 📸 Screenshots

### Dashboard (PC / Tablet)

![Dashboard Preview](docs/assets/dashboard_preview.webp)

### Mobile & Detail View

<div style="display: flex; gap: 20px; flex-wrap: wrap;">
  <img src="public/mobile-vf3.webp" alt="Mobile Dashboard - VF3" width="300" />
  <img src="public/mobile-vf9-energy.webp" alt="Mobile Dashboard - VF9 Energy" width="300" />
</div>

## 🤝 Contributing

We welcome contributions from the community!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 🙏 Acknowledgments

This project was developed based on inspiration and valuable technical documentation regarding APIs from the [**VinFast Owners**](https://vinfastowners.org/) community. We sincerely thank the team at [VinFast Owners Community](https://github.com/vinfastownersorg-cyber/vinfastowners) for their foundational contributions to this open-source ecosystem.

For users prioritizing privacy and data sovereignty, we recommend the **Self-hosted** version maintained by the **VinFast Owners - North America** community.

This fork is optimized for local deployment (Docker/npm) and features:
- 🔒 **Enhanced Privacy**: Credentials never leave your hardware; strictly local execution.
- 📊 **Advanced Analytics**: 30-day battery history charts and data export (CSV/JSON).
- 🌍 **Localization**: Support for Imperial/Metric units and Multi-language (English/French/Vietnamese).
- 🛠️ **Docker Ready**: Easy setup with a provided `docker-compose` configuration.

👉 Check it out here: [VinFast Dashboard - Self-hosted Fork](https://github.com/vinfastownersorg-cyber/VFDashboard)

We warmly welcome all VinFast owners and technology enthusiasts to join us in contributing and sharing to build a strong, united, and borderless community!

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

_Built with ❤️ by VF9 Club Vietnam_
