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
    intraDeptEventForm.addEventListener('submit', (e) => {
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
      
      // Create event cards for each event
      events.forEach(event => {
        createEventCard(event, 'intra');
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
    interDeptEventForm.addEventListener('submit', (e) => {
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
      
      // Create event cards for each event
      events.forEach(event => {
        createEventCard(event, 'inter');
      });
      
      // Hide form and reset
      interDeptEventFormContainer.style.display = 'none';
      addInterDeptEventBtn.style.display = 'flex';
      interDeptEventForm.reset();
      generateInterEventForms(1); // Reset to one form
      
      // Remove empty state if it exists
      const emptyState = interDeptEventsContainer.querySelector('.empty-state');
      if (emptyState) {
        emptyState.remove();
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
    workshopForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Collect form data
      const formData = new FormData(workshopForm);
      const workshopData = {
        title: formData.get('title'),
        domain: formData.get('domain'),
        organizer: formData.get('organizer'),
        duration: formData.get('duration'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        deadline: formData.get('deadline'),
        posterLink: formData.get('posterLink') || '',
        maxTeamMembers: formData.get('maxTeamMembers'),
        description: formData.get('description'),
        options: {
          openForAll: formData.has('openForAll'),
          certificatesProvided: formData.has('certificatesProvided'),
          requiresLaptop: formData.has('requiresLaptop'),
          externalEntriesAllowed: formData.has('externalEntriesAllowed')
        }
      };
      
      // Log the form data
      console.log('Workshop Data:', workshopData);
      
      // Create workshop card
      createWorkshopCard(workshopData);
      
      // Hide form and reset
      workshopFormContainer.style.display = 'none';
      addWorkshopBtn.style.display = 'flex';
      workshopForm.reset();
      
      // Remove empty state if it exists
      const emptyState = workshopsContainer.querySelector('.empty-state');
      if (emptyState) {
        emptyState.remove();
      }
    });
  }
  
  // Function to create workshop card
  function createWorkshopCard(workshop) {
    // Create card element
    const card = document.createElement('div');
    card.className = 'workshop-card';
    
    // Format dates
    const startDate = new Date(workshop.startDate).toLocaleDateString();
    const endDate = new Date(workshop.endDate).toLocaleDateString();
    const deadline = new Date(workshop.deadline).toLocaleDateString();
    
    // Create tags array
    const tags = [];
    if (workshop.options.openForAll) tags.push('Open for all');
    if (workshop.options.certificatesProvided) tags.push('Certificates');
    if (workshop.options.requiresLaptop) tags.push('Laptop required');
    if (workshop.options.externalEntriesAllowed) tags.push('External entries');
    
    // Set card HTML
    card.innerHTML = `
      <div class="workshop-image" style="${workshop.posterLink ? `background-image: url('${workshop.posterLink}')` : ''}">
        ${!workshop.posterLink ? '🔧' : ''}
      </div>
      <div class="workshop-content">
        <h3 class="workshop-title">${workshop.title}</h3>
        <p class="workshop-domain">${workshop.domain}</p>
        
        <div class="workshop-details">
          <div class="workshop-detail">
            <span class="workshop-detail-icon">👤</span>
            <span>${workshop.organizer}</span>
          </div>
          <div class="workshop-detail">
            <span class="workshop-detail-icon">📅</span>
            <span>${startDate} to ${endDate} (${workshop.duration} days)</span>
          </div>
          <div class="workshop-detail">
            <span class="workshop-detail-icon">⏰</span>
            <span>Register by: ${deadline}</span>
          </div>
          <div class="workshop-detail">
            <span class="workshop-detail-icon">👥</span>
            <span>Max team size: ${workshop.maxTeamMembers}</span>
          </div>
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
      console.log('Edit workshop:', workshop.title);
      // Edit functionality would go here
    });
    
    deleteBtn.addEventListener('click', () => {
      console.log('Delete workshop:', workshop.title);
      card.remove();
      
      // Show empty state if no workshops left
      if (workshopsContainer.children.length === 0) {
        workshopsContainer.innerHTML = `
          <p class="empty-state">No workshops added yet. Click "Add Workshop" to create one.</p>
        `;
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
    hackathonForm.addEventListener('submit', (e) => {
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
      
      // Create hackathon card
      createHackathonCard(hackathonData);
      
      // Hide form and reset
      hackathonFormContainer.style.display = 'none';
      addHackathonBtn.style.display = 'flex';
      hackathonForm.reset();
      
      // Remove empty state if it exists
      const emptyState = hackathonsContainer.querySelector('.empty-state');
      if (emptyState) {
        emptyState.remove();
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
  
  // Guest Lectures Management Functionality
  const guestLecturesContent = document.getElementById('guest-lectures-content');
  let addGuestLectureBtn;
  let guestLectureFormContainer;
  let guestLectureForm;
  let cancelGuestLectureBtn;
  let guestLecturesContainer;
  let mandatoryForAllCheckbox;
  let yearSelectionContainer;
  
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
    guestLectureForm.addEventListener('submit', (e) => {
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
      
      // Create guest lecture card
      createGuestLectureCard(guestLectureData);
      
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