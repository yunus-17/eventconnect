// EventConnect Admin Dashboard JavaScript

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  // Navigation elements
  const navItems = document.querySelectorAll('.nav-item');
  const contentSections = document.querySelectorAll('.content-section');
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminName = document.getElementById('adminName');
  
  // Workshop elements
  const addWorkshopBtn = document.getElementById('addWorkshopBtn');
  const workshopFormContainer = document.getElementById('workshopFormContainer');
  const workshopForm = document.getElementById('workshopForm');
  const cancelWorkshopBtn = document.getElementById('cancelWorkshopBtn');
  const workshopsContainer = document.getElementById('workshopsContainer');
  
  // Hackathon elements
  const hackathonsContent = document.getElementById('hackathons-content');
  let addHackathonBtn;
  let hackathonFormContainer;
  let hackathonForm;
  let cancelHackathonBtn;
  let hackathonsContainer;
  
  // Submenu handling
  const submenuItems = document.querySelectorAll('.has-submenu');
  
  // Set admin name from localStorage if available
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      adminName.textContent = userData.name || 'Admin';
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  // Toggle submenu
  submenuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      if (e.target === this.querySelector('a') || e.target.parentElement === this.querySelector('a')) {
        e.preventDefault();
        this.classList.toggle('open');
      }
      // Department Events Management Functionality
  
  // Intra-Department Events Variables
  const intraDeptEventsContent = document.getElementById('intra-dept-events-content');
  let addIntraDeptEventBtn;
  let intraDeptEventFormContainer;
  let intraDeptEventForm;
  let cancelIntraDeptEventBtn;
  let eventCount;
  let eventFormsContainer;
  let technicalEventsContainer;
  let nonTechnicalEventsContainer;
  
  // Inter-Department Events Variables
  const interDeptEventsContent = document.getElementById('inter-dept-events-content');
  let addInterDeptEventBtn;
  let interDeptEventFormContainer;
  let interDeptEventForm;
  let cancelInterDeptEventBtn;
  let interEventCount;
  let interEventFormsContainer;
  let interDeptEventsContainer;
  
  // Initialize Intra-Department Events UI when the tab is clicked
  const intraDeptEventsTab = document.querySelector('.nav-item[data-content="intra-dept-events"]');
  if (intraDeptEventsTab) {
    intraDeptEventsTab.addEventListener('click', () => {
      // Initialize UI if not already initialized
      if (!addIntraDeptEventBtn) {
        initIntraDeptEventsUI();
      }
    });
  }
  
  // Initialize Inter-Department Events UI when the tab is clicked
  const interDeptEventsTab = document.querySelector('.nav-item[data-content="inter-dept-events"]');
  if (interDeptEventsTab) {
    interDeptEventsTab.addEventListener('click', () => {
      // Initialize UI if not already initialized
      if (!addInterDeptEventBtn) {
        initInterDeptEventsUI();
      }
    });
  }
  
  // Function to initialize Intra-Department Events UI
  function initIntraDeptEventsUI() {
    // Create references to intra-department events elements
    addIntraDeptEventBtn = intraDeptEventsContent.querySelector('#addIntraDeptEventBtn');
    intraDeptEventFormContainer = intraDeptEventsContent.querySelector('#intraDeptEventFormContainer');
    intraDeptEventForm = intraDeptEventsContent.querySelector('#intraDeptEventForm');
    cancelIntraDeptEventBtn = intraDeptEventsContent.querySelector('#cancelIntraDeptEventBtn');
    eventCount = intraDeptEventForm.querySelector('#eventCount');
    eventFormsContainer = intraDeptEventForm.querySelector('#eventFormsContainer');
    technicalEventsContainer = intraDeptEventsContent.querySelector('#technicalEventsContainer');
    nonTechnicalEventsContainer = intraDeptEventsContent.querySelector('#nonTechnicalEventsContainer');
    
    // Generate initial event form
    generateEventForms(1);
    
    // Handle event count changes
    eventCount.addEventListener('change', function() {
      const count = parseInt(this.value) || 1;
      generateEventForms(count);
    });
    
    // Show intra-department event form
    addIntraDeptEventBtn.addEventListener('click', () => {
      intraDeptEventFormContainer.style.display = 'block';
      addIntraDeptEventBtn.style.display = 'none';
      
      // Scroll to form
      intraDeptEventFormContainer.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Cancel intra-department event form
    cancelIntraDeptEventBtn.addEventListener('click', () => {
      intraDeptEventFormContainer.style.display = 'none';
      addIntraDeptEventBtn.style.display = 'flex';
      intraDeptEventForm.reset();
      generateEventForms(1); // Reset to one form
    });
    
    // Handle form submission
    intraDeptEventForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate form
      if (!validateIntraDeptEventForm()) {
        return;
      }
      
      // Collect form data
      const formData = new FormData(intraDeptEventForm);
      const count = parseInt(formData.get('eventCount')) || 1;
      const category = formData.get('eventCategory');
      
      // Collect events data
      const events = [];
      for (let i = 0; i < count; i++) {
        // Get participation type
        const participationType = [];
        if (formData.has(`events[${i}].participationTypeTeam`)) participationType.push('Team');
        if (formData.has(`events[${i}].participationTypeIndividual`)) participationType.push('Individual');
        
        // Get eligibility years
        const eligibility = [];
        if (formData.has(`events[${i}].secondYear`)) eligibility.push('2nd Year');
        if (formData.has(`events[${i}].thirdYear`)) eligibility.push('3rd Year');
        if (formData.has(`events[${i}].fourthYear`)) eligibility.push('4th Year');
        
        // Get special tags
        const specialTags = [];
        if (formData.has(`events[${i}].requiresLaptop`)) specialTags.push('Requires Laptop');
        if (formData.has(`events[${i}].certificateProvided`)) specialTags.push('Certificate Provided');
        if (formData.has(`events[${i}].prizeMoney`)) specialTags.push('Prize Money');
        if (formData.has(`events[${i}].mandatoryEvent`)) specialTags.push('Mandatory Event');
        
        events.push({
          name: formData.get(`events[${i}].name`),
          description: formData.get(`events[${i}].description`),
          posterUrl: formData.get(`events[${i}].posterUrl`) || '',
          participationType: participationType,
          maxTeamSize: participationType.includes('Team') ? parseInt(formData.get(`events[${i}].maxTeamSize`)) || 1 : null,
          mode: formData.get(`events[${i}].mode`),
          startDateTime: formData.get(`events[${i}].startDateTime`),
          endDateTime: formData.get(`events[${i}].endDateTime`),
          registrationDeadline: formData.get(`events[${i}].registrationDeadline`),
          eligibility: eligibility,
          specialNotes: formData.get(`events[${i}].specialNotes`) || '',
          simultaneousCheck: formData.has(`events[${i}].simultaneousCheck`),
          specialTags: specialTags,
          category: category
        });
      }
      
      // Log the events data
      console.log('Intra-Department Events Data:', events);
      
      // Send events data to backend
      try {
        const token = localStorage.getItem('token');
        
        // First, create the main event
        // Calculate the earliest start date from sub-events to set as main event start date
        const earliestStartDate = events.reduce((earliest, event) => {
          const eventStart = new Date(event.startDateTime);
          return eventStart < earliest ? eventStart : earliest;
        }, new Date(events[0].startDateTime));
        
        // Calculate the latest end date from sub-events to set as main event end date
        const latestEndDate = events.reduce((latest, event) => {
          const eventEnd = new Date(event.endDateTime);
          return eventEnd > latest ? eventEnd : latest;
        }, new Date(events[0].endDateTime));
        
        // Calculate the earliest registration deadline from sub-events
        const earliestRegistrationDeadline = events.reduce((earliest, event) => {
          const eventDeadline = new Date(event.registrationDeadline);
          return eventDeadline < earliest ? eventDeadline : earliest;
        }, new Date(events[0].registrationDeadline));
        
        const mainEventResponse = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
              title: formData.get('mainEventName'),
              description: `Main event containing ${count} sub-events`,
              category: 'main-event',
              isMainEvent: true,
              domain: 'Department Events',
              posterUrl: 'https://example.com/default-poster.jpg',
              startDate: earliestStartDate,
              endDate: latestEndDate,
              duration: 'Multiple days',
              coordinatorName: 'Event Coordinator',
              coordinatorEmail: 'coordinator@example.com',
              coordinatorPhone: '1234567890',
              venue: 'Department Venue',
              maxParticipants: 1000,
              registrationDeadline: earliestRegistrationDeadline,
              googleFormLink: formData.get('mainEventGoogleForm'),
              eventType: {
                intraDept: true,
                interDept: false,
                online: false,
                offline: true
              },
              certificationProvided: true,
              prerequisites: 'Department student',
              prizes: 'Certificates for winners',
              rules: 'Follow all department guidelines'
            })
        });
        
        if (!mainEventResponse.ok) {
          throw new Error('Failed to create main event');
        }
        
        const mainEventResult = await mainEventResponse.json();
        const mainEventId = mainEventResult.event._id;
        
        // Now create sub-events linked to the main event
        const promises = events.map(event => 
          fetch('/api/events', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: event.name,
              description: event.description,
              category: 'tech-symposium',
              subCategory: event.category,
              mainEventId: mainEventId,
              domain: event.category === 'technical' ? 'Technical Events' : 'Non-Technical Events',
              posterUrl: event.posterUrl || 'https://example.com/default-poster.jpg',
              startDate: event.startDateTime,
              endDate: event.endDateTime,
              duration: `${Math.ceil((new Date(event.endDateTime) - new Date(event.startDateTime)) / (1000 * 60 * 60 * 24))} days`,
              coordinatorName: 'Event Coordinator',
              coordinatorEmail: 'coordinator@example.com',
              coordinatorPhone: '',
              venue: 'TBD',
              maxParticipants: event.maxTeamSize * 10 || 100,
              registrationDeadline: event.registrationDeadline,
              googleFormLink: event.googleFormLink || '',
              eventType: {
                intraDept: true,
                interDept: false,
                online: event.mode === 'Online',
                offline: event.mode === 'Offline'
              },
              certificationProvided: event.specialTags.includes('Certificate Provided'),
              prerequisites: event.specialNotes || '',
              prizes: event.specialTags.includes('Prize Money') ? 'Prize money available' : '',
              rules: ''
            })
          })
        );
        
        const responses = await Promise.all(promises);
        const results = await Promise.all(responses.map(r => r.json()));
        
        // Check if all events were created successfully
        const allSuccess = results.every(r => r.success);
        if (allSuccess) {
          // Create event cards for each event
          events.forEach((event, index) => {
            createEventCard({
              ...event,
              id: results[index].event._id
            }, 'intra');
          });
          
          // Hide form and reset
          intraDeptEventFormContainer.style.display = 'none';
          addIntraDeptEventBtn.style.display = 'flex';
          intraDeptEventForm.reset();
          generateEventForms(1); // Reset to one form
          
          // Remove empty state if it exists
          const container = category === 'technical' ? technicalEventsContainer : nonTechnicalEventsContainer;
          const emptyState = container.querySelector('.empty-state');
          if (emptyState) {
            emptyState.remove();
          }
          
          // Show success message
          showNotification('Intra-department events created successfully!', 'success');
          
          // Refresh all events to show the new events
          loadAllEvents();
          
          // Notify user dashboards about new events
          notifyUserDashboards('New intra-department events have been added!', results.map(r => r.event._id), formData.get('mainEventName'));
        } else {
          throw new Error('Some events failed to create');
        }
      } catch (error) {
        console.error('Error creating intra-department events:', error);
        showNotification('Failed to create events. Please try again.', 'error');
      }
    });
  }
  
  // Function to generate event forms for Intra-Department Events
  function generateEventForms(count) {
    // Clear existing event forms
    eventFormsContainer.innerHTML = '';
    
    // Generate new event forms
    for (let i = 0; i < count; i++) {
      const eventForm = document.createElement('div');
      eventForm.className = 'event-form';
      eventForm.innerHTML = `
        <div class="event-form-header">
          <h4>Event ${i + 1}</h4>
          ${count > 1 ? `<button type="button" class="collapse-btn" data-index="${i}">Collapse</button>` : ''}
        </div>
        <div class="event-form-content" id="eventFormContent${i}">
          <div class="form-grid">
            <div class="form-group">
              <label for="eventName${i}">Event Name</label>
              <input type="text" id="eventName${i}" name="events[${i}].name" required>
            </div>
            
            <div class="form-group">
              <label for="eventPosterUrl${i}">Event Poster / Banner URL (optional)</label>
              <input type="url" id="eventPosterUrl${i}" name="events[${i}].posterUrl" placeholder="https://example.com/image.jpg">
            </div>
            
            <div class="form-group">
              <label>Participation Type</label>
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <input type="checkbox" id="participationTypeTeam${i}" name="events[${i}].participationTypeTeam" class="participation-type-checkbox" data-index="${i}">
                  <label for="participationTypeTeam${i}">Team</label>
                </div>
                <div class="checkbox-item">
                  <input type="checkbox" id="participationTypeIndividual${i}" name="events[${i}].participationTypeIndividual" class="participation-type-checkbox">
                  <label for="participationTypeIndividual${i}">Individual</label>
                </div>
              </div>
            </div>
            
            <div class="form-group team-size-group" id="teamSizeGroup${i}" style="display: none;">
              <label for="maxTeamSize${i}">Max Team Size</label>
              <input type="number" id="maxTeamSize${i}" name="events[${i}].maxTeamSize" min="2" value="2">
            </div>
            
            <div class="form-group">
              <label for="eventMode${i}">Event Mode</label>
              <select id="eventMode${i}" name="events[${i}].mode" required>
                <option value="">Select Mode</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="eventStartDateTime${i}">Event Start Date & Time</label>
              <input type="datetime-local" id="eventStartDateTime${i}" name="events[${i}].startDateTime" required>
            </div>
            
            <div class="form-group">
              <label for="eventEndDateTime${i}">Event End Date & Time</label>
              <input type="datetime-local" id="eventEndDateTime${i}" name="events[${i}].endDateTime" required>
            </div>
            
            <div class="form-group">
              <label for="eventRegistrationDeadline${i}">Registration Deadline</label>
              <input type="datetime-local" id="eventRegistrationDeadline${i}" name="events[${i}].registrationDeadline" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="eventDescription${i}">Event Description</label>
            <textarea id="eventDescription${i}" name="events[${i}].description" rows="3" required></textarea>
          </div>
          
          <div class="form-group">
            <label>Eligibility (Year)</label>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input type="checkbox" id="secondYear${i}" name="events[${i}].secondYear">
                <label for="secondYear${i}">2nd Year</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="thirdYear${i}" name="events[${i}].thirdYear">
                <label for="thirdYear${i}">3rd Year</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="fourthYear${i}" name="events[${i}].fourthYear">
                <label for="fourthYear${i}">4th Year</label>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="eventSpecialNotes${i}">Special Notes</label>
            <textarea id="eventSpecialNotes${i}" name="events[${i}].specialNotes" rows="2"></textarea>
          </div>
          
          <div class="form-group">
            <div class="checkbox-item">
              <input type="checkbox" id="simultaneousCheck${i}" name="events[${i}].simultaneousCheck" checked>
              <label for="simultaneousCheck${i}">Prevent simultaneous event registration</label>
            </div>
          </div>
          
          <div class="form-group">
            <label>Special Tags</label>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input type="checkbox" id="requiresLaptop${i}" name="events[${i}].requiresLaptop">
                <label for="requiresLaptop${i}">Requires Laptop</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="certificateProvided${i}" name="events[${i}].certificateProvided">
                <label for="certificateProvided${i}">Certificate Provided</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="prizeMoney${i}" name="events[${i}].prizeMoney">
                <label for="prizeMoney${i}">Prize Money</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="mandatoryEvent${i}" name="events[${i}].mandatoryEvent">
                <label for="mandatoryEvent${i}">Mandatory Event</label>
              </div>
            </div>
          </div>
        </div>
      `;
      
      eventFormsContainer.appendChild(eventForm);
      
      // Add event listener for team size visibility
      const teamCheckbox = eventForm.querySelector(`#participationTypeTeam${i}`);
      const teamSizeGroup = eventForm.querySelector(`#teamSizeGroup${i}`);
      
      teamCheckbox.addEventListener('change', function() {
        teamSizeGroup.style.display = this.checked ? 'block' : 'none';
      });
      
      // Add event listener for collapse button
      if (count > 1) {
        const collapseBtn = eventForm.querySelector('.collapse-btn');
        const contentDiv = eventForm.querySelector(`#eventFormContent${i}`);
        
        collapseBtn.addEventListener('click', function() {
          const isCollapsed = contentDiv.style.display === 'none';
          contentDiv.style.display = isCollapsed ? 'block' : 'none';
          this.textContent = isCollapsed ? 'Collapse' : 'Expand';
        });
      }
    }
  }
  
  // Function to initialize Inter-Department Events UI
  function initInterDeptEventsUI() {
    // Create references to inter-department events elements
    addInterDeptEventBtn = interDeptEventsContent.querySelector('#addInterDeptEventBtn');
    interDeptEventFormContainer = interDeptEventsContent.querySelector('#interDeptEventFormContainer');
    interDeptEventForm = interDeptEventsContent.querySelector('#interDeptEventForm');
    cancelInterDeptEventBtn = interDeptEventsContent.querySelector('#cancelInterDeptEventBtn');
    interEventCount = interDeptEventForm.querySelector('#interEventCount');
    interEventFormsContainer = interDeptEventForm.querySelector('#interEventFormsContainer');
    interDeptEventsContainer = interDeptEventsContent.querySelector('#interDeptEventsContainer');
    
    // Generate initial event form
    generateInterEventForms(1);
    
    // Handle event count changes
    interEventCount.addEventListener('change', function() {
      const count = parseInt(this.value) || 1;
      generateInterEventForms(count);
    });
    
    // Show inter-department event form
    addInterDeptEventBtn.addEventListener('click', () => {
      interDeptEventFormContainer.style.display = 'block';
      addInterDeptEventBtn.style.display = 'none';
      
      // Scroll to form
      interDeptEventFormContainer.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Cancel inter-department event form
    cancelInterDeptEventBtn.addEventListener('click', () => {
      interDeptEventFormContainer.style.display = 'none';
      addInterDeptEventBtn.style.display = 'flex';
      interDeptEventForm.reset();
      generateInterEventForms(1); // Reset to one form
    });
    
    // Handle form submission
    interDeptEventForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate form
      if (!validateInterDeptEventForm()) {
        return;
      }
      
      // Collect form data
      const formData = new FormData(interDeptEventForm);
      const count = parseInt(formData.get('interEventCount')) || 1;
      
      // Collect events data
      const events = [];
      for (let i = 0; i < count; i++) {
        // Get participation type
        const participationType = [];
        if (formData.has(`interEvents[${i}].participationTypeTeam`)) participationType.push('Team');
        if (formData.has(`interEvents[${i}].participationTypeIndividual`)) participationType.push('Individual');
        
        // Get eligibility years
        const eligibility = [];
        if (formData.has(`interEvents[${i}].secondYear`)) eligibility.push('2nd Year');
        if (formData.has(`interEvents[${i}].thirdYear`)) eligibility.push('3rd Year');
        if (formData.has(`interEvents[${i}].fourthYear`)) eligibility.push('4th Year');
        
        // Get eligible departments
        const eligibleDepartments = [];
        const departmentSelect = document.getElementById(`eligibleDepartments${i}`);
        if (departmentSelect) {
          Array.from(departmentSelect.selectedOptions).forEach(option => {
            eligibleDepartments.push(option.value);
          });
        }
        
        // Get special tags
        const specialTags = [];
        if (formData.has(`interEvents[${i}].requiresLaptop`)) specialTags.push('Requires Laptop');
        if (formData.has(`interEvents[${i}].certificateProvided`)) specialTags.push('Certificate Provided');
        if (formData.has(`interEvents[${i}].prizeMoney`)) specialTags.push('Prize Money');
        if (formData.has(`interEvents[${i}].mandatoryEvent`)) specialTags.push('Mandatory Event');
        
        events.push({
          name: formData.get(`interEvents[${i}].name`),
          description: formData.get(`interEvents[${i}].description`),
          posterUrl: formData.get(`interEvents[${i}].posterUrl`) || '',
          participationType: participationType,
          maxTeamSize: participationType.includes('Team') ? parseInt(formData.get(`interEvents[${i}].maxTeamSize`)) || 1 : null,
          mode: formData.get(`interEvents[${i}].mode`),
          startDateTime: formData.get(`interEvents[${i}].startDateTime`),
          endDateTime: formData.get(`interEvents[${i}].endDateTime`),
          registrationDeadline: formData.get(`interEvents[${i}].registrationDeadline`),
          eligibility: eligibility,
          eligibleDepartments: eligibleDepartments,
          eventLevel: formData.get(`interEvents[${i}].eventLevel`),
          registrationFee: formData.get(`interEvents[${i}].registrationFee`) || '',
          externalJudge: formData.get(`interEvents[${i}].externalJudge`) || '',
          specialNotes: formData.get(`interEvents[${i}].specialNotes`) || '',
          simultaneousCheck: formData.has(`interEvents[${i}].simultaneousCheck`),
          specialTags: specialTags
        });
      }
      
      // Log the events data
      console.log('Inter-Department Events Data:', events);
      
      // Send events data to backend
      try {
        const token = localStorage.getItem('token');
        
        // Calculate the earliest start date from sub-events to set as main event start date
        const earliestStartDate = events.reduce((earliest, event) => {
          const eventStart = new Date(event.startDateTime);
          return eventStart < earliest ? eventStart : earliest;
        }, new Date(events[0].startDateTime));
        
        // Calculate the latest end date from sub-events to set as main event end date
        const latestEndDate = events.reduce((latest, event) => {
          const eventEnd = new Date(event.endDateTime);
          return eventEnd > latest ? eventEnd : latest;
        }, new Date(events[0].endDateTime));
        
        // Calculate the earliest registration deadline from sub-events
        const earliestRegistrationDeadline = events.reduce((earliest, event) => {
          const eventDeadline = new Date(event.registrationDeadline);
          return eventDeadline < earliest ? eventDeadline : earliest;
        }, new Date(events[0].registrationDeadline));
        
        // First, create the main event
        const mainEventResponse = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: formData.get('mainEventName'),
            description: `Main event containing ${count} sub-events`,
            category: 'main-event',
            isMainEvent: true,
            domain: 'Inter-Department Events',
            posterUrl: 'https://example.com/default-poster.jpg',
            startDate: earliestStartDate,
            endDate: latestEndDate,
            duration: 'Multiple days',
            coordinatorName: 'Event Coordinator',
            coordinatorEmail: 'coordinator@example.com',
            coordinatorPhone: '1234567890',
            venue: 'Main Campus',
            maxParticipants: 1000,
            registrationDeadline: earliestRegistrationDeadline,
            googleFormLink: formData.get('interMainEventGoogleForm'),
            eventType: {
              intraDept: false,
              interDept: true,
              online: false,
              offline: true
            },
            certificationProvided: true,
            prerequisites: 'College student',
            prizes: 'Certificates and trophies',
            rules: 'Follow all event guidelines'
          })
        });
        
        if (!mainEventResponse.ok) {
          throw new Error('Failed to create main event');
        }
        
        const mainEventResult = await mainEventResponse.json();
        const mainEventId = mainEventResult.event._id;
        
        // Now create sub-events linked to the main event
        const promises = events.map(event => 
          fetch('/api/events', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: event.name,
              description: event.description,
              category: 'tech-symposium',
              subCategory: 'technical', // Default to technical for inter-dept
              mainEventId: mainEventId,
              domain: 'Inter-Department Events',
              posterUrl: event.posterUrl || 'https://example.com/default-poster.jpg',
              startDate: event.startDateTime,
              endDate: event.endDateTime,
              duration: `${Math.ceil((new Date(event.endDateTime) - new Date(event.startDateTime)) / (1000 * 60 * 60 * 24))} days`,
              coordinatorName: 'Event Coordinator',
              coordinatorEmail: 'coordinator@example.com',
              coordinatorPhone: '',
              venue: 'TBD',
              maxParticipants: event.maxTeamSize * 10 || 100,
              registrationDeadline: event.registrationDeadline,
              eventType: {
                intraDept: false,
                interDept: true,
                online: event.mode === 'Online',
                offline: event.mode === 'Offline'
              },
              certificationProvided: event.specialTags.includes('Certificate Provided'),
              prerequisites: event.specialNotes || '',
              prizes: event.specialTags.includes('Prize Money') ? 'Prize money available' : '',
              rules: ''
            })
          })
        );
        
        const responses = await Promise.all(promises);
        const results = await Promise.all(responses.map(r => r.json()));
        
        // Check if all events were created successfully
        const allSuccess = results.every(r => r.success);
        if (allSuccess) {
          // Create event cards for each event
          events.forEach((event, index) => {
            createEventCard({
              ...event,
              id: results[index].event._id
            }, 'inter');
          });
          
          // Hide form and reset
          interDeptEventFormContainer.style.display = 'none';
          addInterDeptEventBtn.style.display = 'flex';
          interDeptEventForm.reset();
          generateInterEventForms(1); // Reset to one form
          
          // Remove empty state if it exists
          const emptyState = interDeptEventsContainer.querySelector('.emptyState');
          if (emptyState) {
            emptyState.remove();
          }
          
          // Show success message
          showNotification('Inter-department events created successfully!', 'success');
          
          // Refresh all events to show the new events
          loadAllEvents();
          
          // Notify user dashboards about new events
          notifyUserDashboards('New inter-department events have been added!', results.map(r => r.event._id), formData.get('mainEventName'));
        } else {
          throw new Error('Some events failed to create');
        }
      } catch (error) {
        console.error('Error creating inter-department events:', error);
        showNotification('Failed to create events. Please try again.', 'error');
      }
    });
  }
  
  // Function to generate event forms for Inter-Department Events
  function generateInterEventForms(count) {
    // Clear existing event forms
    interEventFormsContainer.innerHTML = '';
    
    // Generate new event forms
    for (let i = 0; i < count; i++) {
      const eventForm = document.createElement('div');
      eventForm.className = 'event-form';
      eventForm.innerHTML = `
        <div class="event-form-header">
          <h4>Event ${i + 1}</h4>
          ${count > 1 ? `<button type="button" class="collapse-btn" data-index="${i}">Collapse</button>` : ''}
        </div>
        <div class="event-form-content" id="interEventFormContent${i}">
          <div class="form-grid">
            <div class="form-group">
              <label for="interEventName${i}">Event Name</label>
              <input type="text" id="interEventName${i}" name="interEvents[${i}].name" required>
            </div>
            
            <div class="form-group">
              <label for="interEventPosterUrl${i}">Event Poster / Banner URL (optional)</label>
              <input type="url" id="interEventPosterUrl${i}" name="interEvents[${i}].posterUrl" placeholder="https://example.com/image.jpg">
            </div>
            
            <div class="form-group">
              <label>Participation Type</label>
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <input type="checkbox" id="interParticipationTypeTeam${i}" name="interEvents[${i}].participationTypeTeam" class="participation-type-checkbox" data-index="${i}">
                  <label for="interParticipationTypeTeam${i}">Team</label>
                </div>
                <div class="checkbox-item">
                  <input type="checkbox" id="interParticipationTypeIndividual${i}" name="interEvents[${i}].participationTypeIndividual" class="participation-type-checkbox">
                  <label for="interParticipationTypeIndividual${i}">Individual</label>
                </div>
              </div>
            </div>
            
            <div class="form-group team-size-group" id="interTeamSizeGroup${i}" style="display: none;">
              <label for="interMaxTeamSize${i}">Max Team Size</label>
              <input type="number" id="interMaxTeamSize${i}" name="interEvents[${i}].maxTeamSize" min="2" value="2">
            </div>
            
            <div class="form-group">
              <label for="interEventMode${i}">Event Mode</label>
              <select id="interEventMode${i}" name="interEvents[${i}].mode" required>
                <option value="">Select Mode</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="interEventStartDateTime${i}">Event Start Date & Time</label>
              <input type="datetime-local" id="interEventStartDateTime${i}" name="interEvents[${i}].startDateTime" required>
            </div>
            
            <div class="form-group">
              <label for="interEventEndDateTime${i}">Event End Date & Time</label>
              <input type="datetime-local" id="interEventEndDateTime${i}" name="interEvents[${i}].endDateTime" required>
            </div>
            
            <div class="form-group">
              <label for="interEventRegistrationDeadline${i}">Registration Deadline</label>
              <input type="datetime-local" id="interEventRegistrationDeadline${i}" name="interEvents[${i}].registrationDeadline" required>
            </div>
            
            <div class="form-group">
              <label for="eligibleDepartments${i}">Eligible Departments</label>
              <select id="eligibleDepartments${i}" name="interEvents[${i}].eligibleDepartments" multiple required>
                <option value="CSE">Computer Science and Engineering</option>
                <option value="IT">Information Technology</option>
                <option value="ECE">Electronics and Communication Engineering</option>
                <option value="EEE">Electrical and Electronics Engineering</option>
                <option value="MECH">Mechanical Engineering</option>
                <option value="CIVIL">Civil Engineering</option>
                <option value="CHEM">Chemical Engineering</option>
                <option value="BIOTECH">Biotechnology</option>
              </select>
              <small>Hold Ctrl/Cmd to select multiple departments</small>
            </div>
            
            <div class="form-group">
              <label for="interEventLevel${i}">Event Level</label>
              <select id="interEventLevel${i}" name="interEvents[${i}].eventLevel" required>
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="interRegistrationFee${i}">Registration Fee (optional)</label>
              <input type="number" id="interRegistrationFee${i}" name="interEvents[${i}].registrationFee" min="0" placeholder="Leave empty if free">
            </div>
            
            <div class="form-group">
              <label for="interExternalJudge${i}">External Judge / Company Name (optional)</label>
              <input type="text" id="interExternalJudge${i}" name="interEvents[${i}].externalJudge">
            </div>
          </div>
          
          <div class="form-group">
            <label for="interEventDescription${i}">Event Description</label>
            <textarea id="interEventDescription${i}" name="interEvents[${i}].description" rows="3" required></textarea>
          </div>
          
          <div class="form-group">
            <label>Eligibility (Year)</label>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input type="checkbox" id="interSecondYear${i}" name="interEvents[${i}].secondYear">
                <label for="interSecondYear${i}">2nd Year</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="interThirdYear${i}" name="interEvents[${i}].thirdYear">
                <label for="interThirdYear${i}">3rd Year</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="interFourthYear${i}" name="interEvents[${i}].fourthYear">
                <label for="interFourthYear${i}">4th Year</label>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="interEventSpecialNotes${i}">Special Notes</label>
            <textarea id="interEventSpecialNotes${i}" name="interEvents[${i}].specialNotes" rows="2"></textarea>
          </div>
          
          <div class="form-group">
            <div class="checkbox-item">
              <input type="checkbox" id="interSimultaneousCheck${i}" name="interEvents[${i}].simultaneousCheck" checked>
              <label for="interSimultaneousCheck${i}">Show warning for simultaneous event registration (admin can override)</label>
            </div>
          </div>
          
          <div class="form-group">
            <label>Special Tags</label>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input type="checkbox" id="interRequiresLaptop${i}" name="interEvents[${i}].requiresLaptop">
                <label for="interRequiresLaptop${i}">Requires Laptop</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="interCertificateProvided${i}" name="interEvents[${i}].certificateProvided">
                <label for="interCertificateProvided${i}">Certificate Provided</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="interPrizeMoney${i}" name="interEvents[${i}].prizeMoney">
                <label for="interPrizeMoney${i}">Prize Money</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="interMandatoryEvent${i}" name="interEvents[${i}].mandatoryEvent">
                <label for="interMandatoryEvent${i}">Mandatory Event</label>
              </div>
            </div>
          </div>
        </div>
      `;
      
      interEventFormsContainer.appendChild(eventForm);
      
      // Add event listener for team size visibility
      const teamCheckbox = eventForm.querySelector(`#interParticipationTypeTeam${i}`);
      const teamSizeGroup = eventForm.querySelector(`#interTeamSizeGroup${i}`);
      
      teamCheckbox.addEventListener('change', function() {
        teamSizeGroup.style.display = this.checked ? 'block' : 'none';
      });
      
      // Add event listener for collapse button
      if (count > 1) {
        const collapseBtn = eventForm.querySelector('.collapse-btn');
        const contentDiv = eventForm.querySelector(`#interEventFormContent${i}`);
        
        collapseBtn.addEventListener('click', function() {
          const isCollapsed = contentDiv.style.display === 'none';
          contentDiv.style.display = isCollapsed ? 'block' : 'none';
          this.textContent = isCollapsed ? 'Collapse' : 'Expand';
        });
      }
    }
  }
  
  // Validate Intra-Department Event Form
  function validateIntraDeptEventForm() {
    const count = parseInt(eventCount.value) || 0;
    
    if (count < 1) {
      alert('Please specify at least one event to add');
      return false;
    }
    
    // Validate each event form
    for (let i = 0; i < count; i++) {
      // Check required fields
      const name = document.getElementById(`eventName${i}`).value.trim();
      const description = document.getElementById(`eventDescription${i}`).value.trim();
      const mode = document.getElementById(`eventMode${i}`).value;
      const startDateTime = document.getElementById(`eventStartDateTime${i}`).value;
      const endDateTime = document.getElementById(`eventEndDateTime${i}`).value;
      const registrationDeadline = document.getElementById(`eventRegistrationDeadline${i}`).value;
      
      // Check participation type
      const teamChecked = document.getElementById(`participationTypeTeam${i}`).checked;
      const individualChecked = document.getElementById(`participationTypeIndividual${i}`).checked;
      
      // Check eligibility
      const secondYear = document.getElementById(`secondYear${i}`).checked;
      const thirdYear = document.getElementById(`thirdYear${i}`).checked;
      const fourthYear = document.getElementById(`fourthYear${i}`).checked;
      
      // Validate required fields
      if (!name || !description || !mode || !startDateTime || !endDateTime || !registrationDeadline) {
        alert(`Please fill in all required fields for Event ${i + 1}`);
        return false;
      }
      
      // Validate participation type
      if (!teamChecked && !individualChecked) {
        alert(`Please select at least one participation type for Event ${i + 1}`);
        return false;
      }
      
      // Validate team size if team participation is selected
      if (teamChecked) {
        const maxTeamSize = parseInt(document.getElementById(`maxTeamSize${i}`).value) || 0;
        if (maxTeamSize < 2) {
          alert(`Max team size must be at least 2 for Event ${i + 1}`);
          return false;
        }
      }
      
      // Validate eligibility
      if (!secondYear && !thirdYear && !fourthYear) {
        alert(`Please select at least one eligible year for Event ${i + 1}`);
        return false;
      }
      
      // Validate dates
      const startDateObj = new Date(startDateTime);
      const endDateObj = new Date(endDateTime);
      const registrationDeadlineObj = new Date(registrationDeadline);
      
      if (endDateObj <= startDateObj) {
        alert(`End date & time must be after start date & time for Event ${i + 1}`);
        return false;
      }
      
      if (registrationDeadlineObj >= startDateObj) {
        alert(`Registration deadline must be before the event start date & time for Event ${i + 1}`);
        return false;
      }
    }
    
    return true;
  }
  
  // Validate Inter-Department Event Form
  function validateInterDeptEventForm() {
    const count = parseInt(interEventCount.value) || 0;
    
    if (count < 1) {
      alert('Please specify at least one event to add');
      return false;
    }
    
    // Validate each event form
    for (let i = 0; i < count; i++) {
      // Check required fields
      const name = document.getElementById(`interEventName${i}`).value.trim();
      const description = document.getElementById(`interEventDescription${i}`).value.trim();
      const mode = document.getElementById(`interEventMode${i}`).value;
      const startDateTime = document.getElementById(`interEventStartDateTime${i}`).value;
      const endDateTime = document.getElementById(`interEventEndDateTime${i}`).value;
      const registrationDeadline = document.getElementById(`interEventRegistrationDeadline${i}`).value;
      const eventLevel = document.getElementById(`interEventLevel${i}`).value;
      
      // Check participation type
      const teamChecked = document.getElementById(`interParticipationTypeTeam${i}`).checked;
      const individualChecked = document.getElementById(`interParticipationTypeIndividual${i}`).checked;
      
      // Check eligibility
      const secondYear = document.getElementById(`interSecondYear${i}`).checked;
      const thirdYear = document.getElementById(`interThirdYear${i}`).checked;
      const fourthYear = document.getElementById(`interFourthYear${i}`).checked;
      
      // Check eligible departments
      const departmentSelect = document.getElementById(`eligibleDepartments${i}`);
      const selectedDepartments = Array.from(departmentSelect.selectedOptions).length;
      
      // Validate required fields
      if (!name || !description || !mode || !startDateTime || !endDateTime || !registrationDeadline || !eventLevel) {
        alert(`Please fill in all required fields for Event ${i + 1}`);
        return false;
      }
      
      // Validate participation type
      if (!teamChecked && !individualChecked) {
        alert(`Please select at least one participation type for Event ${i + 1}`);
        return false;
      }
      
      // Validate team size if team participation is selected
      if (teamChecked) {
        const maxTeamSize = parseInt(document.getElementById(`interMaxTeamSize${i}`).value) || 0;
        if (maxTeamSize < 2) {
          alert(`Max team size must be at least 2 for Event ${i + 1}`);
          return false;
        }
      }
      
      // Validate eligibility
      if (!secondYear && !thirdYear && !fourthYear) {
        alert(`Please select at least one eligible year for Event ${i + 1}`);
        return false;
      }
      
      // Validate eligible departments
      if (selectedDepartments === 0) {
        alert(`Please select at least one eligible department for Event ${i + 1}`);
        return false;
      }
      
      // Validate dates
      const startDateObj = new Date(startDateTime);
      const endDateObj = new Date(endDateTime);
      const registrationDeadlineObj = new Date(registrationDeadline);
      
      if (endDateObj <= startDateObj) {
        alert(`End date & time must be after start date & time for Event ${i + 1}`);
        return false;
      }
      
      if (registrationDeadlineObj >= startDateObj) {
        alert(`Registration deadline must be before the event start date & time for Event ${i + 1}`);
        return false;
      }
      
      // Validate registration fee if provided
      const registrationFee = document.getElementById(`interRegistrationFee${i}`).value;
      if (registrationFee && parseInt(registrationFee) < 0) {
        alert(`Registration fee cannot be negative for Event ${i + 1}`);
        return false;
      }
    }
    
    return true;
  }
  
  // Function to create event card
  function createEventCard(event, type) {
    // Create card element
    const card = document.createElement('div');
    card.className = 'event-card';
    
    // Format dates
    const startDateTime = new Date(event.startDateTime);
    const endDateTime = new Date(event.endDateTime);
    const registrationDeadline = new Date(event.registrationDeadline);
    
    // Format date and time strings
    const startDate = startDateTime.toLocaleDateString();
    const startTime = startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endDate = endDateTime.toLocaleDateString();
    const endTime = endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const deadline = registrationDeadline.toLocaleDateString() + ' ' + 
                    registrationDeadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Create date/time display string
    let dateTimeString;
    if (startDate === endDate) {
      dateTimeString = `${startDate}, ${startTime} - ${endTime}`;
    } else {
      dateTimeString = `${startDate} ${startTime} - ${endDate} ${endTime}`;
    }
    
    // Create eligibility string
    const eligibilityString = event.eligibility.join(', ');
    
    // Create additional info for inter-department events
    let additionalInfo = '';
    if (type === 'inter') {
      const departmentsString = event.eligibleDepartments.join(', ');
      additionalInfo = `
        <div class="event-detail">
          <span class="event-detail-icon">🏢</span>
          <span>Departments: ${departmentsString}</span>
        </div>
        <div class="event-detail">
          <span class="event-detail-icon">📊</span>
          <span>Level: ${event.eventLevel}</span>
        </div>
        ${event.registrationFee ? `
        <div class="event-detail">
          <span class="event-detail-icon">💰</span>
          <span>Registration Fee: ₹${event.registrationFee}</span>
        </div>` : ''}
        ${event.externalJudge ? `
        <div class="event-detail">
          <span class="event-detail-icon">👨‍⚖️</span>
          <span>External Judge: ${event.externalJudge}</span>
        </div>` : ''}
      `;
    }
    
    // Set card HTML
    card.innerHTML = `
      <div class="event-image" style="${event.posterUrl ? `background-image: url('${event.posterUrl}')` : ''}">
        ${!event.posterUrl ? '🎯' : ''}
      </div>
      <div class="event-content">
        <h3 class="event-title">${event.name}</h3>
        <p class="event-category">${type === 'intra' ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : 'Inter-Department'} Event</p>
        
        <div class="event-details">
          <div class="event-detail">
            <span class="event-detail-icon">👥</span>
            <span>Participation: ${event.participationType.join(' / ')}</span>
          </div>
          ${event.maxTeamSize ? `
          <div class="event-detail">
            <span class="event-detail-icon">👨‍👩‍👧‍👦</span>
            <span>Max Team Size: ${event.maxTeamSize}</span>
          </div>` : ''}
          <div class="event-detail">
            <span class="event-detail-icon">🔄</span>
            <span>Mode: ${event.mode}</span>
          </div>
          <div class="event-detail">
            <span class="event-detail-icon">📅</span>
            <span>${dateTimeString}</span>
          </div>
          <div class="event-detail">
            <span class="event-detail-icon">⏰</span>
            <span>Register by: ${deadline}</span>
          </div>
          <div class="event-detail">
            <span class="event-detail-icon">👨‍🎓</span>
            <span>Eligibility: ${eligibilityString}</span>
          </div>
          ${additionalInfo}
          ${event.simultaneousCheck ? `
          <div class="event-detail">
            <span class="event-detail-icon">⚠️</span>
            <span>${type === 'intra' ? 'Prevents' : 'Warns about'} simultaneous event registration</span>
          </div>` : ''}
        </div>
        
        <div class="event-description">
          <p>${event.description}</p>
          ${event.specialNotes ? `<p class="special-notes"><strong>Special Notes:</strong> ${event.specialNotes}</p>` : ''}
        </div>
        
        ${event.specialTags.length > 0 ? `
        <div class="event-tags">
          ${event.specialTags.map(tag => `<span class="event-tag">${tag}</span>`).join('')}
        </div>` : ''}
        
        <div class="event-actions">
          <button class="event-action-btn edit-btn">Edit</button>
          <button class="event-action-btn delete-btn">Delete</button>
        </div>
      </div>
    `;
    
    // Add event listeners for edit and delete buttons
    const editBtn = card.querySelector('.edit-btn');
    const deleteBtn = card.querySelector('.delete-btn');
    
    editBtn.addEventListener('click', () => {
      console.log(`Edit ${type}-department event:`, event.name);
      // Edit functionality would go here
    });
    
    deleteBtn.addEventListener('click', () => {
      console.log(`Delete ${type}-department event:`, event.name);
      card.remove();
      
      // Show empty state if no events left
      if (type === 'intra') {
        const container = event.category === 'technical' ? technicalEventsContainer : nonTechnicalEventsContainer;
        if (container.children.length === 0) {
          container.innerHTML = `
            <p class="empty-state">No ${event.category} events added yet.</p>
          `;
        }
      } else {
        if (interDeptEventsContainer.children.length === 0) {
          interDeptEventsContainer.innerHTML = `
            <p class="empty-state">No inter-department events added yet.</p>
          `;
        }
      }
    });
    
    // Add card to appropriate container
    if (type === 'intra') {
      const container = event.category === 'technical' ? technicalEventsContainer : nonTechnicalEventsContainer;
      container.appendChild(card);
    } else {
      interDeptEventsContainer.appendChild(card);
    }
  }
});
  });
  
  // Handle navigation item clicks
  navItems.forEach(item => {
    if (!item.classList.contains('has-submenu')) {
      item.addEventListener('click', function(e) {
        // Check if this is an external link (has href attribute)
        const link = this.querySelector('a');
        if (link && link.hasAttribute('href') && !link.getAttribute('href').startsWith('#')) {
          // Allow external links to work normally
          return;
        }
        
        e.preventDefault();
        
        // Get content ID from data attribute
        const contentId = this.getAttribute('data-content');
        if (!contentId) return;
        
        // Remove active class from all nav items
        navItems.forEach(navItem => {
          if (!navItem.classList.contains('has-submenu')) {
            navItem.classList.remove('active');
          }
        });
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // Hide all content sections
        contentSections.forEach(section => {
          section.classList.remove('active');
        });
        
        // Show selected content section
        const selectedContent = document.getElementById(`${contentId}-content`);
        if (selectedContent) {
          selectedContent.classList.add('active');
        }
        
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('open');
        }
      });
    }
  });
  
  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        sidebar.classList.contains('open') && 
        !sidebar.contains(e.target) && 
        e.target !== menuToggle && 
        !menuToggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
  
  // Logout functionality
  logoutBtn.addEventListener('click', () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = 'login.html';
  });
  
  // Responsive adjustments
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove('open');
    }
  });
  
  // Workshop Management Functionality
  if (addWorkshopBtn && workshopFormContainer && workshopForm) {
    // Load existing workshops
    loadWorkshops();
    
    // Show workshop form
    addWorkshopBtn.addEventListener('click', () => {
      workshopFormContainer.style.display = 'block';
      addWorkshopBtn.style.display = 'none';
      
      // Scroll to form
      workshopFormContainer.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Cancel workshop form
    cancelWorkshopBtn.addEventListener('click', () => {
      workshopFormContainer.style.display = 'none';
      addWorkshopBtn.style.display = 'flex';
      workshopForm.reset();
    });
    
    // Handle form submission
    workshopForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Collect form data
      const formData = new FormData(workshopForm);
      
      // Basic validation
      const requiredFields = ['title', 'organizer', 'organizerEmail', 'startDate', 'endDate', 'deadline'];
      let missingFields = [];
      
      for (const field of requiredFields) {
        if (!formData.get(field)) {
          missingFields.push(field);
        }
      }
      
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      // Format dates properly
      const startDate = new Date(formData.get('startDate'));
      const endDate = new Date(formData.get('endDate'));
      const deadline = new Date(formData.get('deadline'));
      
      // Validate dates
      if (startDate > endDate) {
        alert('Start date cannot be after end date');
        return;
      }
      
      if (deadline > startDate) {
        alert('Registration deadline cannot be after start date');
        return;
      }
      
      const workshopData = {
        title: formData.get('title'),
        domain: formData.get('domain') || 'Technology',
        organizer: formData.get('organizer'),
        organizerEmail: formData.get('organizerEmail'),
        organizerPhone: formData.get('organizerPhone') || '1234567890',
        venue: formData.get('venue') || 'TBD',
        duration: formData.get('duration') || '1',
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        deadline: formData.get('deadline'),
        posterLink: formData.get('posterLink') || 'https://example.com/default-poster.jpg',
        eventLink: formData.get('eventLink') || '',
        maxTeamMembers: formData.get('maxTeamMembers') || 50,
        description: formData.get('description') || 'Workshop details will be provided soon.',
        prerequisites: formData.get('prerequisites') || 'None',
        prizes: formData.get('prizes') || 'Certificate of participation',
        rules: formData.get('rules') || 'Standard workshop guidelines apply',
        options: {
          openForAll: formData.has('openForAll'),
          certificatesProvided: formData.has('certificatesProvided'),
          requiresLaptop: formData.has('requiresLaptop'),
          externalEntriesAllowed: formData.has('externalEntriesAllowed'),
          intraDept: formData.has('intraDept'),
          interDept: true,
          online: formData.has('online'),
          offline: true
        }
      };
      
      // Create the full payload to send
      const workshopPayload = {
        title: workshopData.title,
        description: workshopData.description || 'Workshop details will be provided soon.',
        category: 'workshop',
        domain: workshopData.domain || 'Technology',
        subCategory: 'technical',
        posterUrl: workshopData.posterLink || 'https://example.com/default-poster.jpg',
        eventLink: workshopData.eventLink || '',
        googleFormLink: '',
        startDate: workshopData.startDate,
        endDate: workshopData.endDate,
        duration: `${workshopData.duration || 1} days`,
        coordinatorName: workshopData.organizer || 'Workshop Coordinator',
        coordinatorEmail: workshopData.organizerEmail || 'coordinator@example.com',
        coordinatorPhone: workshopData.organizerPhone || '1234567890',
        venue: workshopData.venue || 'Main Campus',
        maxParticipants: parseInt(workshopData.maxTeamMembers) || 50,
        registrationDeadline: workshopData.deadline,
        eventType: {
          intraDept: Boolean(workshopData.options?.intraDept),
          interDept: true,
          online: Boolean(workshopData.options?.online),
          offline: true
        },
        certificationProvided: Boolean(workshopData.options?.certificatesProvided),
        prerequisites: workshopData.prerequisites || 'None',
        prizes: workshopData.prizes || 'Certificate of participation',
        rules: workshopData.rules || 'Standard workshop guidelines apply'
      };
      
      // Log the complete payload being sent
      console.log('Sending workshop data:', workshopPayload);
      
      // Send workshop data to backend
      try {
        const token = localStorage.getItem('token');
        
        // Show loading indicator
        const submitBtn = workshopForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Workshop...';
        submitBtn.disabled = true;
        
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(workshopPayload)
        });
        
        // Get response data regardless of success/failure
        let responseData;
        try {
          responseData = await response.json();
        } catch (error) {
          console.error('Error parsing response:', error);
          responseData = { message: 'Invalid response from server' };
        }
        
        // Reset button state
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        
        if (!response.ok) {
          console.error('Workshop creation failed:', responseData);
          alert(`Failed to create workshop: ${responseData.message || 'Server error'}`);
          return;
        }
        
        const result = responseData;
        
        // Show success message
        alert('Workshop created successfully!');
        
        // Hide form and reset
        workshopFormContainer.style.display = 'none';
        addWorkshopBtn.style.display = 'flex';
        workshopForm.reset();
        
        // Create workshop card with the returned data
        createWorkshopCard({
          ...workshopData,
          id: result.event._id,
          eventLink: result.event.eventLink
        });
        
        // Remove empty state if it exists
        const emptyState = workshopsContainer.querySelector('.empty-state');
        if (emptyState) {
          emptyState.remove();
        }
        
        // Refresh all events to show the new workshop
        loadAllEvents();
      } catch (error) {
        console.error('Error creating workshop:', error);
        showNotification('Failed to create workshop. Please try again.', 'error');
      }
    });
  }
  
  // Function to load workshops from backend
  async function loadWorkshops() {
    try {
      const response = await fetch('/api/events?category=workshop');
      const data = await response.json();
      
      if (data.success && data.events) {
        // Clear existing content
        workshopsContainer.innerHTML = '';
        
        if (data.events.length === 0) {
          workshopsContainer.innerHTML = '<p class="empty-state">No workshops added yet. Click "Add Workshop" to create one.</p>';
          return;
        }
        
        // Create cards for each workshop
        data.events.forEach(event => {
          const workshopData = {
            title: event.title,
            domain: event.domain,
            organizer: event.coordinatorName,
            duration: event.duration.replace(' days', ''),
            startDate: event.startDate,
            endDate: event.endDate,
            deadline: event.registrationDeadline,
            posterLink: event.posterUrl,
            eventLink: event.eventLink || '',
            maxTeamMembers: Math.ceil(event.maxParticipants / 10),
            description: event.description,
            options: {
              openForAll: true,
              certificatesProvided: event.certificationProvided,
              requiresLaptop: false,
              externalEntriesAllowed: false
            },
            id: event._id
          };
          
          createWorkshopCard(workshopData);
        });
      } else {
        throw new Error('Failed to load workshops');
      }
    } catch (error) {
      console.error('Error loading workshops:', error);
      workshopsContainer.innerHTML = '<p class="empty-state">Failed to load workshops. Please refresh the page.</p>';
    }
  }
  
  // Function to load tech symposiums from backend
  async function loadTechSymposiums() {
    try {
      const response = await fetch('/api/events?category=tech-symposium');
      const data = await response.json();
      
      if (data.success && data.events) {
        // Clear existing content
        techSymposiumsContainer.innerHTML = '';
        
        if (data.events.length === 0) {
          techSymposiumsContainer.innerHTML = '<p class="empty-state">No tech symposiums added yet. Click "Add Tech Symposium" to create one.</p>';
          return;
        }
        
        // Create cards for each tech symposium
        data.events.forEach(event => {
          const symposiumData = {
            title: event.title,
            domain: event.domain,
            subCategory: event.subCategory,
            coordinator: event.coordinatorName,
            startDate: event.startDate,
            endDate: event.endDate,
            deadline: event.registrationDeadline,
            posterLink: event.posterUrl,
            venue: event.venue,
            maxParticipants: event.maxParticipants,
            description: event.description,
            id: event._id
          };
          
          createTechSymposiumCard(symposiumData);
        });
      } else {
        throw new Error('Failed to load tech symposiums');
      }
    } catch (error) {
      console.error('Error loading tech symposiums:', error);
      techSymposiumsContainer.innerHTML = '<p class="empty-state">Failed to load tech symposiums. Please refresh the page.</p>';
    }
  }
  
  // Function to create tech symposium card
  function createTechSymposiumCard(symposium) {
    // Create card element
    const card = document.createElement('div');
    card.className = 'symposium-card';
    
    // Format dates
    const startDate = new Date(symposium.startDate).toLocaleDateString();
    const endDate = new Date(symposium.endDate).toLocaleDateString();
    const deadline = new Date(symposium.deadline).toLocaleDateString();
    
    // Set card HTML
    card.innerHTML = `
      <div class="symposium-image" style="${symposium.posterLink ? `background-image: url('${symposium.posterLink}')` : ''}">
        ${!symposium.posterLink ? '🎓' : ''}
      </div>
      <div class="symposium-content">
        <h3 class="symposium-title">${symposium.title}</h3>
        <p class="symposium-domain">${symposium.domain} (${symposium.subCategory})</p>
        
        <div class="symposium-details">
          <div class="symposium-detail">
            <span class="symposium-detail-icon">👤</span>
            <span>${symposium.coordinator}</span>
          </div>
          <div class="symposium-detail">
            <span class="symposium-detail-icon">📅</span>
            <span>${startDate} to ${endDate}</span>
          </div>
          <div class="symposium-detail">
            <span class="symposium-detail-icon">⏰</span>
            <span>Register by: ${deadline}</span>
          </div>
          <div class="symposium-detail">
            <span class="symposium-detail-icon">📍</span>
            <span>${symposium.venue}</span>
          </div>
          <div class="symposium-detail">
            <span class="symposium-detail-icon">👥</span>
            <span>Max participants: ${symposium.maxParticipants}</span>
          </div>
        </div>
        
        <div class="symposium-actions">
          <button class="symposium-action-btn edit-btn">Edit</button>
          <button class="symposium-action-btn delete-btn">Delete</button>
        </div>
      </div>
    `;
    
    // Add event listeners for edit and delete buttons
    const editBtn = card.querySelector('.edit-btn');
    const deleteBtn = card.querySelector('.delete-btn');
    
    editBtn.addEventListener('click', () => {
      console.log('Edit tech symposium:', symposium.title);
      // Edit functionality would go here
    });
    
    deleteBtn.addEventListener('click', async () => {
      console.log('Delete tech symposium:', symposium.title);
      
      if (confirm('Are you sure you want to delete this tech symposium?')) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/events/${symposium.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            card.remove();
            
            // Show empty state if no tech symposiums left
            if (techSymposiumsContainer.children.length === 0) {
              techSymposiumsContainer.innerHTML = `
                <p class="empty-state">No tech symposiums added yet. Click "Add Tech Symposium" to create one.</p>
              `;
            }
            
            showNotification('Tech symposium deleted successfully!', 'success');
          } else {
            throw new Error('Failed to delete tech symposium');
          }
        } catch (error) {
          console.error('Error deleting tech symposium:', error);
          showNotification('Failed to delete tech symposium. Please try again.', 'error');
        }
      }
    });
    
    // Add card to container
    techSymposiumsContainer.appendChild(card);
  }
  
  // Function to load intra-department events from backend
  async function loadIntraDeptEvents() {
    try {
      const response = await fetch('/api/events?category=tech-symposium');
      const data = await response.json();
      
      if (data.success && data.events) {
        // Clear existing content
        if (technicalEventsContainer) {
          technicalEventsContainer.innerHTML = '';
        }
        if (nonTechnicalEventsContainer) {
          nonTechnicalEventsContainer.innerHTML = '';
        }
        
        if (data.events.length === 0) {
          if (technicalEventsContainer) {
            technicalEventsContainer.innerHTML = '<p class="empty-state">No technical events added yet.</p>';
          }
          if (nonTechnicalEventsContainer) {
            nonTechnicalEventsContainer.innerHTML = '<p class="empty-state">No non-technical events added yet.</p>';
          }
          return;
        }
        
        // Filter events by subCategory and create cards
        data.events.forEach(event => {
          if (event.subCategory === 'technical') {
            if (technicalEventsContainer) {
              technicalEventsContainer.appendChild(createIntraDeptEventCard(event));
            }
          } else if (event.subCategory === 'non-technical') {
            if (nonTechnicalEventsContainer) {
              nonTechnicalEventsContainer.appendChild(createIntraDeptEventCard(event));
            }
          }
        });
      } else {
        throw new Error('Failed to load intra-department events');
      }
    } catch (error) {
      console.error('Error loading intra-department events:', error);
      if (technicalEventsContainer) {
        technicalEventsContainer.innerHTML = '<p class="empty-state">Failed to load technical events.</p>';
      }
      if (nonTechnicalEventsContainer) {
        nonTechnicalEventsContainer.innerHTML = '<p class="empty-state">Failed to load non-technical events.</p>';
      }
    }
  }
  
  // Function to load inter-department events from backend
  async function loadInterDeptEvents() {
    try {
      const response = await fetch('/api/events?category=tech-symposium');
      const data = await response.json();
      
      if (data.success && data.events) {
        // Clear existing content
        if (interDeptEventsContainer) {
          interDeptEventsContainer.innerHTML = '';
        }
        
        if (data.events.length === 0) {
          if (interDeptEventsContainer) {
            interDeptEventsContainer.innerHTML = '<p class="empty-state">No inter-department events added yet.</p>';
          }
          return;
        }
        
        // Filter events by eventType.interDept and create cards
        const interDeptEvents = data.events.filter(event => event.eventType && event.eventType.interDept);
        interDeptEvents.forEach(event => {
          if (interDeptEventsContainer) {
            interDeptEventsContainer.appendChild(createInterDeptEventCard(event));
          }
        });
        
        if (interDeptEvents.length === 0 && interDeptEventsContainer) {
          interDeptEventsContainer.innerHTML = '<p class="empty-state">No inter-department events added yet.</p>';
        }
      } else {
        throw new Error('Failed to load inter-department events');
      }
    } catch (error) {
      console.error('Error loading inter-department events:', error);
      if (interDeptEventsContainer) {
        interDeptEventsContainer.innerHTML = '<p class="empty-state">Failed to load inter-department events.</p>';
      }
    }
  }
  
  // Function to load guest lectures from backend
  async function loadGuestLectures() {
    try {
      const response = await fetch('/api/events?category=guest-lecture');
      const data = await response.json();
      
      if (data.success && data.events) {
        // Clear existing content
        guestLecturesContainer.innerHTML = '';
        
        if (data.events.length === 0) {
          guestLecturesContainer.innerHTML = '<p class="empty-state">No guest lectures added yet. Click "Add Guest Lecture" to create one.</p>';
          return;
        }
        
        // Create cards for each guest lecture
        data.events.forEach(event => {
          const guestLectureData = {
            title: event.title,
            speakerName: event.coordinatorName,
            speakerDesignation: 'Guest Speaker',
            lectureTopic: event.domain,
            description: event.description,
            posterLink: event.posterUrl,
            lectureDate: event.startDate,
            timeString: 'TBD',
            startTime: 'TBD',
            endTime: 'TBD',
            venue: event.venue,
            mode: event.eventType?.online ? 'Online' : event.eventType?.hybrid ? 'Hybrid' : 'Offline',
            mandatoryForAll: true,
            selectedYears: [],
            registrationDeadline: event.registrationDeadline,
            maxParticipants: event.maxParticipants,
            certificateProvided: event.certificationProvided,
            specialRequirements: event.prerequisites ? event.prerequisites.split(', ') : [],
            coordinatorName: event.coordinatorName,
            coordinatorContact: event.coordinatorPhone || '',
            id: event._id
          };
          
          createGuestLectureCard(guestLectureData);
        });
      } else {
        throw new Error('Failed to load guest lectures');
      }
    } catch (error) {
      console.error('Error loading guest lectures:', error);
      guestLecturesContainer.innerHTML = '<p class="empty-state">Failed to load guest lectures. Please refresh the page.</p>';
    }
  }
  
  // Function to load hackathons from backend
  async function loadHackathons() {
    try {
      const response = await fetch('/api/events?category=hackathon');
      const data = await response.json();
      
      if (data.success && data.events) {
        // Clear existing content
        hackathonsContainer.innerHTML = '';
        
        if (data.events.length === 0) {
          hackathonsContainer.innerHTML = '<p class="empty-state">No hackathons added yet. Click "Add Hackathon" to create one.</p>';
          return;
        }
        
        // Create cards for each hackathon
        data.events.forEach(event => {
          const hackathonData = {
            title: event.title,
            domains: [{
              name: event.domain,
              maxParticipants: event.maxParticipants,
              incharge: event.coordinatorName,
              contact: event.coordinatorPhone || '',
              isPanelIncharge: false,
              tags: []
            }],
            mode: event.eventType?.online ? 'Online' : event.eventType?.hybrid ? 'Hybrid' : 'Offline',
            maxTeamSize: Math.ceil(event.maxParticipants / 10),
            deadline: event.registrationDeadline,
            startDate: event.startDate,
            endDate: event.endDate,
            judgingPanel: '',
            posterLink: event.posterUrl,
            problemStatement: event.description,
            submissionRequirements: event.rules || '',
            options: {
              externalParticipants: false,
              certificateProvided: event.certificationProvided,
              requiresLaptop: false
            },
            id: event._id
          };
          
          createHackathonCard(hackathonData);
        });
      } else {
        throw new Error('Failed to load hackathons');
      }
    } catch (error) {
      console.error('Error loading hackathons:', error);
      hackathonsContainer.innerHTML = '<p class="empty-state">Failed to load hackathons. Please refresh the page.</p>';
    }
  }
  
  // Function to create intra-department event card
  function createIntraDeptEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    const startDate = new Date(event.startDate).toLocaleDateString();
    const endDate = new Date(event.endDate).toLocaleDateString();
    const deadline = new Date(event.registrationDeadline).toLocaleDateString();
    
    card.innerHTML = `
      <div class="event-header">
        <h4>${event.title}</h4>
        <span class="event-category">${event.subCategory}</span>
      </div>
      <div class="event-details">
        <p class="event-date">📅 ${startDate} - ${endDate}</p>
        <p class="event-venue">📍 ${event.venue || 'Venue TBA'}</p>
        <p class="event-description">${event.description}</p>
        <p class="event-deadline">⏰ Registration Deadline: ${deadline}</p>
      </div>
      <div class="event-actions">
        <button class="btn-primary" onclick="editEvent('${event._id}')">Edit</button>
        <button class="btn-danger" onclick="deleteEvent('${event._id}')">Delete</button>
      </div>
    `;
    
    return card;
  }
  
  // Function to create inter-department event card
  function createInterDeptEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    const startDate = new Date(event.startDate).toLocaleDateString();
    const endDate = new Date(event.endDate).toLocaleDateString();
    const deadline = new Date(event.registrationDeadline).toLocaleDateString();
    
    card.innerHTML = `
      <div class="event-header">
        <h4>${event.title}</h4>
        <span class="event-category">Inter-Dept</span>
      </div>
      <div class="event-details">
        <p class="event-date">📅 ${startDate} - ${endDate}</p>
        <p class="event-venue">📍 ${event.venue || 'Venue TBA'}</p>
        <p class="event-description">${event.description}</p>
        <p class="event-deadline">⏰ Registration Deadline: ${deadline}</p>
      </div>
      <div class="event-actions">
        <button class="btn-primary" onclick="editEvent('${event._id}')">Edit</button>
        <button class="btn-danger" onclick="deleteEvent('${event._id}')">Delete</button>
      </div>
    `;
    
    return card;
  }
  
  // Function to create event card for both intra and inter department events
  function createEventCard(event, type) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    const startDate = new Date(event.startDateTime).toLocaleDateString();
    const endDate = new Date(event.endDateTime).toLocaleDateString();
    const deadline = new Date(event.registrationDeadline).toLocaleDateString();
    
    const typeLabel = type === 'intra' ? 'Intra-Dept' : 'Inter-Dept';
    
    card.innerHTML = `
      <div class="event-header">
        <h4>${event.name}</h4>
        <span class="event-category">${typeLabel}</span>
      </div>
      <div class="event-details">
        <p class="event-date">📅 ${startDate} - ${endDate}</p>
        <p class="event-venue">📍 ${event.venue || 'Venue TBA'}</p>
        <p class="event-description">${event.description}</p>
        <p class="event-deadline">⏰ Registration Deadline: ${deadline}</p>
        ${event.mode ? `<p class="event-mode">🌐 ${event.mode}</p>` : ''}
        ${event.maxTeamSize ? `<p class="event-team-size">👥 Max Team Size: ${event.maxTeamSize}</p>` : ''}
      </div>
      <div class="event-actions">
        <button class="btn-primary" onclick="editEvent('${event.id || event._id}')">Edit</button>
        <button class="btn-danger" onclick="deleteEvent('${event.id || event._id}')">Delete</button>
      </div>
    `;
    
    return card;
  }
  
  // Function to create workshop card
  function createWorkshopCard(workshop) {
    // Create card element
    const card = document.createElement('div');
    card.className = 'workshop-card';
    card.dataset.id = workshop.id || '';
    
    // Format dates safely
    let startDate = 'TBD';
    let endDate = 'TBD';
    let deadline = 'TBD';
    
    try {
      if (workshop.startDate) startDate = new Date(workshop.startDate).toLocaleDateString();
      if (workshop.endDate) endDate = new Date(workshop.endDate).toLocaleDateString();
      if (workshop.deadline) deadline = new Date(workshop.deadline).toLocaleDateString();
    } catch (error) {
      console.error('Error formatting dates:', error);
    }
    
    // Create tags array safely
    const tags = [];
    if (workshop.options?.openForAll) tags.push('Open for all');
    if (workshop.options?.certificatesProvided) tags.push('Certificates');
    if (workshop.options?.requiresLaptop) tags.push('Laptop required');
    if (workshop.options?.externalEntriesAllowed) tags.push('External entries');
    
    // Set card HTML
    card.innerHTML = `
      <div class="workshop-image" style="${workshop.posterLink ? `background-image: url('${workshop.posterLink}')` : ''}">
        ${!workshop.posterLink ? '🔧' : ''}
      </div>
      <div class="workshop-content">
        <h3 class="workshop-title">${workshop.title || 'Untitled Workshop'}</h3>
        <p class="workshop-domain">${workshop.domain || 'Technology'}</p>
        
        <div class="workshop-details">
          <div class="workshop-detail">
            <span class="workshop-detail-icon">👤</span>
            <span>${workshop.organizer || 'TBD'}</span>
          </div>
          <div class="workshop-detail">
            <span class="workshop-detail-icon">📅</span>
            <span>${startDate} to ${endDate} (${workshop.duration || '1'} days)</span>
          </div>
          <div class="workshop-detail">
            <span class="workshop-detail-icon">⏰</span>
            <span>Register by: ${deadline}</span>
          </div>
          <div class="workshop-detail">
            <span class="workshop-detail-icon">👥</span>
            <span>Max participants: ${workshop.maxTeamMembers || workshop.maxParticipants || '50'}</span>
          </div>
          <div class="workshop-detail">
            <span class="workshop-detail-icon">📍</span>
            <span>Venue: ${workshop.venue || 'TBD'}</span>
          </div>
        </div>
        
        <div class="workshop-tags">
          ${tags.map(tag => `<span class="workshop-tag">${tag}</span>`).join('')}
        </div>
        
        <div class="workshop-description">
          <p>${workshop.description || 'No description available.'}</p>
        </div>
        
        <div class="workshop-actions">
          ${workshop.eventLink ? `<a href="${workshop.eventLink}" target="_blank" class="btn-primary">Event Link</a>` : ''}
          <button class="btn-danger" onclick="deleteEvent('${workshop.id}')">Delete</button>
        </div>
        </div>
        
        <div class="workshop-actions">
          <button class="workshop-action-btn edit-btn">Edit</button>
          <button class="workshop-action-btn delete-btn">Delete</button>
        </div>
        
        ${workshop.eventLink ? `
        <div class="workshop-link">
          <span class="workshop-link-label">Event Link:</span>
          <a href="${workshop.eventLink}" target="_blank" class="workshop-link-url">${workshop.eventLink}</a>
        </div>
        ` : ''}
      </div>
    `;
    
    // Add event listeners for edit and delete buttons
    const editBtn = card.querySelector('.edit-btn');
    const deleteBtn = card.querySelector('.delete-btn');
    
    editBtn.addEventListener('click', () => {
      console.log('Edit workshop:', workshop.title);
      // Edit functionality would go here
    });
    
    deleteBtn.addEventListener('click', async () => {
      console.log('Delete workshop:', workshop.title);
      
      if (confirm('Are you sure you want to delete this workshop?')) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/events/${workshop.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            card.remove();
            
            // Show empty state if no workshops left
            if (workshopsContainer.children.length === 0) {
              workshopsContainer.innerHTML = `
                <p class="empty-state">No workshops added yet. Click "Add Workshop" to create one.</p>
              `;
            }
            
            showNotification('Workshop deleted successfully!', 'success');
          } else {
            throw new Error('Failed to delete workshop');
          }
        } catch (error) {
          console.error('Error deleting workshop:', error);
          showNotification('Failed to delete workshop. Please try again.', 'error');
        }
      }
    });
    
    // Add card to container
    workshopsContainer.appendChild(card);
  }
  
  // Initialize Hackathon Management UI
  function initHackathonUI() {
    // Create references to hackathon elements
    addHackathonBtn = hackathonsContent.querySelector('#addHackathonBtn');
    hackathonFormContainer = hackathonsContent.querySelector('#hackathonFormContainer');
    hackathonForm = hackathonsContent.querySelector('#hackathonForm');
    cancelHackathonBtn = hackathonsContent.querySelector('#cancelHackathonBtn');
    hackathonsContainer = hackathonsContent.querySelector('#hackathonsContainer');
    const domainCountInput = hackathonForm.querySelector('#hackathonDomainCount');
    const domainsContainer = hackathonForm.querySelector('#domainsContainer');
    
    // Load existing hackathons
    loadHackathons();
    
    // Initialize with one domain block
    generateDomainBlocks(1);
    
    // Handle domain count changes
    domainCountInput.addEventListener('change', function() {
      const count = parseInt(this.value) || 1;
      generateDomainBlocks(count);
    });
    
    // Function to generate domain blocks
    function generateDomainBlocks(count) {
      // Clear existing domain blocks
      domainsContainer.innerHTML = '';
      
      // Generate new domain blocks
      for (let i = 0; i < count; i++) {
        const domainBlock = document.createElement('div');
        domainBlock.className = 'domain-block';
        domainBlock.innerHTML = `
          <div class="domain-header">
            <h4 class="domain-title">Domain ${i + 1}</h4>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label for="domainName${i}">Domain Name</label>
              <input type="text" id="domainName${i}" name="domains[${i}].name" placeholder="e.g., AI/ML" required>
            </div>
            
            <div class="form-group">
              <label for="maxParticipants${i}">Max Participants</label>
              <input type="number" id="maxParticipants${i}" name="domains[${i}].maxParticipants" min="1" required>
            </div>
            
            <div class="form-group">
              <label for="inchargeName${i}">Event Incharge Name</label>
              <input type="text" id="inchargeName${i}" name="domains[${i}].incharge" required>
            </div>
            
            <div class="form-group">
              <label for="inchargeContact${i}">Incharge Contact</label>
              <input type="text" id="inchargeContact${i}" name="domains[${i}].contact" pattern="[0-9]{10}" placeholder="10-digit phone number" required>
            </div>
          </div>
          
          <div class="form-group">
            <div class="checkbox-item">
              <input type="checkbox" id="isPanelIncharge${i}" name="domains[${i}].isPanelIncharge">
              <label for="isPanelIncharge${i}">Panel Incharge</label>
            </div>
          </div>
          
          <div class="form-group">
            <label>Special Tags</label>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input type="checkbox" id="certificateProvided${i}" name="domains[${i}].certificateProvided">
                <label for="certificateProvided${i}">Certificate Provided</label>
              </div>
              
              <div class="checkbox-item">
                <input type="checkbox" id="requiresLaptop${i}" name="domains[${i}].requiresLaptop">
                <label for="requiresLaptop${i}">Requires Laptop</label>
              </div>
              
              <div class="checkbox-item">
                <input type="checkbox" id="externalParticipants${i}" name="domains[${i}].externalParticipants">
                <label for="externalParticipants${i}">External Participants</label>
              </div>
            </div>
          </div>
        `;
        
        domainsContainer.appendChild(domainBlock);
      }
    }
    
    // Show hackathon form
    addHackathonBtn.addEventListener('click', () => {
      hackathonFormContainer.style.display = 'block';
      addHackathonBtn.style.display = 'none';
      
      // Scroll to form
      hackathonFormContainer.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Cancel hackathon form
    cancelHackathonBtn.addEventListener('click', () => {
      hackathonFormContainer.style.display = 'none';
      addHackathonBtn.style.display = 'flex';
      hackathonForm.reset();
    });
    
    // Handle form submission
    hackathonForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate form
      if (!validateHackathonForm()) {
        return;
      }
      
      // Collect form data
      const formData = new FormData(hackathonForm);
      const domainCount = parseInt(formData.get('domainCount')) || 1;
      
      // Collect domains data
      const domains = [];
      for (let i = 0; i < domainCount; i++) {
        domains.push({
          name: formData.get(`domains[${i}].name`),
          maxParticipants: parseInt(formData.get(`domains[${i}].maxParticipants`)),
          incharge: formData.get(`domains[${i}].incharge`),
          contact: formData.get(`domains[${i}].contact`),
          isPanelIncharge: formData.has(`domains[${i}].isPanelIncharge`),
          tags: [
            formData.has(`domains[${i}].certificateProvided`) ? 'Certificate Provided' : null,
            formData.has(`domains[${i}].requiresLaptop`) ? 'Requires Laptop' : null,
            formData.has(`domains[${i}].externalParticipants`) ? 'External Participants' : null
          ].filter(tag => tag !== null)
        });
      }
      
      // Create hackathon data object
      const hackathonData = {
        title: formData.get('title'),
        domains: domains,
        mode: formData.get('mode'),
        maxTeamSize: formData.get('maxTeamSize'),
        deadline: formData.get('deadline'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        judgingPanel: formData.get('judgingPanel') || '',
        posterLink: formData.get('posterLink') || '',
        problemStatement: formData.get('problemStatement'),
        submissionRequirements: formData.get('submissionRequirements'),
        options: {
          externalParticipants: formData.has('externalParticipants'),
          certificateProvided: formData.has('certificateProvided'),
          requiresLaptop: formData.has('requiresLaptop')
        }
      };
      
      // Log the form data
      console.log('Hackathon Data:', hackathonData);
      
      // Send hackathon data to backend
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: hackathonData.title,
            description: hackathonData.problemStatement || 'Hackathon details will be provided soon.',
            category: 'hackathon',
            domain: hackathonData.domains.map(d => d.name).join(', ') || 'Technology',
            subCategory: 'technical',
            posterUrl: hackathonData.posterLink || 'https://example.com/default-poster.jpg',
            eventLink: hackathonData.eventLink || '',
            googleFormLink: hackathonData.googleFormLink || '',
            startDate: hackathonData.startDate,
            endDate: hackathonData.endDate,
            duration: `${Math.ceil((new Date(hackathonData.endDate) - new Date(hackathonData.startDate)) / (1000 * 60 * 60 * 24)) || 2} days`,
            coordinatorName: hackathonData.domains[0]?.incharge || 'Hackathon Coordinator',
            coordinatorEmail: 'coordinator@example.com',
            coordinatorPhone: hackathonData.domains[0]?.contact || '1234567890',
            venue: 'Computer Science Department',
            maxParticipants: hackathonData.domains.reduce((sum, d) => sum + (d.maxParticipants || 0), 0) || 100,
            registrationDeadline: hackathonData.deadline,
            eventType: {
              intraDept: false,
              interDept: true,
              online: Boolean(hackathonData.mode === 'Online'),
              offline: Boolean(hackathonData.mode === 'Offline' || hackathonData.mode === 'Hybrid')
            },
            certificationProvided: Boolean(hackathonData.options.certificateProvided),
            prerequisites: hackathonData.problemStatement || 'Basic programming knowledge required',
            prizes: 'Certificates and recognition for top performers',
            rules: hackathonData.submissionRequirements || 'Standard hackathon guidelines apply'
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to create hackathon');
        }
        
        const result = await response.json();
        
        if (result.success) {
          // Create hackathon card with the returned data
          createHackathonCard({
            ...hackathonData,
            id: result.event._id
          });
          
          // Hide form and reset
          hackathonFormContainer.style.display = 'none';
          addHackathonBtn.style.display = 'flex';
          hackathonForm.reset();
          
          // Remove empty state if it exists
          const emptyState = hackathonsContainer.querySelector('.empty-state');
          if (emptyState) {
            emptyState.remove();
          }
          
          // Show success message
          showNotification('Hackathon created successfully!', 'success');
          
          // Refresh all events to show the new hackathon
          loadAllEvents();
        } else {
          throw new Error(result.message || 'Failed to create hackathon');
        }
      } catch (error) {
        console.error('Error creating hackathon:', error);
        showNotification('Failed to create hackathon. Please try again.', 'error');
      }
    });
  }
  
  // Validate hackathon form
  function validateHackathonForm() {
    // Check required fields
    const title = hackathonForm.querySelector('#hackathonTitle').value.trim();
    const domainCount = parseInt(hackathonForm.querySelector('#hackathonDomainCount').value) || 0;
    const mode = hackathonForm.querySelector('#hackathonMode').value;
    const maxTeamSize = hackathonForm.querySelector('#hackathonTeamSize').value;
    const deadline = hackathonForm.querySelector('#hackathonDeadline').value;
    const startDate = hackathonForm.querySelector('#hackathonStartDate').value;
    const endDate = hackathonForm.querySelector('#hackathonEndDate').value;
    const problemStatement = hackathonForm.querySelector('#hackathonProblemStatement').value.trim();
    const submissionRequirements = hackathonForm.querySelector('#hackathonSubmissionRequirements').value.trim();
    
    // Validate required fields
    if (!title || domainCount < 1 || !mode || !maxTeamSize || !deadline || !startDate || !endDate || !problemStatement || !submissionRequirements) {
      alert('Please fill in all required fields');
      return false;
    }
    
    // Validate domain fields
    for (let i = 0; i < domainCount; i++) {
      const domainName = hackathonForm.querySelector(`#domainName${i}`).value.trim();
      const maxParticipants = hackathonForm.querySelector(`#maxParticipants${i}`).value;
      const inchargeName = hackathonForm.querySelector(`#inchargeName${i}`).value.trim();
      const inchargeContact = hackathonForm.querySelector(`#inchargeContact${i}`).value.trim();
      
      if (!domainName || !maxParticipants || !inchargeName || !inchargeContact) {
        alert(`Please fill in all required fields for Domain ${i + 1}`);
        return false;
      }
      
      // Validate contact number format (10 digits)
      if (!/^\d{10}$/.test(inchargeContact)) {
        alert(`Please enter a valid 10-digit contact number for Domain ${i + 1}`);
        return false;
      }
    }
    
    // Validate dates
    const deadlineDate = new Date(deadline);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    if (startDateObj > endDateObj) {
      alert('End date must be after start date');
      return false;
    }
    
    if (deadlineDate > startDateObj) {
      alert('Registration deadline must be before the hackathon start date');
      return false;
    }
    
    return true;
  }
  
  // Function to create hackathon card
  function createHackathonCard(hackathon) {
    // Create card element
    const card = document.createElement('div');
    card.className = 'workshop-card'; // Reuse workshop card styling
    
    // Format dates
    const startDate = new Date(hackathon.startDate).toLocaleDateString();
    const endDate = new Date(hackathon.endDate).toLocaleDateString();
    const deadline = new Date(hackathon.deadline).toLocaleDateString();
    
    // Create tags array from global options
    const tags = [];
    if (hackathon.options.externalParticipants) tags.push('External Participants');
    if (hackathon.options.certificateProvided) tags.push('Certificate Provided');
    if (hackathon.options.requiresLaptop) tags.push('Requires Laptop');
    
    // Create domains list HTML
    const domainsHTML = hackathon.domains.map(domain => {
      const domainTags = domain.tags.map(tag => `<span class="workshop-tag">${tag}</span>`).join('');
      
      return `
        <div class="domain-block">
          <div class="domain-header">
            <h4 class="domain-title">${domain.name}</h4>
          </div>
          <div class="workshop-details">
            <div class="workshop-detail">
              <span class="workshop-detail-icon">👥</span>
              <span>Max participants: ${domain.maxParticipants}</span>
            </div>
            <div class="workshop-detail">
              <span class="workshop-detail-icon">👤</span>
              <span>Incharge: ${domain.incharge}</span>
            </div>
            <div class="workshop-detail">
              <span class="workshop-detail-icon">📞</span>
              <span>Contact: ${domain.contact}</span>
            </div>
            ${domain.isPanelIncharge ? `
            <div class="workshop-detail">
              <span class="workshop-detail-icon">👨‍⚖️</span>
              <span>Panel Incharge</span>
            </div>` : ''}
          </div>
          ${domainTags ? `<div class="workshop-tags">${domainTags}</div>` : ''}
        </div>
      `;
    }).join('');
    
    // Set card HTML
    card.innerHTML = `
      <div class="workshop-image" style="${hackathon.posterLink ? `background-image: url('${hackathon.posterLink}')` : ''}">
        ${!hackathon.posterLink ? '💻' : ''}
      </div>
      <div class="workshop-content">
        <h3 class="workshop-title">${hackathon.title}</h3>
        <p class="workshop-domain">${hackathon.domains.length} Domain${hackathon.domains.length > 1 ? 's' : ''}</p>
        
        <div class="workshop-details">
          <div class="workshop-detail">
            <span class="workshop-detail-icon">🔄</span>
            <span>Mode: ${hackathon.mode}</span>
          </div>
          <div class="workshop-detail">
            <span class="workshop-detail-icon">📅</span>
            <span>${startDate} to ${endDate}</span>
          </div>
          <div class="workshop-detail">
            <span class="workshop-detail-icon">⏰</span>
            <span>Register by: ${deadline}</span>
          </div>
          <div class="workshop-detail">
            <span class="workshop-detail-icon">👥</span>
            <span>Max team size: ${hackathon.maxTeamSize}</span>
          </div>
          ${hackathon.judgingPanel ? `
          <div class="workshop-detail">
            <span class="workshop-detail-icon">👨‍⚖️</span>
            <span>Judging: ${hackathon.judgingPanel}</span>
          </div>` : ''}
        </div>
        
        <div class="domains-container">
          ${domainsHTML}
        </div>
        
        <div class="workshop-tags">
          ${tags.map(tag => `<span class="workshop-tag">${tag}</span>`).join('')}
        </div>
        
        <div class="workshop-actions">
          <button class="workshop-action-btn edit-btn">Edit</button>
          <button class="workshop-action-btn delete-btn">Delete</button>
        </div>
      </div>
    `;
    
    // Add event listeners for edit and delete buttons
    const editBtn = card.querySelector('.edit-btn');
    const deleteBtn = card.querySelector('.delete-btn');
    
    editBtn.addEventListener('click', () => {
      console.log('Edit hackathon:', hackathon.title);
      // Edit functionality would go here
    });
    
    deleteBtn.addEventListener('click', () => {
      console.log('Delete hackathon:', hackathon.title);
      card.remove();
      
      // Show empty state if no hackathons left
      if (hackathonsContainer.children.length === 0) {
        hackathonsContainer.innerHTML = `
          <p class="empty-state">No hackathons added yet. Click "Add Hackathon" to create one.</p>
        `;
      }
    });
    
    // Add card to container
    hackathonsContainer.appendChild(card);
  }
  
  // Initialize hackathon UI when the hackathons tab is clicked
  const hackathonsTab = document.querySelector('.nav-item[data-content="hackathons"]');
  if (hackathonsTab) {
    hackathonsTab.addEventListener('click', () => {
      // Initialize UI if not already initialized
      if (!addHackathonBtn) {
        initHackathonUI();
      }
    });
  }
  
  // Tech Symposiums Management Functionality
  const techSymposiumsContent = document.getElementById('tech-symposiums-content');
  let addTechSymposiumBtn;
  let techSymposiumFormContainer;
  let techSymposiumForm;
  let cancelTechSymposiumBtn;
  let techSymposiumsContainer;
  
  // Guest Lectures Management Functionality
  const guestLecturesContent = document.getElementById('guest-lectures-content');
  let addGuestLectureBtn;
  let guestLectureFormContainer;
  let guestLectureForm;
  let cancelGuestLectureBtn;
  let guestLecturesContainer;
  let mandatoryForAllCheckbox;
  let yearSelectionContainer;
  
  // Initialize Tech Symposiums UI when the tech symposiums tab is clicked
  const techSymposiumsTab = document.querySelector('.nav-item[data-content="tech-symposiums"]');
  if (techSymposiumsTab) {
    techSymposiumsTab.addEventListener('click', () => {
      // Initialize UI if not already initialized
      if (!addTechSymposiumBtn) {
        initTechSymposiumsUI();
      }
    });
  }
  
  // Initialize Guest Lectures UI when the guest lectures tab is clicked
  const guestLecturesTab = document.querySelector('.nav-item[data-content="guest-lectures"]');
  if (guestLecturesTab) {
    guestLecturesTab.addEventListener('click', () => {
      // Initialize UI if not already initialized
      if (!addGuestLectureBtn) {
        initGuestLecturesUI();
      }
    });
  }
  
  // Function to initialize Tech Symposiums UI
  function initTechSymposiumsUI() {
    // Create references to tech symposium elements
    addTechSymposiumBtn = techSymposiumsContent.querySelector('#addTechSymposiumBtn');
    techSymposiumFormContainer = techSymposiumsContent.querySelector('#techSymposiumFormContainer');
    techSymposiumForm = techSymposiumsContent.querySelector('#techSymposiumForm');
    cancelTechSymposiumBtn = techSymposiumsContent.querySelector('#cancelTechSymposiumBtn');
    techSymposiumsContainer = techSymposiumsContent.querySelector('#techSymposiumsContainer');
    
    // Load existing tech symposiums
    loadTechSymposiums();
    
    // Show tech symposium form
    addTechSymposiumBtn.addEventListener('click', () => {
      techSymposiumFormContainer.style.display = 'block';
      addTechSymposiumBtn.style.display = 'none';
      
      // Scroll to form
      techSymposiumFormContainer.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Cancel tech symposium form
    cancelTechSymposiumBtn.addEventListener('click', () => {
      techSymposiumFormContainer.style.display = 'none';
      addTechSymposiumBtn.style.display = 'flex';
      techSymposiumForm.reset();
    });
    
    // Handle form submission
    techSymposiumForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Collect form data
      const formData = new FormData(techSymposiumForm);
      const symposiumData = {
        title: formData.get('title'),
        domain: formData.get('domain'),
        subCategory: formData.get('subCategory'),
        coordinator: formData.get('coordinator'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        deadline: formData.get('deadline'),
        posterLink: formData.get('posterLink') || '',
        venue: formData.get('venue'),
        maxParticipants: formData.get('maxParticipants'),
        description: formData.get('description')
      };
      
      // Send tech symposium data to backend
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: symposiumData.title,
            description: symposiumData.description,
            category: 'tech-symposium',
            subCategory: symposiumData.subCategory,
            domain: symposiumData.domain,
            posterUrl: symposiumData.posterLink || 'https://example.com/default-poster.jpg',
            startDate: symposiumData.startDate,
            endDate: symposiumData.endDate,
            duration: `${Math.ceil((new Date(symposiumData.endDate) - new Date(symposiumData.startDate)) / (1000 * 60 * 60 * 24))} days`,
            coordinatorName: symposiumData.coordinator,
            coordinatorEmail: 'coordinator@example.com',
            coordinatorPhone: '1234567890',
            venue: symposiumData.venue || 'Main Auditorium',
            maxParticipants: parseInt(symposiumData.maxParticipants) || 100,
            registrationDeadline: symposiumData.deadline,
            eventType: {
              intraDept: false,
              interDept: true,
              online: false,
              offline: true
            },
            certificationProvided: true,
            prerequisites: symposiumData.description || '',
            prizes: 'Certificates for all participants',
            rules: 'Follow all symposium guidelines'
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to create tech symposium');
        }
        
        const result = await response.json();
        
        if (result.success) {
          // Create tech symposium card with the returned data
          createTechSymposiumCard({
            ...symposiumData,
            id: result.event._id
          });
          
          // Hide form and reset
          techSymposiumFormContainer.style.display = 'none';
          addTechSymposiumBtn.style.display = 'flex';
          techSymposiumForm.reset();
          
          // Remove empty state if it exists
          const emptyState = techSymposiumsContainer.querySelector('.empty-state');
          if (emptyState) {
            emptyState.remove();
          }
          
          // Show success message
          showNotification('Tech symposium created successfully!', 'success');
          
          // Refresh all events to show the new symposium
          loadAllEvents();
        } else {
          throw new Error(result.message || 'Failed to create tech symposium');
        }
      } catch (error) {
        console.error('Error creating tech symposium:', error);
        showNotification('Failed to create tech symposium. Please try again.', 'error');
      }
    });
  }
  
  // Function to initialize Guest Lectures UI
  function initGuestLecturesUI() {
    // Create references to guest lecture elements
    addGuestLectureBtn = guestLecturesContent.querySelector('#addGuestLectureBtn');
    guestLectureFormContainer = guestLecturesContent.querySelector('#guestLectureFormContainer');
    guestLectureForm = guestLecturesContent.querySelector('#guestLectureForm');
    cancelGuestLectureBtn = guestLecturesContent.querySelector('#cancelGuestLectureBtn');
    guestLecturesContainer = guestLecturesContent.querySelector('#guestLecturesContainer');
    mandatoryForAllCheckbox = guestLectureForm.querySelector('#mandatoryForAll');
    yearSelectionContainer = guestLectureForm.querySelector('#yearSelectionContainer');
    
    // Load existing guest lectures
    loadGuestLectures();
    
    // Load existing intra-department events
    loadIntraDeptEvents();
    
    // Load existing inter-department events
    loadInterDeptEvents();
    
    // Show guest lecture form
    addGuestLectureBtn.addEventListener('click', () => {
      guestLectureFormContainer.style.display = 'block';
      addGuestLectureBtn.style.display = 'none';
      
      // Scroll to form
      guestLectureFormContainer.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Cancel guest lecture form
    cancelGuestLectureBtn.addEventListener('click', () => {
      guestLectureFormContainer.style.display = 'none';
      addGuestLectureBtn.style.display = 'flex';
      guestLectureForm.reset();
      yearSelectionContainer.style.display = 'block'; // Reset year selection visibility
    });
    
    // Toggle year selection based on mandatory checkbox
    mandatoryForAllCheckbox.addEventListener('change', function() {
      yearSelectionContainer.style.display = this.checked ? 'none' : 'block';
      
      // Uncheck all year checkboxes when mandatory is checked
      if (this.checked) {
        const yearCheckboxes = yearSelectionContainer.querySelectorAll('input[type="checkbox"]');
        yearCheckboxes.forEach(checkbox => {
          checkbox.checked = false;
        });
      }
    });
    
    // Handle form submission
    guestLectureForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate form
      if (!validateGuestLectureForm()) {
        return;
      }
      
      // Collect form data
      const formData = new FormData(guestLectureForm);
      
      // Get selected years if not mandatory for all
      const selectedYears = [];
      if (!formData.has('mandatoryForAll')) {
        if (formData.has('secondYear')) selectedYears.push('2nd Year');
        if (formData.has('thirdYear')) selectedYears.push('3rd Year');
        if (formData.has('fourthYear')) selectedYears.push('4th Year');
        if (formData.has('finalYear')) selectedYears.push('Final Year');
      }
      
      // Get special requirements
      const specialRequirements = [];
      if (formData.has('bringLaptop')) specialRequirements.push('Bring Laptop');
      if (formData.has('preReadMaterial')) specialRequirements.push('Pre-read Material');
      
      // Format time
      const startTime = formData.get('startTime');
      const endTime = formData.get('endTime');
      const timeString = `${startTime} - ${endTime}`;
      
      // Create guest lecture data object
      const guestLectureData = {
        title: formData.get('title'),
        speakerName: formData.get('speakerName'),
        speakerDesignation: formData.get('speakerDesignation'),
        lectureTopic: formData.get('lectureTopic'),
        description: formData.get('description'),
        posterLink: formData.get('posterLink') || '',
        lectureDate: formData.get('lectureDate'),
        timeString: timeString,
        startTime: startTime,
        endTime: endTime,
        venue: formData.get('venue'),
        mode: formData.get('mode'),
        mandatoryForAll: formData.has('mandatoryForAll'),
        selectedYears: selectedYears,
        registrationDeadline: formData.get('registrationDeadline') || '',
        maxParticipants: formData.get('maxParticipants') || '',
        certificateProvided: formData.has('certificateProvided'),
        specialRequirements: specialRequirements,
        coordinatorName: formData.get('coordinatorName'),
        coordinatorContact: formData.get('coordinatorContact')
      };
      
      // Log the form data
      console.log('Guest Lecture Data:', guestLectureData);
      
      // Send guest lecture data to backend
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: guestLectureData.title,
            description: guestLectureData.description,
            category: 'guest-lecture',
            domain: guestLectureData.lectureTopic,
            posterUrl: guestLectureData.posterLink || 'https://example.com/default-poster.jpg',
            startDate: guestLectureData.lectureDate,
            endDate: guestLectureData.lectureDate, // Same as start date for single-day events
            duration: '1 day',
            coordinatorName: guestLectureData.coordinatorName,
            coordinatorEmail: 'coordinator@example.com',
            coordinatorPhone: guestLectureData.coordinatorContact,
            venue: guestLectureData.venue,
            maxParticipants: parseInt(guestLectureData.maxParticipants) || 100,
            registrationDeadline: guestLectureData.registrationDeadline || guestLectureData.lectureDate,
            eventType: {
              online: guestLectureData.mode === 'Online',
              offline: guestLectureData.mode === 'Offline',
              hybrid: guestLectureData.mode === 'Hybrid'
            },
            certificationProvided: guestLectureData.certificateProvided,
            prerequisites: guestLectureData.specialRequirements.join(', '),
            prizes: '',
            rules: ''
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to create guest lecture');
        }
        
        const result = await response.json();
        
        if (result.success) {
          // Create guest lecture card with the returned data
          createGuestLectureCard({
            ...guestLectureData,
            id: result.event._id
          });
          
          // Hide form and reset
          guestLectureFormContainer.style.display = 'none';
          addGuestLectureBtn.style.display = 'flex';
          guestLectureForm.reset();
          yearSelectionContainer.style.display = 'block'; // Reset year selection visibility
          
          // Remove empty state if it exists
          const emptyState = guestLecturesContainer.querySelector('.empty-state');
          if (emptyState) {
            emptyState.remove();
          }
          
          // Show success message
          showNotification('Guest lecture created successfully!', 'success');
          
          // Refresh all events to show the new guest lecture
          loadAllEvents();
        } else {
          throw new Error(result.message || 'Failed to create guest lecture');
        }
      } catch (error) {
        console.error('Error creating guest lecture:', error);
        showNotification('Failed to create guest lecture. Please try again.', 'error');
      }
    });
  }
  
  // Validate guest lecture form
  function validateGuestLectureForm() {
    // Check required fields
    const title = guestLectureForm.querySelector('#lectureTitle').value.trim();
    const speakerName = guestLectureForm.querySelector('#speakerName').value.trim();
    const speakerDesignation = guestLectureForm.querySelector('#speakerDesignation').value.trim();
    const lectureTopic = guestLectureForm.querySelector('#lectureTopic').value.trim();
    const description = guestLectureForm.querySelector('#lectureDescription').value.trim();
    const lectureDate = guestLectureForm.querySelector('#lectureDate').value;
    const startTime = guestLectureForm.querySelector('#lectureStartTime').value;
    const endTime = guestLectureForm.querySelector('#lectureEndTime').value;
    const venue = guestLectureForm.querySelector('#lectureVenue').value.trim();
    const mode = guestLectureForm.querySelector('#lectureMode').value;
    const coordinatorName = guestLectureForm.querySelector('#coordinatorName').value.trim();
    const coordinatorContact = guestLectureForm.querySelector('#coordinatorContact').value.trim();
    const mandatoryForAll = guestLectureForm.querySelector('#mandatoryForAll').checked;
    
    // Validate required fields
    if (!title || !speakerName || !speakerDesignation || !lectureTopic || !description || 
        !lectureDate || !startTime || !endTime || !venue || !mode || 
        !coordinatorName || !coordinatorContact) {
      alert('Please fill in all required fields');
      return false;
    }
    
    // Validate contact number format (10 digits)
    if (!/^\d{10}$/.test(coordinatorContact)) {
      alert('Please enter a valid 10-digit contact number for the coordinator');
      return false;
    }
    
    // Validate time (end time should be after start time)
    if (startTime >= endTime) {
      alert('End time must be after start time');
      return false;
    }
    
    // If not mandatory for all, at least one year should be selected
    if (!mandatoryForAll) {
      const secondYear = guestLectureForm.querySelector('#secondYear').checked;
      const thirdYear = guestLectureForm.querySelector('#thirdYear').checked;
      const fourthYear = guestLectureForm.querySelector('#fourthYear').checked;
      const finalYear = guestLectureForm.querySelector('#finalYear').checked;
      
      if (!secondYear && !thirdYear && !fourthYear && !finalYear) {
        alert('Please select at least one year group or check "Mandatory for All Students"');
        return false;
      }
    }
    
    // Validate registration deadline if max participants is set
    const registrationDeadline = guestLectureForm.querySelector('#registrationDeadline').value;
    const maxParticipants = guestLectureForm.querySelector('#maxParticipants').value;
    
    if (maxParticipants && !registrationDeadline) {
      alert('Please set a registration deadline if max participants is specified');
      return false;
    }
    
    // Validate registration deadline is before lecture date
    if (registrationDeadline && new Date(registrationDeadline) >= new Date(lectureDate)) {
      alert('Registration deadline must be before the lecture date');
      return false;
    }
    
    return true;
  }
  
  // Function to create guest lecture card
  function createGuestLectureCard(lecture) {
    // Create card element
    const card = document.createElement('div');
    card.className = 'guest-lecture-card';
    
    // Format date
    const lectureDate = new Date(lecture.lectureDate).toLocaleDateString();
    const registrationDeadline = lecture.registrationDeadline ? new Date(lecture.registrationDeadline).toLocaleDateString() : '';
    
    // Create audience info text
    let audienceInfo = '';
    if (lecture.mandatoryForAll) {
      audienceInfo = `<div class="audience-info">Mandatory for All Students <span class="mandatory-badge">Required</span></div>`;
    } else if (lecture.selectedYears.length > 0) {
      audienceInfo = `<div class="audience-info">For: ${lecture.selectedYears.join(', ')} Students</div>`;
    }
    
    // Create special requirements tags
    const specialRequirementsTags = lecture.specialRequirements.map(req => 
      `<span class="workshop-tag">${req}</span>`
    ).join('');
    
    // Set card HTML
    card.innerHTML = `
      <div class="lecture-image" style="${lecture.posterLink ? `background-image: url('${lecture.posterLink}')` : ''}">
        ${!lecture.posterLink ? '👨‍🏫' : ''}
      </div>
      <div class="lecture-content">
        <h3 class="lecture-title">${lecture.title}</h3>
        <p class="speaker-info">${lecture.speakerName}, ${lecture.speakerDesignation}</p>
        
        <div class="workshop-details">
          <div class="workshop-detail">
            <span class="workshop-detail-icon">📚</span>
            <span>${lecture.lectureTopic}</span>
          </div>
          <div class="workshop-detail">
            <span class="workshop-detail-icon">📅</span>
            <span>${lectureDate}</span>
          </div>
          <div class="workshop-detail">
            <span class="workshop-detail-icon">⏰</span>
            <span>${lecture.timeString}</span>
          </div>
          <div class="workshop-detail">
            <span class="workshop-detail-icon">📍</span>
            <span>${lecture.venue} (${lecture.mode})</span>
          </div>
          <div class="workshop-detail">
            <span class="workshop-detail-icon">👤</span>
            <span>Coordinator: ${lecture.coordinatorName} (${lecture.coordinatorContact})</span>
          </div>
          ${lecture.maxParticipants ? `
          <div class="workshop-detail">
            <span class="workshop-detail-icon">👥</span>
            <span>Max Participants: ${lecture.maxParticipants}</span>
          </div>` : ''}
          ${registrationDeadline ? `
          <div class="workshop-detail">
            <span class="workshop-detail-icon">🗓️</span>
            <span>Register by: ${registrationDeadline}</span>
          </div>` : ''}
        </div>
        
        ${audienceInfo}
        
        ${lecture.certificateProvided || lecture.specialRequirements.length > 0 ? `
        <div class="workshop-tags">
          ${lecture.certificateProvided ? '<span class="workshop-tag">Certificate Provided</span>' : ''}
          ${specialRequirementsTags}
        </div>` : ''}
        
        <div class="workshop-actions">
          <button class="workshop-action-btn edit-btn">Edit</button>
          <button class="workshop-action-btn delete-btn">Delete</button>
        </div>
      </div>
    `;
    
    // Add event listeners for edit and delete buttons
    const editBtn = card.querySelector('.edit-btn');
    const deleteBtn = card.querySelector('.delete-btn');
    
    editBtn.addEventListener('click', () => {
      console.log('Edit guest lecture:', lecture.title);
      // Edit functionality would go here
    });
    
    deleteBtn.addEventListener('click', () => {
      console.log('Delete guest lecture:', lecture.title);
      card.remove();
      
      // Show empty state if no guest lectures left
      if (guestLecturesContainer.children.length === 0) {
        guestLecturesContainer.innerHTML = `
          <p class="empty-state">No guest lectures added yet. Click "Add Guest Lecture" to create one.</p>
        `;
      }
    });
    
    // Add card to container
    guestLecturesContainer.appendChild(card);
  }
});

// Function to load all events from backend
async function loadAllEvents() {
  try {
    // Load workshops
    if (typeof loadWorkshops === 'function') {
      await loadWorkshops();
    }
    
    // Load hackathons
    if (typeof loadHackathons === 'function') {
      await loadHackathons();
    }
    
    // Load tech symposiums
    if (typeof loadTechSymposiums === 'function') {
      await loadTechSymposiums();
    }
    
    // Load guest lectures
    if (typeof loadGuestLectures === 'function') {
      await loadGuestLectures();
    }
    
    // Load intra-department events
    if (typeof loadIntraDeptEvents === 'function') {
      await loadIntraDeptEvents();
    }
    
    // Load inter-department events
    if (typeof loadInterDeptEvents === 'function') {
      await loadInterDeptEvents();
    }
  } catch (error) {
    console.error('Error loading all events:', error);
  }
}

// Helper functions for event management
function editEvent(eventId) {
  console.log('Edit event:', eventId);
  showNotification('Edit functionality will be implemented here', 'info');
}

function deleteEvent(eventId) {
  if (confirm('Are you sure you want to delete this event?')) {
    console.log('Delete event:', eventId);
    // Here you would call the backend API to delete the event
    showNotification('Delete functionality will be implemented here', 'info');
  }
}

// Notification function
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 3000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  // Set background color based on type
  switch (type) {
    case 'success':
      notification.style.background = '#28a745';
      break;
    case 'error':
      notification.style.background = '#dc3545';
      break;
    case 'warning':
      notification.style.background = '#ffc107';
      notification.style.color = '#333';
      break;
    default:
      notification.style.background = '#17a2b8';
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Function to notify user dashboards about new events
async function notifyUserDashboards(message, eventIds = [], eventTitle = '') {
  try {
    const token = localStorage.getItem('token');
    
    // Call the notification endpoint for each event
    if (eventIds.length > 0) {
      for (const eventId of eventIds) {
        await fetch('/api/events/notify-new-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            eventId,
            eventTitle: eventTitle || 'New Event'
          })
        });
      }
    }
    
    console.log('Notification for user dashboards:', message);
    
    // In the future, this could:
    // 1. Send WebSocket message to all connected user dashboards
    // 2. Trigger a refresh on user dashboards
    // 3. Show a notification on user dashboards
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// Global functions for onclick handlers
window.editEvent = editEvent;
window.deleteEvent = deleteEvent;
window.loadAllEvents = loadAllEvents;
window.notifyUserDashboards = notifyUserDashboards;