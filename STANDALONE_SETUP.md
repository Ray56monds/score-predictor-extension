# Standalone Version Setup

## What's Different?

The standalone version:
- ✅ Works independently (no website needed)
- ✅ Fetches data from The Odds API
- ✅ No web scraping
- ✅ More reliable
- ❌ Requires free API key (500 requests/month)

## Setup Steps:

### 1. Get Free API Key
1. Go to https://the-odds-api.com/
2. Click "Get a Free API Key"
3. Sign up with email
4. Copy your API key

### 2. Add API Key to Extension
1. Open `scripts/popup-standalone.js`
2. Line 8: Replace `YOUR_API_KEY_HERE` with your actual key
3. Save the file

### 3. Switch to Standalone Version
1. Rename `manifest.json` to `manifest-betpawa.json` (backup)
2. Rename `manifest-standalone.json` to `manifest.json`
3. Go to `chrome://extensions/`
4. Click reload on the extension

### 4. Use the Extension
1. Click extension icon (works anywhere, no website needed!)
2. Click "Refresh" to fetch latest odds
3. Click games to search for them
4. Track results with Won/Lost buttons

## API Limits:
- Free tier: 500 requests/month
- ~16 requests/day
- Each "Refresh" = 1 request

## Supported Leagues:
Currently configured for English Premier League (EPL).

To add more leagues, edit `popup-standalone.js` line 21:
- `soccer_epl` - English Premier League
- `soccer_spain_la_liga` - La Liga
- `soccer_germany_bundesliga` - Bundesliga
- `soccer_italy_serie_a` - Serie A
- Full list: https://the-odds-api.com/sports-odds-data/soccer.html

## Switch Back to BetPawa Version:
1. Rename `manifest.json` to `manifest-standalone.json`
2. Rename `manifest-betpawa.json` to `manifest.json`
3. Reload extension

## Advantages:
- No website dependency
- Works from anywhere
- Official data source
- Multiple bookmakers
- Multiple leagues

## Disadvantages:
- API key required
- Request limits (500/month free)
- Only major leagues available
