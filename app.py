import os
import csv
import json
import urllib.request
import re
import shutil
import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

WORKSPACE_DIR = "/home/michael-herradora/agy2-projects/smacof_review"
MDS_PACKAGES_DIR = os.path.join(WORKSPACE_DIR, "mds_packages")
CSV_PATH = os.path.join(WORKSPACE_DIR, "mds_packages.csv")
CACHE_FILE = os.path.join(WORKSPACE_DIR, "cran_cache.json")
TWEETS_FILE = os.path.join(WORKSPACE_DIR, "tweet_history.json")
CRAN_URL = "https://cran.r-project.org/web/packages/available_packages_by_name.html"

# List of the 16 identified MDS packages to strictly handle
MDS_PACKAGE_NAMES = [
    "asymmetry", "bayMDS", "bigmds", "bios2mds", "DistatisR", "fmds",
    "focusedMDS", "lmds", "MDSGUI", "MDSMap", "mdsOpt", "MDSPCAShiny",
    "pams", "semds", "smacof", "smacofx"
]

def load_csv_versions():
    """Loads package versions and published dates from the CSV file."""
    pkg_data = {}
    if os.path.exists(CSV_PATH):
        try:
            with open(CSV_PATH, mode='r', encoding='utf-8') as f:
                reader = csv.reader(f)
                header = next(reader, None)
                if header and header[0].lower() == "package":
                    # Adapt to older/newer CSV headers
                    header_lower = [h.lower() for h in header]
                    has_published = "published" in header_lower
                    pub_idx = header_lower.index("published") if has_published else -1
                    ver_idx = header_lower.index("version") if "version" in header_lower else 1
                    
                    for row in reader:
                        if len(row) > max(ver_idx, pub_idx):
                            pkg_name = row[0]
                            version = row[ver_idx]
                            published = row[pub_idx] if has_published and pub_idx < len(row) else "Unknown"
                            pkg_data[pkg_name] = {
                                "version": version,
                                "published": published
                            }
        except Exception as e:
            print(f"Error reading CSV: {e}")
    return pkg_data

def save_csv_versions(pkg_data):
    """Saves package versions and published dates to the CSV file."""
    try:
        sorted_data = sorted(pkg_data.items())
        with open(CSV_PATH, mode='w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(["Package", "Version", "Published", "LastChecked"])
            now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            for pkg, data in sorted_data:
                writer.writerow([pkg, data["version"], data["published"], now_str])
        print(f"CSV updated successfully at {CSV_PATH}")
    except Exception as e:
        print(f"Error writing CSV: {e}")

def download_file(url, dest_path):
    """Downloads a file from a URL to a local destination path."""
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=15) as response:
        with open(dest_path, "wb") as f:
            f.write(response.read())

def sync_package(pkg, csv_data):
    """Scrapes a single package page, relocates folder, downloads new files if version mismatch."""
    pkg_name = pkg["name"]
    pkg_id = pkg["id"]
    
    existing_pkg = csv_data.get(pkg_name, {})
    existing_version = existing_pkg.get("version")
    existing_published = existing_pkg.get("published", "Unknown")
    
    pkg_url = f"https://cran.r-project.org/web/packages/{pkg_id}/index.html"
    req = urllib.request.Request(pkg_url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            html = response.read().decode('utf-8', errors='ignore')
            
            # Extract CRAN version
            version_match = re.search(r'<td>Version:</td>\s*<td>(.*?)</td>', html, re.DOTALL)
            if not version_match:
                print(f"[{pkg_name}] Version info not found on page.")
                return pkg_name, existing_version, existing_published, "No version found"
            
            version = version_match.group(1).strip()
            
            # Extract CRAN published date
            published_match = re.search(r'<td>Published:</td>\s*<td>(.*?)</td>', html, re.DOTALL)
            published = published_match.group(1).strip() if published_match else "Unknown"
            
            dest_pkg_dir = os.path.join(MDS_PACKAGES_DIR, pkg_name)
            
            # Relocate existing workspace root folder if exists
            root_pkg_dir = os.path.join(WORKSPACE_DIR, pkg_name)
            if os.path.exists(root_pkg_dir) and root_pkg_dir != dest_pkg_dir:
                print(f"[{pkg_name}] Relocating root folder {root_pkg_dir} -> {dest_pkg_dir}")
                os.makedirs(MDS_PACKAGES_DIR, exist_ok=True)
                if os.path.exists(dest_pkg_dir):
                    shutil.rmtree(dest_pkg_dir, ignore_errors=True)
                shutil.move(root_pkg_dir, dest_pkg_dir)
            
            # Download files if version is new/different
            status = "Up to date"
            if version != existing_version:
                print(f"[{pkg_name}] New version detected: {version} (was: {existing_version}). Downloading files...")
                os.makedirs(dest_pkg_dir, exist_ok=True)
                
                # 1. Download source package (.tar.gz)
                src_url = f"https://cran.r-project.org/src/contrib/{pkg_name}_{version}.tar.gz"
                src_dest = os.path.join(dest_pkg_dir, f"{pkg_name}_{version}.tar.gz")
                try:
                    download_file(src_url, src_dest)
                except Exception as e:
                    print(f"[{pkg_name}] Failed to download source: {e}")
                
                # 2. Download Reference Manual (.pdf)
                pdf_url = f"https://cran.r-project.org/web/packages/{pkg_name}/{pkg_name}.pdf"
                pdf_dest = os.path.join(dest_pkg_dir, f"{pkg_name}.pdf")
                try:
                    download_file(pdf_url, pdf_dest)
                except Exception as e:
                    print(f"[{pkg_name}] Failed to download manual: {e}")
                
                # 3. Find and download vignettes
                vignettes = re.findall(r'href="(vignettes/[^"]+)"', html)
                for vig_rel in vignettes:
                    vig_rel = re.sub(r'<[^>]+>', '', vig_rel).strip()
                    vig_url = f"https://cran.r-project.org/web/packages/{pkg_name}/{vig_rel}"
                    vig_dest = os.path.join(dest_pkg_dir, vig_rel)
                    try:
                        download_file(vig_url, vig_dest)
                    except Exception as e:
                        print(f"[{pkg_name}] Failed to download vignette {vig_rel}: {e}")
                        
                status = f"Updated to {version}"
            
            return pkg_name, version, published, status
            
    except Exception as e:
        print(f"Error syncing package {pkg_name}: {e}")
        return pkg_name, existing_version, existing_published, f"Sync error: {e}"

def run_global_sync():
    """Performs the full CRAN scraping, folder relocation, and downloads for all MDS packages."""
    print("Initiating global MDS package sync...")
    
    # 1. Scrape the main CRAN page to get list of packages & descriptions
    req = urllib.request.Request(CRAN_URL, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            html = response.read().decode('utf-8', errors='ignore')
            
            pattern = r'<td><a href="\.\./\.\./web/packages/([^/]+)/index\.html"><span class="CRAN">([^<]+)</span></a></td><td>(.*?)</td>'
            matches_all = re.findall(pattern, html, re.DOTALL)
            
            packages = []
            for pkg_id, pkg_name, desc in matches_all:
                if pkg_name in MDS_PACKAGE_NAMES:
                    desc_clean = re.sub(r'<[^>]+>', '', desc).strip().replace('\n', ' ')
                    packages.append({
                        "id": pkg_id,
                        "name": pkg_name,
                        "description": desc_clean,
                        "url": f"https://cran.r-project.org/web/packages/{pkg_id}/index.html"
                    })
            
            # Save raw metadata to cache file
            with open(CACHE_FILE, "w", encoding="utf-8") as f:
                json.dump(packages, f, indent=4)
                
    except Exception as e:
        print(f"Error scraping main CRAN page: {e}")
        # Load from cache if scrape fails
        if os.path.exists(CACHE_FILE):
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                packages = json.load(f)
        else:
            return False, f"Could not scrape CRAN or read cache: {e}"
            
    # 2. Relocate folders from root workspace to mds_packages/
    os.makedirs(MDS_PACKAGES_DIR, exist_ok=True)
    for pkg_name in MDS_PACKAGE_NAMES:
        root_pkg_dir = os.path.join(WORKSPACE_DIR, pkg_name)
        dest_pkg_dir = os.path.join(MDS_PACKAGES_DIR, pkg_name)
        if os.path.exists(root_pkg_dir) and root_pkg_dir != dest_pkg_dir:
            print(f"Startup relocation: {root_pkg_dir} -> {dest_pkg_dir}")
            if os.path.exists(dest_pkg_dir):
                shutil.rmtree(dest_pkg_dir, ignore_errors=True)
            try:
                shutil.move(root_pkg_dir, dest_pkg_dir)
            except Exception as e:
                print(f"Relocation failed for {pkg_name}: {e}")

    # 3. Fetch CSV versions
    csv_data = load_csv_versions()
    updated_data = csv_data.copy()
    
    # 4. Perform package syncing concurrently using thread pool
    print(f"Syncing {len(packages)} packages concurrently...")
    sync_results = {}
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(sync_package, pkg, csv_data): pkg for pkg in packages}
        for future in as_completed(futures):
            pkg_name, ver, pub, status = future.result()
            if ver:
                updated_data[pkg_name] = {
                    "version": ver,
                    "published": pub
                }
            sync_results[pkg_name] = status
            
    # 5. Write updated versions back to CSV
    save_csv_versions(updated_data)
    print("Sync complete. Results:", sync_results)
    return True, None

def get_enhanced_packages_list():
    """Loads packages details and appends version, published date, and download status."""
    if not os.path.exists(CACHE_FILE):
        run_global_sync()
        
    try:
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            packages = json.load(f)
    except Exception:
        packages = []
        
    csv_data = load_csv_versions()
    
    enhanced = []
    for pkg in packages:
        pkg_name = pkg["name"]
        pkg_info = csv_data.get(pkg_name, {})
        version = pkg_info.get("version", "Unknown")
        published = pkg_info.get("published", "Unknown")
        
        # Check local files availability
        local_dir = os.path.join(MDS_PACKAGES_DIR, pkg_name)
        downloaded = os.path.exists(local_dir)
        
        # Build document files inventory
        docs = []
        if downloaded:
            for root, dirs, files in os.walk(local_dir):
                for file in files:
                    rel_path = os.path.relpath(os.path.join(root, file), MDS_PACKAGES_DIR)
                    docs.append(rel_path)
                    
        enhanced.append({
            "id": pkg["id"],
            "name": pkg_name,
            "description": pkg["description"],
            "url": pkg["url"],
            "version": version,
            "published": published,
            "downloaded": downloaded,
            "local_path": f"mds_packages/{pkg_name}",
            "documents": sorted(docs)
        })
        
    return enhanced

def load_tweet_history():
    """Loads tweet history from JSON file."""
    if os.path.exists(TWEETS_FILE):
        try:
            with open(TWEETS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_tweet(tweet):
    """Saves a new tweet to history."""
    history = load_tweet_history()
    history.insert(0, tweet)
    with open(TWEETS_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=4)

# Run synchronization once upon server loading
try:
    run_global_sync()
except Exception as startup_err:
    print(f"Startup synchronization encountered an error: {startup_err}")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/packages", methods=["GET"])
def get_packages():
    packages = get_enhanced_packages_list()
    return jsonify({"success": True, "packages": packages})

@app.route("/api/refresh", methods=["POST"])
def refresh_packages():
    success, error = run_global_sync()
    if not success:
        return jsonify({"success": False, "error": error}), 500
    packages = get_enhanced_packages_list()
    return jsonify({"success": True, "packages": packages})

@app.route("/api/tweets", methods=["GET"])
def get_tweets():
    tweets = load_tweet_history()
    return jsonify({"success": True, "tweets": tweets})

@app.route("/api/tweet", methods=["POST"])
def post_tweet():
    data = request.get_json()
    if not data or "text" not in data or "package_name" not in data:
        return jsonify({"success": False, "error": "Missing tweet data"}), 400
    
    new_tweet = {
        "text": data["text"],
        "package_name": data["package_name"],
        "timestamp": datetime.datetime.now().strftime("%b %d, %Y %I:%M %p"),
        "likes": 0,
        "retweets": 0
    }
    save_tweet(new_tweet)
    return jsonify({"success": True, "tweet": new_tweet})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
