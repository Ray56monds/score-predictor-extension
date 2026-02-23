let allGames = [];

// Fetch games from odds API
async function loadGames() {
  document.getElementById('games').innerHTML = '<div class="empty">Loading games from API...</div>';
  
  try {
    // Using The Odds API (free tier: 500 requests/month)
    // Get your free API key at: https://the-odds-api.com/
    const apiKey = '8028a556094d0e2be461db4675019b2b';
    
    if (apiKey === 'YOUR_API_KEY_HERE') {
      document.getElementById('games').innerHTML = `
        <div class="empty">
          <p>⚠️ API Key Required</p>
          <p style="font-size: 10px; margin-top: 10px;">
            1. Get free API key at: <a href="https://the-odds-api.com/" target="_blank">the-odds-api.com</a><br>
            2. Edit popup-standalone.js line 8<br>
            3. Replace YOUR_API_KEY_HERE with your key
          </p>
        </div>
      `;
      return;
    }
    
    // Fetch soccer odds
    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/soccer_epl/odds/?apiKey=${apiKey}&regions=uk&markets=totals&oddsFormat=decimal`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Parse games with Over 1.5 odds
    allGames = data.map(event => {
      const homeTeam = event.home_team;
      const awayTeam = event.away_team;
      const eventUrl = `https://www.google.com/search?q=${encodeURIComponent(homeTeam + ' vs ' + awayTeam)}`;
      
      // Find Over 1.5 market
      let over15Odds = null;
      
      event.bookmakers?.forEach(bookmaker => {
        bookmaker.markets?.forEach(market => {
          if (market.key === 'totals') {
            market.outcomes?.forEach(outcome => {
              if (outcome.name === 'Over' && outcome.point === 1.5) {
                over15Odds = outcome.price;
              }
            });
          }
        });
      });
      
      if (!over15Odds) return null;
      
      return {
        homeTeam,
        awayTeam,
        over15Odds,
        over15Prob: (1 / over15Odds) * 100,
        eventUrl,
        timestamp: Date.now()
      };
    }).filter(game => game !== null);
    
    displayGames();
    
  } catch (error) {
    console.error('Error fetching games:', error);
    document.getElementById('games').innerHTML = `
      <div class="empty">
        ❌ Error loading games<br>
        <small>${error.message}</small>
      </div>
    `;
  }
}

function displayGames() {
  const qualified = allGames.filter(g => g.over15Odds >= 1.0);
  
  const container = document.getElementById('games');
  
  if (qualified.length === 0) {
    container.innerHTML = '<div class="empty">No games with Over 1.5 odds found</div>';
    return;
  }
  
  container.innerHTML = qualified.map(game => `
    <div class="game qualified" data-url="${game.eventUrl}" style="cursor: pointer;">
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
  
  // Add click handlers
  container.querySelectorAll('.game').forEach(gameEl => {
    gameEl.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      const url = gameEl.dataset.url;
      if (url) chrome.tabs.create({ url });
    });
  });
  
  updateStats();
}

async function trackGame(home, away, result) {
  const stats = await chrome.storage.local.get(['trackedGames']) || { trackedGames: [] };
  const games = stats.trackedGames || [];
  
  games.push({ home, away, result, timestamp: Date.now() });
  
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

function toggleCalculator() {
  const calcSection = document.getElementById('calcSection');
  calcSection.style.display = calcSection.style.display === 'none' ? 'block' : 'none';
}

function calculateOdds() {
  const totalOdds = parseFloat(document.getElementById('totalOdds').value);
  const numGames = parseInt(document.getElementById('numGames').value);
  const resultDiv = document.getElementById('calcResult');
  const teamSearchSection = document.getElementById('teamSearchSection');
  
  if (!totalOdds || !numGames || totalOdds <= 1 || numGames < 1) {
    resultDiv.innerHTML = '<span style="color: #e74c3c;">⚠️ Please enter valid values</span>';
    teamSearchSection.style.display = 'none';
    return;
  }
  
  // Calculate individual odds: totalOdds = odds1 × odds2 × odds3...
  // If all games have same odds: individualOdds = totalOdds^(1/numGames)
  const individualOdds = Math.pow(totalOdds, 1 / numGames);
  
  resultDiv.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 5px;">✅ Result:</div>
    <div>Each game odds: <strong>${individualOdds.toFixed(2)}</strong></div>
    <div style="margin-top: 5px; font-size: 10px; color: #7f8c8d;">
      Verification: ${individualOdds.toFixed(2)} × ${numGames} games = ${totalOdds.toFixed(2)}
    </div>
    <div style="margin-top: 5px; padding: 5px; background: #d5f4e6; border-radius: 3px;">
      <strong>Find games with odds around ${individualOdds.toFixed(2)}</strong>
    </div>
  `;
  
  // Show team search section
  teamSearchSection.style.display = 'block';
  generateTeamInputs(numGames, individualOdds);
}

function generateTeamInputs(numGames, targetOdds) {
  const container = document.getElementById('teamInputs');
  let html = '';
  
  for (let i = 1; i <= numGames; i++) {
    html += `
      <div style="margin-bottom: 5px;">
        <input type="text" id="team${i}" placeholder="Game ${i}: Team name" 
               style="width: 100%; padding: 4px; font-size: 11px; border: 1px solid #bdc3c7; border-radius: 3px;">
      </div>
    `;
  }
  
  container.innerHTML = html;
  container.dataset.targetOdds = targetOdds;
}

function searchTeams() {
  const numGames = parseInt(document.getElementById('numGames').value);
  const targetOdds = document.getElementById('teamInputs').dataset.targetOdds;
  const teams = [];
  
  for (let i = 1; i <= numGames; i++) {
    const teamInput = document.getElementById(`team${i}`);
    if (teamInput && teamInput.value.trim()) {
      teams.push(teamInput.value.trim());
    }
  }
  
  if (teams.length === 0) {
    alert('⚠️ Please enter at least one team name');
    return;
  }
  
  // Filter loaded games by team names and target odds
  const matchedGames = allGames.filter(game => {
    const teamMatch = teams.some(team => 
      game.homeTeam.toLowerCase().includes(team.toLowerCase()) ||
      game.awayTeam.toLowerCase().includes(team.toLowerCase())
    );
    const oddsMatch = Math.abs(game.over15Odds - parseFloat(targetOdds)) <= 0.3; // Within 0.3 of target
    return teamMatch && oddsMatch;
  });
  
  if (matchedGames.length > 0) {
    allGames = matchedGames;
    displayGames();
    document.getElementById('calcSection').style.display = 'none';
  } else {
    alert(`❌ No games found matching:\n- Teams: ${teams.join(', ')}\n- Target odds: ${targetOdds}\n\nTry clicking "Refresh" first or adjust team names.`);
  }
}

window.trackGame = trackGame;

document.getElementById('refresh').addEventListener('click', loadGames);
document.getElementById('calculator').addEventListener('click', toggleCalculator);
document.getElementById('calculate').addEventListener('click', calculateOdds);
document.getElementById('searchTeams').addEventListener('click', searchTeams);
document.getElementById('clearStats').addEventListener('click', clearStats);

loadGames();
updateStats();
