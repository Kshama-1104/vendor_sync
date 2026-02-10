const API_BASE = 'http://localhost:3000/api/v1';

document.addEventListener('DOMContentLoaded', async () => {
    await loadDashboard();
});

async function loadDashboard() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/analytics/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
            updateStats(data.data.summary);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function updateStats(summary) {
    document.getElementById('totalTasks').textContent = summary?.totalTasks || 0;
    document.getElementById('completedTasks').textContent = summary?.completedTasks || 0;
}


