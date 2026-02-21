# Quick Start Guide

## Immediate Setup (5 minutes)

### Step 1: Create Icon Files
The extension needs 3 icon files. Choose the fastest option:

**FASTEST - Use Emoji Icons (Works immediately):**
1. Go to https://favicon.io/emoji-favicons/soccer-ball/
2. Download the favicon
3. Extract and rename files to:
   - `icon16.png` (16x16)
   - `icon48.png` (48x48)
   - `icon128.png` (128x128)
4. Place in `C:\score-predictor-extension\icons\` folder

**OR - Create Simple Colored Squares:**
- Use any image editor (Paint, Photoshop, GIMP)
- Create 3 green squares: 16x16, 48x48, 128x128
- Save as PNG in icons folder

### Step 2: Load Extension
1. Open Chrome/Edge
2. Go to `chrome://extensions/` (or `edge://extensions/`)
3. Toggle "Developer mode" ON (top right)
4. Click "Load unpacked"
5. Select folder: `C:\score-predictor-extension`
6. Extension should appear in toolbar

### Step 3: Test on BetPawa
1. Navigate to https://www.betpawa.ug/
2. Click the extension icon
3. Click "Refresh" to scan games

## Important: Customize Selectors

BetPawa's HTML structure may differ. You'll likely need to adjust the CSS selectors:

1. Open BetPawa
2. Right-click on a game → "Inspect"
3. Find the HTML elements for:
   - Game/match containers
   - Team names
   - Odds values
   - BTTS and Over 1.5 markets

4. Update `scripts/content.js` line 5:
   ```javascript
   const gameElements = document.querySelectorAll('[YOUR_SELECTOR_HERE]');
   ```

## Testing Checklist
- [ ] Extension loads without errors
- [ ] Popup opens when clicking icon
- [ ] "Please navigate to betpawa.ug" shows on other sites
- [ ] Games are extracted from BetPawa (check console)
- [ ] Qualified games display in popup
- [ ] Won/Lost buttons track results
- [ ] Stats update correctly
- [ ] Notifications appear

## Common Issues

**"No games match criteria"**
- BetPawa selectors need updating
- Check browser console (F12) for errors
- Verify BetPawa has BTTS and Over 1.5 markets visible

**Extension won't load**
- Ensure all files are in correct folders
- Check manifest.json for syntax errors
- Icons must exist (even placeholder images work)

**Notifications don't work**
- Allow notifications in browser settings
- Check extension permissions

## Next Steps

Once working:
1. Fine-tune probability thresholds
2. Add more betting markets
3. Implement auto-refresh
4. Build mobile app version
5. Add Telegram notifications
6. Integrate betting API for auto-cashout

## Need Help?

Check the browser console (F12) for error messages when:
- Loading the extension
- Opening the popup
- Clicking refresh on BetPawa
