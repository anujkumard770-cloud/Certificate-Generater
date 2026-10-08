# CodeNova Internship Certificate Generator 🎓📜

> A powerful, 100% client-side web application to automatically generate separate, high-resolution (300–400 DPI) PDF certificates in bulk from an uploaded PNG template and Excel/CSV student spreadsheet.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Pure Vanilla JS](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![100% Client-Side](https://img.shields.io/badge/Security-100%25%20Client--Side%20(Zero%20Uploads)-success.svg)](#privacy--data-safety)
[![PDF Engine](https://img.shields.io/badge/Engine-jsPDF%20%2B%20HTML5%20Canvas-orange.svg)](https://github.com/parallax/jsPDF)

---

## ✨ Key Features

- **🖼️ Native Template Preservation**: Uses your exact uploaded PNG/JPG as the certificate background without recreating or distorting design.
- **🎯 Visual Drag-and-Drop Positioning**: Drag dynamic text fields directly on the canvas to place them exactly where you want.
- **📊 Excel & CSV Spreadsheet Support**: Auto-detects columns (`Student Name`, `Internship`, `Offer Letter`, `Issue Date`, `Start Date`, `End Date`, `Duration`, `Mode`).
- **🖨️ 300 to 400 DPI Ultra HD Print Quality**: Employs supersampling and geometric precision text rendering so certificates never pixelate or blur when zoomed or printed.
- **📄 Strictly Separate PDFs**: Generates one distinct PDF per student (**No ZIP files, no merged multi-page PDFs**).
- **🏷️ Strict Custom Naming**: Filenames follow the format: `{Student Name}-Offer-Letter.pdf` (e.g. `Neha Sharma-Offer-Letter.pdf`).
- **🔤 Advanced Typography & Formatting**: Full control over font family, font size, font weight, style, color, alignment, and letter spacing.
- **📏 Long Name Auto-Scaling**: Automatically scales down font sizes for long student names to ensure they stay on a single line within bounds.
- **💾 Local Storage Persistence**: Save and reload field positions, fonts, and layout settings across sessions.
- **🔒 100% Privacy & Offline Capable**: Zero server-side uploads or external database dependencies. All data stays securely in your browser.

---

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/certificate-generator.git
   cd certificate-generator
   ```

2. **Open in browser**:
   Simply open `index.html` in any modern web browser (Chrome, Edge, Firefox, Brave).
   
   *Or serve locally:*
   ```bash
   # Python 3
   python -m http.server 8080
   
   # Node.js (npx)
   npx serve .
   ```

---

## 📋 How It Works

1. **Upload Template**: Select your certificate template image (PNG, JPG).
2. **Upload Spreadsheet**: Upload an `.xlsx` or `.csv` containing your student records.
3. **Position Fields**: Drag and drop fields like `{{student_name}}` and `{{internship}}` on the visual certificate canvas.
4. **Tune Styles**: Customize font families, colors, sizes, alignment, and maximum width.
5. **Preview & Test**: Use the student dropdown or the Test Layout input to preview real-time results.
6. **Generate All**: Click **Generate All Certificates** to batch-produce separate, high-res PDF files.
7. **Download**: Download certificates individually or use **Download All Certificates** to sequentially save each PDF.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Modern CSS3 (CSS Variables, Flexbox, Grid), Vanilla JavaScript (ES6+)
- **Canvas Rendering**: HTML5 Canvas 2D API with High-DPI Supersampling
- **PDF Engine**: [jsPDF](https://github.com/parallax/jsPDF)
- **Data Parsers**: [SheetJS (xlsx)](https://sheetjs.com/) for Excel, [PapaParse](https://www.papaparse.com/) for CSV
- **Typography**: Curated Google Fonts (Poppins, Playfair Display, Cinzel, Montserrat, Alex Brush, etc.)

---

## 🔒 Privacy & Data Safety

This application is strictly **client-side only**.
- No backend servers.
- No analytics trackers.
- Student data, offer letters, and names never leave your computer.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
