# Design Guidelines - CIK BiH Revizijska Aplikacija

## Design Approach
**Utility-Focused Dashboard Application** - Professional governmental monitoring system prioritizing data clarity, real-time information display, and operational efficiency.

## Core Design Elements

### A. Color Palette
**Primary Theme: Orange (#FF6B35)**
- Primary: #FF6B35 (narandžasta)
- Secondary: #FFA500 (svjetlija narandžasta)
- Success: #10B981 (zelena)
- Warning: #F59E0B (žuta)
- Danger: #EF4444 (crvena)
- Info: #3B82F6 (plava)
- Background: #F9FAFB
- Foreground: #111827

**Status Indicators:**
- Green: Normalno funkcionisanje
- Yellow: Upozorenja
- Red: Kritični problemi
- Gray: Neaktivno

### B. Typography
**Language: Bosnian (all interface elements)**
- Use system fonts optimized for Bosnian characters
- Clear hierarchy for dashboard metrics and data tables
- Readable sizes for dense information displays

### C. Layout System
**Desktop-optimized Grid Layout:**
- Main Dashboard: 2x2 grid + full-width bottom section
- Tailwind spacing: Consistent use of p-4, p-6, gap-4, gap-6 for panels
- Collapsible sidebar navigation (fixed left)
- Full viewport utilization for maximum data visibility

### D. Component Library

**Header (Fixed Top):**
- CIK BiH logo (left)
- Center: "Centralna izborna komisija BiH - Revizijski Portal"
- Right: User info with Avatar ("Revizor: [Ime]") + logout button
- Background: Primary orange (#FF6B35)

**Dashboard Panels (2x2 Grid):**
1. **Interaktivna Mapa BiH** (react-leaflet)
   - Entity statistics (FBiH: 2,847 / RS: 2,103 / BD: 650 mjesta)
   - Color-coded location markers
   - Hover info cards, click for details

2. **Statistike Validnosti** (Pie Chart)
   - Validni: 95.3% / Nevažeći: 3.2% / Sporni: 1.5%

3. **Autentifikacije (Real-time)**
   - Live counters: Uspješne/Neuspješne/Blokirane
   - Update every 3-5 seconds

4. **Anomalije i Upozorenja**
   - Alert list with icons (⚠️, 🔴)
   - GM-ID references with status badges

**Bottom Section:**
- Full-width detailed table with search, filter, sort
- Columns: ID, Naziv/Lokacija, Izlaznost (progress bar), Validni/Nevažeći/Sporni, Autentifikacije, Anomalije badge, Status badge, Actions

**Sidebar Navigation:**
- Icons (Lucide-react) + labels in Bosnian
- Sections: Dashboard, Glasačka mjesta, Izvještaji, Autentifikacije, Audit Log, Postavke

**shadcn/ui Components:**
- Tabs for detail views (5 tabs per voting location)
- DataTable with advanced filtering
- Sheet for sidebar
- Dialog for detailed previews
- Badge for statuses and counts
- Alert for warnings
- Progress bars for turnout percentages
- Select dropdowns for filters
- DatePicker for time periods
- Skeleton loading states
- Toast notifications for real-time alerts
- Separator for visual sections

**Interactive Features:**
- Modal/Dialog for detailed voting location view with 5 tabs:
  1. Opšte informacije
  2. Statistike glasanja (hourly charts)
  3. Autentifikacije (timeline)
  4. Validacija glasova (breakdown)
  5. Audit Log (activity history)

### E. Real-time Simulation
- WebSocket-style updates every 3-5 seconds
- Toast notifications for new anomalies
- Audio alerts for critical issues
- Live counter animations
- Dynamic status badge updates

## Responsive Behavior
- **Desktop (Primary):** Full grid layout, all panels visible
- **Tablet:** Collapsible sidebar, 2-column adaptation
- **Mobile:** Stacked layout, hamburger menu

## Data Visualization
- Recharts or Chart.js for statistical displays
- Pie charts for validation percentages
- Line/bar charts for hourly turnout
- Interactive map markers with react-leaflet
- Progress bars for percentages (izlaznost)

## Bosnian Interface Text
All labels, navigation, statuses, and messages in Bosnian language as specified in requirements.

## Images
**No hero images** - This is a data-focused dashboard application. Visual elements are:
- CIK BiH logo in header
- Interactive Bosnia and Herzegovina map
- Charts and data visualizations
- User avatars