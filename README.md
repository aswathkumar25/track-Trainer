# Trainer Session & Attendance Dashboard

A modern, premium SaaS-style offline-first Attendance Management System designed for training institutes. The platform features responsive analytics, student/trainer profiles, active session trackers, and interactive calendar logs, styled with a sleek dark-first design system.

---
## live server - https://startling-halva-8e877b.netlify.app/ 
---

## 🚀 Features & Modules

### 📊 Executive Dashboard
* **Key Metrics**: Instantly view average attendance percentage, active student/trainer counts, and active batch metrics.
* **Interactive Visualizations**: Powered by Recharts, offering area charts for daily attendance trends and bar charts comparing attendance rates across cohorts.
* **Live System Status**: Monitors operational logs, database state, and local synchronization triggers in real-time.

### 📝 Roster Session Marker
* **Active Attendance Registry**: Easily log attendance (Present, Late, Leave, Absent) for specific training batches.
* **Bulk Operations**: Relocate selected student groups to different batches or remove records in bulk with a single click.
* **Custom Remarks**: Document notes or reasons for late arrivals and absences directly on the attendance card.

### 🎓 Registries & Cohorts
* **Students Registry**: Add, search, filter, edit, and archive student profiles. Inspect detailed student notes and records.
* **Trainers Index**: Track instructor specializations and their assigned batches.
* **Batch Cohorts**: Manage and monitor course cohorts, schedule dates, and easily duplicate/clone existing batch templates.

### 📅 Interactive Calendar & History
* **Activity Calendar**: View marked session history and national/academic holidays at a glance.
* **Audit Trail**: Search and filter past attendance logs by date and cohort name.

### ⚙️ General Settings & Customization
* **Visual Themes**: Light and dark mode support with instant styling transition.
* **Brand Accents**: Select from custom color palettes (Indigo, Blue, Emerald, Violet, Rose) to adjust the UI theme immediately.
* **Storage Control Panel**: Export your entire institute database as a clean JSON backup file or import existing databases to restore states.

---

## 🛠️ Technology Stack

- **Core Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 6
- **Styling**: Tailwind CSS v4 (Vanilla CSS Custom Tokens)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Database**: Offline-first JSON storage client with synchronous caching to browser LocalStorage/IndexedDB.

---

## 💻 Local Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Step-by-Step Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/trainer-session-attendance.git
   cd trainer-session-attendance
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000/`.

4. **Build for Production**
   To compile a production build of the static application:
   ```bash
   npm run build
   ```
   The compiled bundles will be generated in the `dist/` directory.

---

## 🔒 Security & Offline Sandbox Certifications
- **No External APIs Required**: All database records and settings are stored locally on the client's browser using localStorage, guaranteeing 100% security context compliance.
- **Developer Bypasses**: The login screen is pre-configured with a default developer bypass (use username `admin` or role selections) to simplify navigation and testing.
