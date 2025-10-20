# RouteAI - Running Route Generator

A minimalist, client-side running route generator that creates personalized routes using AI-powered algorithms. Built with HTML, Tailwind CSS, Vanilla JavaScript, and Leaflet.js.

## Features

- **Interactive Map**: Powered by Leaflet.js with beautiful Stadia Maps tiles
- **Smart Route Generation**: Uses OpenRouteService API for intelligent route planning
- **Multiple Route Types**: Generate loops or out-and-back routes
- **Distance Control**: Adjustable distance slider (1-50 km)
- **Location Services**: Use your current location or enter any address
- **Mobile-First Design**: Fully responsive and optimized for mobile devices

## Quick Start

1. **Get an API Key**: 
   - Visit [OpenRouteService](https://openrouteservice.org/)
   - Sign up for a free account
   - Get your API key from the dashboard

2. **Local Development**:
   - Serve locally: `python3 -m http.server 5173` and open `http://localhost:5173`
   - For CORS-free requests, deploy on Vercel (see below)

3. **Generate Routes**:
   - Enter a start location or click "📍 My Location"
   - Adjust the distance slider
   - Choose route type (Loop or Out and Back)
   - Click "Generate Route"

## Deploy on Vercel (recommended)

This project includes a tiny serverless proxy that forwards requests to OpenRouteService and adds CORS headers, so your key stays server-side.

1. Install Vercel CLI: `npm i -g vercel`
2. Set your secret: `vercel secrets add ors_api_key YOUR_ORS_KEY`
3. Link and deploy:
   - `vercel` (first time)
   - `vercel --prod`
4. In the Vercel dashboard, add an environment variable:
   - Key: `ORS_API_KEY`
   - Value: use the secret `@ors_api_key`
   - Environments: Production + Preview

Client calls will hit `/api/directions` and `/api/geocode`, which proxy to ORS.

## Technical Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Maps**: Leaflet.js with Stadia Maps tiles
- **Routing**: OpenRouteService API
- **Hosting**: Ready for Firebase Hosting (free)

## API Key Setup

The app requires an OpenRouteService API key. Here's how to get one:

1. Go to [OpenRouteService](https://openrouteservice.org/)
2. Click "Get Started" and create a free account
3. Navigate to your dashboard
4. Copy your API key
5. Replace `YOUR_API_KEY` in the JavaScript code with your actual key

## Development Roadmap

### Phase 1 (Current) - MVP ✅
- [x] Single HTML file with Leaflet.js and Tailwind CSS
- [x] Basic map centered on Helsinki
- [x] User controls (location, distance, route type)
- [x] OpenRouteService API integration
- [x] Route display on map

### Phase 2 - User Experience
- [ ] Route preferences (avoid hills, prefer unpaved surfaces)
- [ ] Route details (elevation, surface types)
- [ ] Loading indicators and error handling
- [ ] Mobile optimization

### Phase 3 - Persistence
- [ ] Firebase integration
- [ ] User authentication
- [ ] Save and load routes
- [ ] "My Routes" page

### Phase 4 - Advanced Features
- [ ] GPX export
- [ ] Route sharing
- [ ] Scenic route heuristics
- [ ] Personal heatmap

## Cost Breakdown

- **Frontend**: $0 (HTML, CSS, JS)
- **Maps**: $0 (Leaflet.js + Stadia Maps)
- **Routing**: $0 (OpenRouteService free tier)
- **Hosting**: $0 (Firebase Hosting free tier)
- **Total**: $0

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

This is a Phase 1 MVP. The codebase is intentionally simple and contained in a single HTML file for maximum accessibility and ease of deployment.

## License

MIT License - feel free to use and modify as needed.
