// Background service worker for notifications
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'notify') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Qualifying Games Found!',
      message: `${request.count} game(s) match your criteria (>75% BTTS & Over 1.5)`
    });
  }
});

// Badge update
chrome.storage.local.get(['trackedGames'], (result) => {
  const games = result.trackedGames || [];
  const won = games.filter(g => g.result === 'won').length;
  const total = games.length;
  
  if (total > 0) {
    const winRate = ((won / total) * 100).toFixed(0);
    chrome.action.setBadgeText({ text: winRate + '%' });
    chrome.action.setBadgeBackgroundColor({ color: '#27ae60' });
  }
});
