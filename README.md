# CISC2350 Information & Web Programming Final Project 
Portfolio website built using HTML, CSS, JavaScript, Bootstrap, and advanced graphics libraries.

## Features
- **Responsive Design** - Bootstrap-based layout with persistent dark mode toggle (saves preference)
- **Interactive Perlin Noise Visualizations** - Three distinct demos with real-time controls:
  - **Vanilla JavaScript** - Particle wave animation with mouse repulsion and click-to-burst effects
  - **p5.js** - Flow field with particle-to-particle repulsion, reset button, and adjustable fade speed slider
  - **three.js** - 3D terrain mesh with animated Perlin noise, topographical mode toggle, contour lines, wireframe view, and adjustable height/smoothness/speed sliders
- **Portfolio Section** - Recreation of a professional cinematographer's Squarespace portfolio featuring:
  - Independent navigation system separate from main site
  - 5 pages: home, narrative work, commercial work, cinematography reel, and contact
  - CDN-hosted media (images and videos served via Squarespace CDN to avoid large local assets)
  - Custom white-theme styling with sticky navbar and social media icons
  - Hover effects and responsive design

## Technologies
- HTML5, CSS3, JavaScript
- Bootstrap 5.3.2 (CDN)
- p5.js (CDN)
- three.js (CDN)
- Node.js & npm for development server

## How to run locally

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup
1. Clone the repository
2. Navigate to the project directory: `cd final`
3. Install development dependencies: `npm install`
4. Start the development server: `npm run dev`

The site will automatically open in your browser at `http://localhost:8080`

**Note:** p5.js and three.js are loaded via CDN links in the HTML files, so no additional library installation is needed.

### Available Scripts
- `npm start` - Start a basic HTTP server
- `npm run dev` - Start live-server with auto-reload on file changes

## Project Structure
```
final/
├── index.html         # Home page
├── about.html         # About page
├── projects.html      # Projects showcase with visualizations
├── blog.html          # Blog page
├── contact.html       # Contact page
├── css/               # Custom stylesheets
│   ├── main.css
│   └── projects.css
├── js/                # JavaScript files
│   ├── darkmode.js
│   ├── vanilla-particles.js
│   ├── p5-flow-field.js
│   └── three-terrain.js
├── img/               # Images and assets
├── portfolio/         # Inner portfolio section (Squarespace recreation)
│   ├── index.html     # Portfolio home page
│   ├── narrative.html # Narrative work showcase
│   ├── commercial.html # Commercial work showcase
│   ├── reel.html      # Cinematography reel
│   ├── contact.html   # Portfolio contact page
│   └── css/
│       └── portfolio.css
└── package.json       # Node.js dependencies
```

## Known Issues

### Mobile Interactions
- **Vanilla JavaScript Demo**: Touch controls for particle repulsion may not work reliably on all mobile devices
- **three.js Demo**: Camera rotation via drag is not functional on mobile/touch devices. Desktop mouse interaction required for camera control.

### npm audit vulnerabilities
Running `npm install` may show security vulnerabilities in `live-server` dependencies. These are **development-only dependencies** that only run locally and do not affect the deployed website. The actual site is purely static HTML/CSS/JS with no backend, so these pose no security risk to users.

## Deployment
Live site: [https://remidev.github.io/CISC2350FP/](https://remidev.github.io/CISC2350FP/)

Hosted on GitHub Pages with automatic deployment on every push to the main branch.
