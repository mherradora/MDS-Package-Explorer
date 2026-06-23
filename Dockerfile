# Use official Python runtime as a parent image
FROM python:3.12-slim-bookworm

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Set working directory
WORKDIR /app

# Install system dependencies and R
RUN apt-get update && apt-get install -y --no-install-recommends \
    r-base \
    r-base-dev \
    libcurl4-openssl-dev \
    libssl-dev \
    libxml2-dev \
    && rm -rf /var/lib/apt/lists/*

# Install R packages needed for SMACOF MDS
RUN Rscript -e "install.packages(c('smacof', 'jsonlite'), repos='https://cloud.r-project.org')"

# Copy requirements and install python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose Flask port
EXPOSE 5000

# Command to run the application
CMD ["python", "app.py"]
