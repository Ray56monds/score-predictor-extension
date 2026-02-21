let allGames = [];

async function loadGames() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url.includes('betpawa.ug')) {
    document.getElementById('games').innerHTML = '<div class="empty">Please navigate to betpawa.ug</div>';
    return;
  }
  
  document.getElementById('games').innerHTML = '<div class="empty">Loading games...</div>';
  
  chrome.tabs.sendMessage(tab.id, { action: 'extractGames' }, (response) => {
    if (chrome.runtime.lastError) {
      document.getElementById('games').innerHTML = '<div class="empty">Error: Reload the BetPawa page and try again</div>';
      return;
    }
    if (response && response.games) {
      allGames = response.games;
      displayGames();
    } else {
      document.getElementById('games').innerHTML = '<div class="empty">No games found. Click Debug to troubleshoot.</div>';
    }
  });
}

function openTotalGoals() {
  chrome.tabs.create({ url: 'https://www.betpawa.ug/events/popular?categoryId=2&marketId=Total%20Goals' });
}

function displayGames() {
  const qualified = allGames.filter(g => g.over15Odds >= 1.0);
  
  const container = document.getElementById('games');
  
  if (qualified.length === 0) {
    container.innerHTML = '<div class="empty">No games match criteria</div>';
    return;
  }
  
  container.innerHTML = qualified.map(game => `
    <div class="game qualified" data-id="${game.homeTeam}-${game.awayTeam}" data-url="${game.eventUrl || ''}" style="cursor: pointer;">
      <div class="match">${game.homeTeam} vs ${game.awayTeam}</div>
      <div class="odds">Over 1.5: ${game.over15Odds.toFixed(2)}</div>
      <div class="prob">
        Probability: ${game.over15Prob.toFixed(1)}%
      </div>
      <div class="actions">
        <button class="btn" onclick="trackGame('${game.homeTeam}', '${game.awayTeam}', 'won')">Won ✓</button>
        <button class="btn btn-danger" onclick="trackGame('${game.homeTeam}', '${game.awayTeam}', 'lost')">Lost ✗</button>
      </div>
    </div>
  `).join('');
  
  // Add click handlers to open game pages
  container.querySelectorAll('.game').forEach(gameEl => {
    gameEl.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') return; // Don't trigger on button clicks
      const url = gameEl.dataset.url;
      if (url && url !== 'null' && url !== 'undefined') {
        chrome.tabs.create({ url });
      }
    });
  });
  
  updateStats();
}

async function trackGame(home, away, result) {
  const stats = await chrome.storage.local.get(['trackedGames']) || { trackedGames: [] };
  const games = stats.trackedGames || [];
  
  games.push({
    home,
    away,
    result,
    timestamp: Date.now()
  });
  
  await chrome.storage.local.set({ trackedGames: games });
  updateStats();
  
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: 'Game Tracked',
    message: `${home} vs ${away} - ${result.toUpperCase()}`
  });
}

async function updateStats() {
  const stats = await chrome.storage.local.get(['trackedGames']) || { trackedGames: [] };
  const games = stats.trackedGames || [];
  
  const won = games.filter(g => g.result === 'won').length;
  const lost = games.filter(g => g.result === 'lost').length;
  const total = games.length;
  const winRate = total > 0 ? ((won / total) * 100).toFixed(1) : 0;
  
  document.getElementById('tracked').textContent = total;
  document.getElementById('won').textContent = won;
  document.getElementById('lost').textContent = lost;
  document.getElementById('winRate').textContent = winRate + '%';
}

async function clearStats() {
  if (confirm('Clear all tracked games?')) {
    await chrome.storage.local.set({ trackedGames: [] });
    updateStats();
  }
}

async function debugMode() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url.includes('betpawa.ug')) {
    alert('Please navigate to betpawa.ug first');
    return;
  }
  
  chrome.tabs.sendMessage(tab.id, { action: 'debugMode' }, (response) => {
    alert('Debug info logged to console. Press F12 to view.');
  });
}

// Make functions global
window.trackGame = trackGame;

document.getElementById('refresh').addEventListener('click', loadGames);
document.getElementById('openMarket').addEventListener('click', openTotalGoals);
document.getElementById('debug').addEventListener('click', debugMode);
document.getElementById('clearStats').addEventListener('click', clearStats);

// Load on popup open
loadGames();
updateStats();
