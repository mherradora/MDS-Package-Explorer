import os
import csv
import json
import urllib.request
import re
import shutil
import datetime
import subprocess
import tempfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from flask import Flask, jsonify, render_template, request, send_from_directory

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
    """Loads package versions, published dates, downloads, license, and depends from CSV."""
    pkg_data = {}
    if os.path.exists(CSV_PATH):
        try:
            with open(CSV_PATH, mode='r', encoding='utf-8') as f:
                reader = csv.reader(f)
                header = next(reader, None)
                if header and header[0].lower() == "package":
                    header_lower = [h.lower() for h in header]
                    has_published = "published" in header_lower
                    has_downloads = "downloads" in header_lower
                    has_license = "license" in header_lower
                    has_depends = "depends" in header_lower
                    
                    pub_idx = header_lower.index("published") if has_published else -1
                    dl_idx = header_lower.index("downloads") if has_downloads else -1
                    lic_idx = header_lower.index("license") if has_license else -1
                    dep_idx = header_lower.index("depends") if has_depends else -1
                    ver_idx = header_lower.index("version") if "version" in header_lower else 1
                    
                    for row in reader:
                        max_idx = max(ver_idx, pub_idx, dl_idx, lic_idx, dep_idx)
                        if len(row) > max_idx:
                            pkg_name = row[0]
                            version = row[ver_idx]
                            published = row[pub_idx] if has_published and pub_idx < len(row) else "Unknown"
                            license_val = row[lic_idx] if has_license and lic_idx < len(row) else "Unknown"
                            depends_val = row[dep_idx] if has_depends and dep_idx < len(row) else "None"
                            try:
                                downloads = int(row[dl_idx]) if has_downloads and dl_idx < len(row) else 0
                            except ValueError:
                                downloads = 0
                                
                            pkg_data[pkg_name] = {
                                "version": version,
                                "published": published,
                                "downloads": downloads,
                                "license": license_val,
                                "depends": depends_val
                            }
        except Exception as e:
            print(f"Error reading CSV: {e}")
    return pkg_data

def save_csv_versions(pkg_data):
    """Saves package versions, published dates, downloads, license, and depends to the CSV file."""
    try:
        sorted_data = sorted(pkg_data.items())
        with open(CSV_PATH, mode='w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(["Package", "Version", "Published", "Downloads", "License", "Depends", "LastChecked"])
            now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            for pkg, data in sorted_data:
                writer.writerow([
                    pkg, 
                    data["version"], 
                    data["published"], 
                    data.get("downloads", 0), 
                    data.get("license", "Unknown"), 
                    data.get("depends", "None"), 
                    now_str
                ])
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

def fetch_downloads_count(pkg_name):
    """Queries the CRANlogs API for total downloads in the last month."""
    url = f"https://cranlogs.r-pkg.org/downloads/total/last-month/{pkg_name}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            if isinstance(data, list) and len(data) > 0:
                return data[0].get("downloads", 0)
            elif isinstance(data, dict):
                return data.get("downloads", 0)
            return 0
    except Exception as e:
        print(f"[{pkg_name}] Error fetching downloads from CRANlogs: {e}")
        return 0

def clean_html_tags(text):
    """Helper to strip HTML tags and normalize whitespace."""
    if not text:
        return ""
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def sync_package(pkg, csv_data):
    """Scrapes a single package page, relocates folder, downloads new files and fetches statistics."""
    pkg_name = pkg["name"]
    pkg_id = pkg["id"]
    
    existing_pkg = csv_data.get(pkg_name, {})
    existing_version = existing_pkg.get("version")
    existing_published = existing_pkg.get("published", "Unknown")
    existing_downloads = existing_pkg.get("downloads", 0)
    existing_license = existing_pkg.get("license", "Unknown")
    existing_depends = existing_pkg.get("depends", "None")
    
    pkg_url = f"https://cran.r-project.org/web/packages/{pkg_id}/index.html"
    req = urllib.request.Request(pkg_url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        # 1. Fetch CRANlogs downloads statistic
        downloads = fetch_downloads_count(pkg_name)
        if downloads == 0 and existing_downloads > 0:
            # Fallback to existing count if API failed temporarily
            downloads = existing_downloads
            
        with urllib.request.urlopen(req, timeout=15) as response:
            html = response.read().decode('utf-8', errors='ignore')
            
            # Extract CRAN version
            version_match = re.search(r'<td>Version:</td>\s*<td>(.*?)</td>', html, re.DOTALL)
            if not version_match:
                print(f"[{pkg_name}] Version info not found on page.")
                return pkg_name, existing_version, existing_published, downloads, existing_license, existing_depends, "No version found"
            
            version = version_match.group(1).strip()
            
            # Extract CRAN published date
            published_match = re.search(r'<td>Published:</td>\s*<td>(.*?)</td>', html, re.DOTALL)
            published = published_match.group(1).strip() if published_match else "Unknown"
            
            # Extract License
            license_match = re.search(r'<td>License:</td>\s*<td>(.*?)</td>', html, re.DOTALL)
            license_str = clean_html_tags(license_match.group(1)) if license_match else "Unknown"
            
            # Extract Depends
            depends_match = re.search(r'<td>Depends:</td>\s*<td>(.*?)</td>', html, re.DOTALL)
            depends_str = clean_html_tags(depends_match.group(1)) if depends_match else "None"
            
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
            
            return pkg_name, version, published, downloads, license_str, depends_str, status
            
    except Exception as e:
        print(f"Error syncing package {pkg_name}: {e}")
        return pkg_name, existing_version, existing_published, existing_downloads, existing_license, existing_depends, f"Sync error: {e}"

def run_global_sync():
    """Performs the full CRAN scraping, folder relocation, downloads, and stats for all MDS packages."""
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
            pkg_name, ver, pub, dls, lic, dep, status = future.result()
            if ver:
                updated_data[pkg_name] = {
                    "version": ver,
                    "published": pub,
                    "downloads": dls,
                    "license": lic,
                    "depends": dep
                }
            sync_results[pkg_name] = status
            
    # 5. Write updated versions back to CSV
    save_csv_versions(updated_data)
    print("Sync complete. Results:", sync_results)
    return True, None

def get_enhanced_packages_list():
    """Loads packages details and appends version, downloads, and download status."""
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
        downloads = pkg_info.get("downloads", 0)
        license_val = pkg_info.get("license", "Unknown")
        depends_val = pkg_info.get("depends", "None")
        
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
            "downloads": downloads,
            "license": license_val,
            "depends": depends_val,
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

# Serve local package document files (PDFs, Vignettes, Tarballs) directly to client browser
@app.route("/mds_packages/<path:filename>")
def serve_package_file(filename):
    return send_from_directory(MDS_PACKAGES_DIR, filename)

@app.route("/api/run-mds", methods=["POST"])
def run_mds():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No data provided"}), 400
        
    dataset = data.get("dataset", "eurodist")
    mds_type = data.get("type", "ratio")
    ndim = int(data.get("ndim", 2))
    custom_csv = data.get("custom_csv", "")
    
    if mds_type not in ["ratio", "interval", "ordinal", "mspline"]:
        return jsonify({"success": False, "error": "Invalid MDS type"}), 400
    if ndim not in [2, 3]:
        return jsonify({"success": False, "error": "ndim must be 2 or 3"}), 400
        
    temp_files = []
    try:
        temp_dir = os.path.join(WORKSPACE_DIR, "scratch", "temp_mds")
        os.makedirs(temp_dir, exist_ok=True)
        
        if dataset == "eurodist":
            r_dataset_code = "delta <- eurodist"
        elif dataset == "UScitiesD":
            r_dataset_code = "delta <- UScitiesD"
        elif dataset == "custom":
            if not custom_csv.strip():
                return jsonify({"success": False, "error": "Custom CSV data is empty"}), 400
            
            csv_fd, csv_path = tempfile.mkstemp(suffix=".csv", dir=temp_dir)
            temp_files.append(csv_path)
            with os.fdopen(csv_fd, 'w', encoding='utf-8') as f:
                f.write(custom_csv)
                
            r_dataset_code = f'delta <- as.matrix(read.csv("{csv_path}", row.names = 1, check.names = FALSE))'
        else:
            return jsonify({"success": False, "error": f"Unknown dataset: {dataset}"}), 400
            
        r_script = f"""
library(smacof)
library(jsonlite)

# Load dataset
{r_dataset_code}

# Run SMACOF MDS
fit <- smacof::mds(delta, ndim = {ndim}, type = "{mds_type}")

# Prepare results
conf_mat <- as.matrix(fit$conf)
labels <- rownames(conf_mat)
if (is.null(labels)) {{
    labels <- paste0("Obj", 1:nrow(conf_mat))
}}

res <- list(
    success = TRUE,
    stress = fit$stress,
    niter = fit$niter,
    points = lapply(1:nrow(conf_mat), function(i) {{
        val <- list(
            name = labels[i]
        )
        for (d in 1:ncol(conf_mat)) {{
            val[[paste0("D", d)]] <- conf_mat[i, d]
        }}
        return(val)
    }})
)

cat(toJSON(res, auto_unbox = TRUE))
"""
        r_fd, r_path = tempfile.mkstemp(suffix=".R", dir=temp_dir)
        temp_files.append(r_path)
        with os.fdopen(r_fd, 'w', encoding='utf-8') as f:
            f.write(r_script)
            
        process = subprocess.run(
            ["Rscript", r_path],
            capture_output=True,
            text=True,
            timeout=20
        )
        
        for fpath in temp_files:
            if os.path.exists(fpath):
                try:
                    os.remove(fpath)
                except Exception:
                    pass
                
        if process.returncode != 0:
            err_msg = process.stderr.strip() or process.stdout.strip() or "R script failed with unknown error"
            return jsonify({"success": False, "error": err_msg}), 500
            
        stdout_content = process.stdout.strip()
        json_match = re.search(r'\{"success":.*\}', stdout_content, re.DOTALL)
        if not json_match:
            return jsonify({
                "success": False, 
                "error": f"Failed to parse R output. R stdout was: {stdout_content}"
            }), 500
            
        result_data = json.loads(json_match.group(0))
        return jsonify(result_data)
        
    except subprocess.TimeoutExpired:
        for fpath in temp_files:
            if os.path.exists(fpath):
                try:
                    os.remove(fpath)
                except Exception:
                    pass
        return jsonify({"success": False, "error": "R execution timed out"}), 500
        
    except Exception as e:
        for fpath in temp_files:
            if os.path.exists(fpath):
                try:
                    os.remove(fpath)
                except Exception:
                    pass
        return jsonify({"success": False, "error": f"Internal error during execution: {e}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
