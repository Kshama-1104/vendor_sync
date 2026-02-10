// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
  await loadDashboard();
  
  // Sync now button
  document.getElementById('syncNowBtn')?.addEventListener('click', async () => {
    try {
      await syncApi.trigger(null, 'all');
      alert('Sync initiated successfully');
      await loadDashboard();
    } catch (error) {
      alert('Error initiating sync: ' + error.message);
    }
  });
});

async function loadDashboard() {
  try {
    const dashboard = await analyticsApi.getDashboard(null, '7d');
    updateStats(dashboard.summary);
    updateActivity(dashboard.recentActivity);
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

function updateStats(summary) {
  document.getElementById('totalVendors').textContent = summary?.totalVendors || 0;
  document.getElementById('activeSyncs').textContent = summary?.activeVendors || 0;
  document.getElementById('totalProducts').textContent = summary?.totalSyncs || 0;
  document.getElementById('failedSyncs').textContent = summary?.failedSyncs || 0;
}

function updateActivity(activities) {
  const tbody = document.getElementById('activityTableBody');
  if (!activities || activities.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No recent activity</td></tr>';
    return;
  }

  tbody.innerHTML = activities.map(activity => `
    <tr>
      <td>${activity.vendor || 'N/A'}</td>
      <td>${activity.type || 'N/A'}</td>
      <td><span class="status-badge ${activity.status}">${activity.status}</span></td>
      <td>${activity.records || 0}</td>
      <td>${new Date(activity.timestamp).toLocaleString()}</td>
    </tr>
  `).join('');
}


