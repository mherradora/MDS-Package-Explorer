# MDS Package Explorer

A premium, interactive web application built with **Python Flask** and plain **vanilla HTML, CSS, and JavaScript** that scrapes, aggregates, and organizes R packages dedicated to **Multidimensional Scaling (MDS)** from the official R CRAN repository.

---

## ✨ Features

- 🔍 **Real-time Scraper & Filter**: Scrapes the CRAN package list, dynamically filters for MDS-related packages, and caches them for quick access.
- 📦 **Local Synchronization & Workspace Relocation**: Automatically organizes workspace folders into a dedicated `mds_packages/` folder. It downloads the package source archives (`.tar.gz`), reference manuals (`.pdf`), and vignettes (tutorial code/documents) whenever a new version is detected.
- 📊 **Ecosystem Dependency Organigram**: An interactive, animated SVG flowchart showing how packages (e.g. `smacofx`, `mdsOpt`, `asymmetry`, `MDSMap`, `pams`) import or depend on the core hub `smacof` engine.
- 📁 **CSV Registry**: Saves versions, published dates, and check-logs into an alphabetically sorted `mds_packages.csv` file, which is visually exposed on the homepage.
- 🌐 **UN Multilingual Support**: Instantly switches (without page reloads) between all **six official United Nations languages**: English, Français, Español, Русский, 简体中文, and العربية.
- ↔️ **RTL Directional Layout**: Automatically reverses layout alignments, search boxes, timelines, and sidebar controls when Right-to-Left (RTL) languages like Arabic are selected.
- 🐦 **Mock Twitter Composer & Live Feed**: Draft tweets for package updates with character counters, post them to a mock timeline (supporting likes and retweets), or open a real Twitter intent share.

---

## 🛠️ Tech Stack

- **Backend**: Python Flask
- **Frontend**: Plain HTML5, Vanilla CSS3 (Custom properties, grid, flexbox, linear gradients), Vanilla JavaScript (ES6)
- **Database / Registry**: Flat CSV, JSON caches

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- internet access (for scraping CRAN and downloading manuals/vignettes)

### Installation & Run

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/mherradora/MDS-Package-Explorer.git
   cd MDS-Package-Explorer
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install requirements (Flask):
   ```bash
   pip install flask
   ```

4. Run the application:
   ```bash
   python app.py
   ```

5. Open your browser and navigate to:
   🌐 **http://localhost:5000**

---

## 📂 Project Structure

- `app.py`: Main Flask server, scrapers, concurrent thread pools, file downloads, and mock tweet API.
- `templates/index.html`: Responsive HTML layout, modals, and tables.
- `static/css/style.css`: Theme stylesheet, animations, card layouts, and RTL alignment rules.
- `static/js/app.js`: Core client-side translation engine, timeline, modal composer, and card rendering.
- `.gitignore`: Configured to ignore pycache, local venv, local package cache, and downloads.
