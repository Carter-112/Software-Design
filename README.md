# Java Data Structures Practice App

A beautiful, interactive application for practicing Java data structures with a cosmic-themed interface.

## Features

- Interactive code practice for various Java data structures
- Weighted random practice system (each snippet appears once until all are seen)
- Cosmic-themed interface with floating particles
- Fully responsive design for all devices
- Works offline as a Progressive Web App (PWA)
- Can be installed on Android devices

## Progressive Web App (PWA)

This project is set up as a Progressive Web App, which means:

1. It can work offline
2. It can be installed on mobile devices and desktops
3. It offers a full-screen experience without browser UI

### Setting Up the PWA

To complete the PWA setup:

1. Generate the icon files:
   ```
   npm install canvas
   node generate-icons.js
   ```

2. Host the site on HTTPS (required for PWAs)
   - You can use GitHub Pages, Netlify, Vercel, or similar services
   - For local development, you can use `https-localhost`: `npm install -g https-localhost` then `serve .`

3. Test the PWA functionality using Chrome DevTools:
   - Open DevTools (F12)
   - Go to Application tab
   - Check "Service Workers" and "Manifest" sections

## Converting to Android App

There are several ways to convert this PWA to an Android app:

### Method 1: PWA to Android App (Easiest)

Users can install the PWA directly on their Android devices:

1. Visit the hosted website in Chrome on Android
2. Tap the menu button (three dots)
3. Select "Add to Home Screen"
4. The app will be installed and appear on the home screen with your icon

### Method 2: Using PWA Builder (Recommended)

1. Visit [PWA Builder](https://www.pwabuilder.com/)
2. Enter your PWA's URL
3. PWA Builder will analyze your site
4. Click "Build" and select "Android"
5. Download the Android package
6. Publish to Google Play Store

### Method 3: Using Capacitor/Cordova (Full Native Features)

For more native functionality:

1. Install Capacitor:
   ```
   npm install -g @capacitor/cli
   npm install @capacitor/core @capacitor/android
   ```

2. Initialize Capacitor in your project:
   ```
   npx cap init JavaDS io.yourname.javads
   ```

3. Add Android platform:
   ```
   npx cap add android
   ```

4. Copy your web assets:
   ```
   npx cap copy
   ```

5. Open in Android Studio:
   ```
   npx cap open android
   ```

6. Customize the Android project as needed
7. Build and publish to Google Play Store

## Development

### CSS Structure

The styling uses CSS variables and a modular approach:
- Root variables for colors and animations
- Responsive design with media queries
- Special effects for cards and interactive elements
- Particle systems for background effects

### Performance Optimization

The site is optimized for performance:
- Hardware-accelerated animations
- Reduced particle count on mobile devices
- Will-change hints for smoother animations
- Lazy-loading where appropriate 