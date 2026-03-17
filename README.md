# RB Automation - RSC Generator Web App

A React-based web application for generating Router OS configuration files (`.rsc`) from CSV data templates.

## Overview

This project automates the generation of Mikrotik RouterOS Script (`.rsc`) configuration files by processing CSV data templates through predefined RSC templates.

## Features

- 📋 CSV-based configuration template system
- 🌐 Web-based UI for easy management
- 📦 Batch file generation and download
- 🔧 Support for multiple RSC templates (MPLS, Non-MPLS, and custom configurations)

## Project Structure

```
rb-automation/
├── rsc-generator-web/        # React web application
│   ├── src/                  # React components and logic
│   ├── public/               # Static assets
│   ├── package.json          # Node.js dependencies
│   └── README.md             # Web app documentation
├── mpls.rsc                  # MPLS template
├── non-mpls.rsc              # Non-MPLS template
└── csv/                      # CSV data files (excluded from repo)
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd rb-automation
   ```

2. Install dependencies:

   ```bash
   cd rsc-generator-web
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The app will open at `http://localhost:3000`

## Usage

1. Open the web app in your browser
2. Upload or select a CSV data file
3. Choose the appropriate RSC template
4. Click "Generate" to create configuration files
5. Download the generated `.rsc` files as a ZIP archive

## CSV Format

CSV files should contain the following columns (delimiter: `;`):

- `Hostname` - Device hostname
- `Identity` - Device identity/name
- `IP Address` - IP address configuration

Example:

```
Hostname;Identity;IP Address
RO.ST.JAKARTA;RO-ST.JAKARTA;192.168.1.1
RO.ST.SURABAYA;RO-ST.SURABAYA;192.168.1.2
```

## Available Templates

- **mpls.rsc** - Configuration template for MPLS-enabled routers
- **non-mpls.rsc** - Configuration template for standard routers

## Build for Production

```bash
cd rsc-generator-web
npm run build
```

Generated files will be in the `build/` directory.

## Technologies Used

- **React** - UI framework
- **Material-UI (MUI)** - Component library
- **PapaParse** - CSV parsing
- **jszip** - ZIP file generation

## License

This project is licensed under the MIT License.

Copyright (c) 2026 achdniel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Author

achdniel
Network & Automation Engineer

GitHub: https://github.com/achdniel

Specialization:

Network Automation

MikroTik & RouterOS

Python Scripting

React-based Tools
