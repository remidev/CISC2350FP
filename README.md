# CISC2350 Information & Web Programming Final Project 
Portfolio website built using HTML, CSS, JavaScript, Bootstrap, and advanced graphics libraries.

## Features
- Bootstrap-based responsive design
- Interactive Perlin noise visualizations
- Vanilla JavaScript canvas demo (implemented)
- p5.js demos (planned)
- three.js 3D visualizations (planned)

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

### npm audit vulnerabilities
Running `npm install` may show security vulnerabilities in `live-server` dependencies. These are **development-only dependencies** that only run locally and do not affect the deployed website. The actual site is purely static HTML/CSS/JS with no backend, so these pose no security risk to users.

## Future Enhancements / Ideas to Consider

### p5.js Flow Field Demo
- **Per-particle noise sensitivity:** Give each particle its own `noiseScale` value (e.g., randomize between 0.008-0.012). This would make particles follow slightly different flows, creating more organic motion and further reducing clustering.

### General
- Add three.js 3D Perlin noise visualization
- Implement additional interactive features (color changes, pattern switching, etc.)
- Add mobile touch event support for particle interactions

## Deployment
TBD - Will be hosted on GitHub Pages or similar platform
