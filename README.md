# Score Predictor Browser Extension

Identifies betting opportunities with >75% probability for Both Teams To Score (BTTS) and Over 1.5 goals on BetPawa.

## Features
- ✅ Filters games with >75% BTTS & Over 1.5 probability
- ✅ Calculates combined probabilities
- ✅ Tracks results and win rate
- ✅ Desktop notifications for qualifying games
- ✅ Adjustable probability threshold

## Installation

### Chrome/Edge
1. Open `chrome://extensions/` (or `edge://extensions/`)
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `score-predictor-extension` folder
5. Navigate to https://www.betpawa.ug/
6. Click the extension icon to view qualifying games

## Usage

1. **Browse BetPawa**: Navigate to https://www.betpawa.ug/
2. **Open Extension**: Click the extension icon in your browser toolbar
3. **View Qualified Games**: Games with >75% probability are displayed
4. **Adjust Filter**: Change "Min %" to adjust threshold
5. **Track Results**: Click "Won ✓" or "Lost ✗" to track performance
6. **View Stats**: Win rate and tracked games shown at top

## Important Notes

### BetPawa Integration
The extension uses web scraping to extract odds from BetPawa. You may need to adjust the CSS selectors in `scripts/content.js` if BetPawa changes their website structure.

**To customize selectors:**
1. Open BetPawa in browser
2. Right-click on a game → Inspect
3. Find the HTML structure for games and odds
4. Update selectors in `content.js` line 5-6

### Probability Calculation
- Converts decimal odds to implied probability: `Probability = (1 / odds) × 100`
- Combined probability: `BTTS% × Over1.5%`

### Limitations
- Requires manual result tracking (Won/Lost buttons)
- Works only on BetPawa Uganda site
- No automatic cashout feature (requires betting platform API)

## Future Enhancements
- Mobile app version
- Automatic result verification via API
- Multiple betting site support
- Advanced analytics dashboard
- Telegram/WhatsApp notifications
- Auto-cashout integration (requires betting API access)

## Troubleshooting

**No games showing:**
- Ensure you're on betpawa.ug
- Click "Refresh" button
- Check browser console for errors
- Verify BetPawa hasn't changed their HTML structure

**Notifications not working:**
- Check browser notification permissions
- Enable notifications in extension settings

## Tech Stack
- JavaScript (ES6+)
- Chrome Extension Manifest V3
- Chrome Storage API
- Chrome Notifications API
