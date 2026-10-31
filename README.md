# MDS Package Explorer

A premium, interactive web application built with **Python Flask** and plain **vanilla HTML, CSS, and JavaScript** that explores, aggregates, and organizes packages in both the **R (CRAN)** and **Python (PyPI)** ecosystems dedicated to **Multidimensional Scaling (MDS)** and related dimensionality reduction techniques.

---

## ✨ Features

- 🔍 **Dual Ecosystem Scraper & Filter**: Scrapes the CRAN package list for R MDS packages and queries the official PyPI & PyPIStats APIs for leading Python packages (`scikit-learn`, `pymds`, `umap-learn`, `pacmap`, `trimap`, `openTSNE`, etc.), complete with live search and language filtering (`All`, `R`, `Python`).
- 🔄 **Cross-Language Interoperability Guide**: Reproducible code patterns and recipes showing how to execute R's `smacof` inside Python using `rpy2`, and how to run Python's `scikit-learn` MDS inside R using `reticulate`.
- 📐 **Foundations & Theory**: Dedicated interactive section breaking down Metric MDS, Non-Metric MDS, and SMACOF Majorization algorithms with KaTeX-rendered mathematical Stress equations.
- 📚 **Literature & Books Catalog**: Curated directory of canonical MDS textbooks (Borg & Groenen, Cox & Cox, Borg & Mair, Kruskal & Wish) with direct publisher purchase links (Springer, Routledge, SAGE).
- 🧭 **Global Page Navigation Index**: Sticky left-side navigation index that tracks and highlights the active section in real-time as you scroll.
- 📦 **Local Synchronization & Workspace Relocation**: Automatically organizes workspace folders into a dedicated `mds_packages/` folder. It downloads the package source archives (`.tar.gz`), reference manuals (`.pdf`), and vignettes (tutorial code/documents) whenever a new version is detected.
- 📊 **Ecosystem Dependency Organigram & Popularity Analysis**: An interactive, animated vis.js network graph showing how packages import or depend on the core hub `smacof` engine, alongside Chart.js monthly download comparisons for both CRAN and PyPI.
- 📁 **CSV Registry & Multilingual Language Badges**: Saves versions, published dates, and check-logs into an alphabetically sorted registry visually exposed on the homepage, with explicit programming language badges (`R` and `Python`) displayed on all package cards and tables.
- 🌐 **UN Multilingual Support**: Instantly switches (without page reloads) between all **six official United Nations languages**: English, Français, Español, Русский, 简体中文, and العربية.
- ↔️ **RTL Directional Layout**: Automatically reverses layout alignments, search boxes, timelines, and sidebar controls when Right-to-Left (RTL) languages like Arabic are selected.
- 🧪 **Interactive MDS Lab**: Configure and execute real R `smacof` scaling algorithms on Euclidean distance matrices (`eurodist`, `UScitiesD`, or custom CSV uploads) directly from the browser.
- 🐦 **Mock Twitter Composer & Live Feed**: Draft tweets for package updates with character counters, post them to a mock timeline (supporting likes and retweets), or open a real Twitter intent share.

---

## 🛠️ Tech Stack

- **Backend**: Python Flask
- **Frontend**: Plain HTML5, Vanilla CSS3 (Custom properties, grid, flexbox, linear gradients), Vanilla JavaScript (ES6), KaTeX math rendering, Chart.js, Vis.js Network
- **Languages Supported**: R and Python
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
