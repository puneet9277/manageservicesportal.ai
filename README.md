# Manage Services Portal (Workmates)

A modern cloud services portal for managing AWS resources, billing, and monitoring, built with React and Vite.

## Features Implemented

### 1. Modern AWS-Style UI/UX
- Consistent dark/blue gradient backgrounds and branding.
- Responsive, card-based layouts for all main pages.
- Centered Workmates logo and professional headers.

### 2. Data Integration
- Billing, Services Running, and CloudTrail pages connected to real backend Lambda responses.
- Dynamic mapping of AWS resource fields (e.g., FunctionName, BucketName, etc.).
- All available backend data surfaced in the UI, including modals for raw data.

### 3. Billing Dashboard
- Expandable cards for Total Cost, Daily Breakdown, Service Breakdown, and Usage Type Breakdown.
- Downloadable invoice PDFs (current and past).
- Anomaly detection banner for unusual billing activity.
- Scrollable, responsive tables for all breakdowns.
- Professional, accessible charting:
  - Daily cost trend (line chart)
  - Cost by service (horizontal bar chart, with tooltips and no overlapping labels)

### 4. Accessibility & Usability
- Focus ring and keyboard navigation improvements.
- Accessible, animated expandable cards.
- All links open in new tabs where appropriate.

### 5. General Improvements
- UI/UX fixes: spacing, color consistency, logo sizing, and more.
- All data visualizations use recharts for modern, interactive charts.
- All available backend data is shown, with modals for full JSON details.

---

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

---

## Project Structure
- `src/pages/` — Main pages (Billing, Services, CloudTrail, etc.)
- `src/components/` — Reusable UI components
- `src/constants/` — AWS resource/service constants
- `src/utils/` — API helpers

---

## Next Steps
- Add authentication and user management
- Integrate more AWS services and dashboards
- Further polish accessibility and mobile experience

---

*This project is a work in progress and demonstrates best practices for modern, data-rich cloud dashboards.*
