# CISC2350 Information & Web Programming Final Project 
Portfolio website built using HTML, CSS, JavaScript, Bootstrap, and advanced graphics libraries.

## Features
- Bootstrap-based responsive design with dark mode toggle
- Three interactive Perlin noise visualizations:
  - **Vanilla JavaScript** - Particle wave animation with mouse repulsion and click-to-burst effects
  - **p5.js** - Flow field with particle-to-particle repulsion, reset button, and fade speed control
  - **three.js** - 3D terrain mesh with animated Perlin noise, topographical colors, contour lines, and camera controls

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
├── index.html      # Home page
├── about.html      # About page
├── projects.html   # Projects showcase with visualizations
├── blog.html       # Blog page
├── contact.html    # Contact page
├── css/            # Custom stylesheets
├── js/             # JavaScript files
├── img/            # Images and assets
└── package.json    # Node.js dependencies
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
