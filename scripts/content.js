// Extract betting data from BetPawa
function extractGames() {
  const games = [];
  console.log('🔍 Extracting games from BetPawa...');
  
  // Multiple selector strategies for BetPawa
  const selectors = [
    '[class*="event"]',
    '[class*="match"]',
    '[class*="game"]',
    '[data-event-id]',
    '[class*="fixture"]',
    'div[class*="sport"] > div',
    '.event-row',
    '.match-row'
  ];
  
  let gameElements = [];
  for (const selector of selectors) {
    gameElements = document.querySelectorAll(selector);
    if (gameElements.length > 0) {
      console.log(`✅ Found ${gameElements.length} elements with selector: ${selector}`);
      break;
    }
  }
  
  if (gameElements.length === 0) {
    console.warn('⚠️ No game elements found. BetPawa structure may have changed.');
    return games;
  }
  
  gameElements.forEach((el, index) => {
    try {
      const fullText = el.textContent || '';
      
      // Multiple patterns for team extraction
      const teamPatterns = [
        /([A-Za-z][A-Za-z\s.'-]+?)\s+(?:vs?\.?|v|-)\s+([A-Za-z][A-Za-z\s.'-]+)/i,
        /([A-Za-z\s]+)\s*-\s*([A-Za-z\s]+)/,
        /([A-Za-z\s]+)\s+([A-Za-z\s]+)/
      ];
      
      let teams = null;
      for (const pattern of teamPatterns) {
        teams = fullText.match(pattern);
        if (teams && teams[1] && teams[2]) break;
      }
      
      if (!teams || !teams[1] || !teams[2]) return;
      
      const game = {
        homeTeam: teams[1].trim(),
        awayTeam: teams[2].trim(),
        bttsOdds: null,
        over15Odds: null,
        timestamp: Date.now()
      };
      
      // Extract odds with multiple strategies
      const oddsSelectors = [
        '[class*="odd"]',
        '[class*="coef"]',
        '[class*="price"]',
        '[class*="rate"]',
        'button',
        'span[class*="value"]'
      ];
      
      let oddsElements = [];
      for (const selector of oddsSelectors) {
        oddsElements = el.querySelectorAll(selector);
        if (oddsElements.length > 0) break;
      }
      
      // Parse odds
      oddsElements.forEach(odd => {
        const text = odd.textContent.toLowerCase();
        const numbers = text.match(/\d+\.\d+|\d+/g);
        if (!numbers) return;
        
        const value = parseFloat(numbers[0]);
        if (value < 1 || value > 100) return; // Sanity check
        
        // BTTS detection
        if (text.includes('btts') || text.includes('both') || text.includes('gg') || 
            text.includes('both teams') || text.includes('yes')) {
          if (!game.bttsOdds) game.bttsOdds = value;
        }
        
        // Over 1.5 detection
        if ((text.includes('over') || text.includes('o')) && 
            (text.includes('1.5') || text.includes('1,5'))) {
          if (!game.over15Odds) game.over15Odds = value;
        }
      });
      
      if (game.bttsOdds && game.over15Odds) {
        game.bttsProb = oddsToProb(game.bttsOdds);
        game.over15Prob = oddsToProb(game.over15Odds);
        game.combinedProb = game.bttsProb * game.over15Prob;
        games.push(game);
        console.log(`✅ Game ${index + 1}: ${game.homeTeam} vs ${game.awayTeam} - BTTS: ${game.bttsProb.toFixed(1)}%, O1.5: ${game.over15Prob.toFixed(1)}%`);
      }
    } catch (e) {
      console.error('❌ Error parsing game:', e);
    }
  });
  
  console.log(`📊 Total qualified games found: ${games.length}`);
  return games;
}

function oddsToProb(odds) {
  return odds > 0 ? (1 / odds) * 100 : 0;
}

// Listen for requests from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractGames') {
    const games = extractGames();
    sendResponse({ games });
  }
  if (request.action === 'debugMode') {
    console.log('=== DEBUG MODE ===');
    console.log('Page URL:', window.location.href);
    console.log('Page Title:', document.title);
    
    // Test all selectors
    const testSelectors = [
      '[class*="event"]',
      '[class*="match"]',
      '[class*="game"]',
      '[data-event-id]',
      '[class*="fixture"]'
    ];
    
    testSelectors.forEach(sel => {
      const count = document.querySelectorAll(sel).length;
      console.log(`${sel}: ${count} elements`);
    });
    
    sendResponse({ debug: 'Check console for details' });
  }
  return true;
});

// Auto-highlight qualifying games on page
function highlightGames() {
  const games = extractGames();
  const qualified = games.filter(g => g.bttsProb >= 75 && g.over15Prob >= 75);
  
  if (qualified.length > 0) {
    chrome.runtime.sendMessage({ 
      action: 'notify', 
      count: qualified.length 
    });
  }
}

// Run on page load and log status
setTimeout(() => {
  console.log('⚽ Score Predictor Extension Active');
  highlightGames();
}, 2000);
