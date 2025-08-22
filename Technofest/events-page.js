(function(){
  const API_BASE_URL = window.location.origin;

  const containers = {
    workshop: document.getElementById('workshopsContainer'),
    'tech-symposium': document.getElementById('techSymposiumsContainer'),
    hackathon: document.getElementById('hackathonsContainer'),
    'guest-lecture': document.getElementById('guestLecturesContainer'),
    dept: document.getElementById('deptEventsContainer')
  };

  function createCard(evt){
    const card = document.createElement('div');
    card.className = 'event-card';
    const startDate = evt.startDate ? new Date(evt.startDate).toLocaleDateString() : '';
    const endDate = evt.endDate ? new Date(evt.endDate).toLocaleDateString() : '';
    card.innerHTML = `
      <div class="event-content">
        <h3 class="event-title">${evt.title || 'Event'}</h3>
        <p class="event-domain">${evt.domain || ''}</p>
        <div class="event-details">
          <div><strong>Date:</strong> ${startDate}${endDate ? ' - ' + endDate : ''}</div>
          <div><strong>Venue:</strong> ${evt.venue || 'TBD'}</div>
        </div>
        ${evt.eventLink ? `<div style="margin-top:8px"><a href="${evt.eventLink}" target="_blank">Register</a></div>` : ''}
      </div>
    `;
    return card;
  }

  async function loadCategory(category, target){
    if (!target) return;
    target.innerHTML = '<p class="empty-state">Loading...</p>';
    try{
      const url = new URL(`${API_BASE_URL}/api/events`);
      if (category !== 'dept') {
        url.searchParams.set('category', category);
      }
      // For Department Events show intra and inter both
      if (category === 'dept') {
        const [intraRes, interRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/events?scope=intra&limit=12`),
          fetch(`${API_BASE_URL}/api/events?scope=inter&limit=12`)
        ]);
        const [intraJson, interJson] = await Promise.all([intraRes.json(), interRes.json()]);
        const events = [...(intraJson.events||[]), ...(interJson.events||[])];
        return renderList(events, target);
      }
      const res = await fetch(url.toString());
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed');
      renderList(json.events || [], target);
    }catch(err){
      target.innerHTML = `<p class="empty-state">Failed to load (${category}).</p>`;
      console.error('Load category failed', category, err);
    }
  }

  function renderList(events, target){
    target.innerHTML = '';
    if (!events.length){
      target.innerHTML = '<p class="empty-state">No events available.</p>';
      return;
    }
    events.forEach(evt=> target.appendChild(createCard(evt)));
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    loadCategory('workshop', containers.workshop);
    loadCategory('tech-symposium', containers['tech-symposium']);
    loadCategory('hackathon', containers.hackathon);
    loadCategory('guest-lecture', containers['guest-lecture']);
    loadCategory('dept', containers.dept);
  });
})();
