# Smart Planner

Smart Planner is a simple web application designed to help teams plan and analyze digital marketing campaigns effectively. It supports file uploads (CSV/XLS), dynamic filtering, KPI-based benchmarking, and data visualization.

---

## Tech Stack

- **Backend**: Django + Django REST Framework  
- **Frontend**: React + TailwindCSS + Recharts  
- **File Parsing**: Pandas (for CSV/XLSX)  
- **Exporting**: jsPDF + html2canvas-pro

---

## Local Setup

### Prerequisites

- Python 3.10+
- Node.js 20.19.0+
- pip
- npm or yarn

https://www.python.org/downloads/
https://nodejs.org/en/download

WSL 
  ```bash
  $ sudo apt install python3 python3-pip
  ```
  https://blog.logrocket.com/manage-node-js-versions-using-asdf/


---
### Backend Setup (Django)

1. **Clone the repo**
  ```bash
  git clone https://github.com/your-username/smart-planner.git
  cd smart-planner/backend
  ```
2. **Create virtual environment**
  ```bash
  python -m venv venv
  source venv/bin/activate
  ```
3. **Install dependencies**
  ```bash
  pip install -r requirements.txt
  ```
4. **Create environment file for Django secret key**
  ```bash
  pip install -r requirements.txt
  ```
5. **Run migrations**
  ```bash
  python manage.py migrate
  ```
6. **Start the backend server**
  ```bash
  python manage.py runserver
  ```
> By default, it runs on http://127.0.0.1:8000/
---

### Frontend Setup (React)

1. **Go to frontend folder**
  ```bash
  cd ../frontend
  ```
2. **Install dependencies**
  ```bash
  npm install
  ```
3. **Start the frontend server**
  ```bash
  npm run dev
  ```
---
## Features

- **Campaign Upload** — Upload campaign data via CSV or Excel files
- **KPI Benchmarking** — Automatically calculates average and median CPU, Cost, and KPI
- **Smart Filters** — Dynamically filter campaigns by platform, buy type, objective, or name
- **Interactive Charts** — Visualize performance via bar and pie charts (Recharts)
- **Campaign Table** — View detailed campaign metrics in a filterable table
- **PDF Export** — Download a report of all filtered data including charts and tables
---
## Assumptions Made

- Uploaded CSV/XLSX files follow a standard format with identifiable KPI, cost, and CPU columns (important)
- est_kpi, cpu_value, and cost values are numeric
- Filtering fields (platform, buy_type, objective) exist and are non-null
- APP is straightforward with no user authentication for now
- Filters per field is not multiselect
