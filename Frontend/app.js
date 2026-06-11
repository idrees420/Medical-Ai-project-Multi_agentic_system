const API_BASE_URL = 'https://fyp-backend-xvuk.onrender.com';

// --- Authentication Check ---
if (!localStorage.getItem('userEmail')) {
    window.location.href = 'auth.html';
}

// DOM Elements
const symptomsInput = document.getElementById('symptoms-input');
const predictBtn = document.getElementById('predict-btn');
const predictBtnText = predictBtn.querySelector('.btn-text');
const predictLoader = predictBtn.querySelector('.loader');

const resultBox = document.getElementById('prediction-result');
const diseaseText = document.getElementById('disease-text');
const appointmentWrapper = document.getElementById('appointment-wrapper');
const bookAppointmentBtn = document.getElementById('book-appointment-btn');

const diagnosisSection = document.getElementById('diagnosis-section');
const chatSection = document.getElementById('chat-section');
const closeChatBtn = document.getElementById('close-chat');

const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// State
let chatHistory = [];
let currentDiagnosis = "";

// --- Navigation Logic ---
const navDiagnosis = document.getElementById('nav-diagnosis');
const navAppointments = document.getElementById('nav-appointments');
const navLogout = document.getElementById('nav-logout');
const appointmentsSection = document.getElementById('appointments-section');
const headerSubtitle = document.getElementById('header-subtitle');

if (navLogout) {
    navLogout.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'auth.html';
    });
}

navDiagnosis.addEventListener('click', () => {
    navDiagnosis.classList.add('active');
    navAppointments.classList.remove('active');
    diagnosisSection.classList.remove('hidden');
    appointmentsSection.classList.add('hidden');
    chatSection.classList.add('hidden');
    headerSubtitle.textContent = "Describe your symptoms to receive an AI-powered diagnosis and connect with specialized healthcare professionals.";
});

navAppointments.addEventListener('click', () => {
    navAppointments.classList.add('active');
    navDiagnosis.classList.remove('active');
    appointmentsSection.classList.remove('hidden');
    diagnosisSection.classList.add('hidden');
    chatSection.classList.add('hidden');
    headerSubtitle.textContent = "View and manage your upcoming medical consultations.";
    fetchAppointments();
});

// --- Appointment Fetching ---
const appointmentsList = document.getElementById('appointments-list');
const refreshBtn = document.getElementById('refresh-appointments');

async function fetchAppointments() {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    appointmentsList.innerHTML = '<div class="loader-wrap"><div class="loader"></div></div>';

    try {
        const response = await fetch(`${API_BASE_URL}/my-appointments?email=${email}`);
        if (!response.ok) throw new Error('Failed to fetch appointments');

        const appointments = await response.json();
        renderAppointments(appointments);
    } catch (error) {
        console.error("Fetch error:", error);
        appointmentsList.innerHTML = '<p class="empty-msg">Error loading appointments. Please try again.</p>';
    }
}

function renderAppointments(appointments) {
    if (appointments.length === 0) {
        appointmentsList.innerHTML = '<p class="empty-msg">No appointments booked yet.</p>';
        return;
    }

    appointmentsList.innerHTML = '';
    appointments.forEach(app => {
        const item = document.createElement('div');
        item.className = 'appointment-item fade-in';

        item.innerHTML = `
            <div class="apt-main-info">
                <h4>Dr. ${app.doctor_name}</h4>
                <span class="apt-special">${app.specialization}</span>
                ${app.predicted_disease ? `<span class="apt-disease">Relating to: ${app.predicted_disease}</span>` : ''}
            </div>
            <div class="apt-time-info">
                <div class="apt-date">${new Date(app.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                <div class="apt-time">${app.time}</div>
                <span class="apt-status status-${app.status}">${app.status}</span>
            </div>
        `;
        appointmentsList.appendChild(item);
    });
}

refreshBtn.addEventListener('click', fetchAppointments);

// --- Prediction Logic ---
predictBtn.addEventListener('click', async () => {
    const symptoms = symptomsInput.value.trim();

    if (!symptoms) {
        alert("Please describe your symptoms first.");
        return;
    }

    predictBtnText.classList.add('hidden');
    predictLoader.classList.remove('hidden');
    predictBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptoms })
        });

        if (!response.ok) throw new Error('Prediction API failed');

        const data = await response.json();
        currentDiagnosis = data.result || "Unknown condition";
        diseaseText.innerHTML = marked.parse(currentDiagnosis);

        resultBox.classList.remove('hidden');
        appointmentWrapper.classList.remove('hidden');

    } catch (error) {
        console.error("Error:", error);
        alert("Failed to connect to the diagnosis service.");
    } finally {
        predictBtnText.classList.remove('hidden');
        predictLoader.classList.add('hidden');
        predictBtn.disabled = false;
    }
});

// --- Chat Initialization ---
bookAppointmentBtn.addEventListener('click', () => {
    diagnosisSection.classList.add('hidden');
    chatSection.classList.remove('hidden');

    // Add context to chat if diagnosis exists
    if (currentDiagnosis && chatHistory.length === 0) {
        const introMsg = `I was just diagnosed with ${currentDiagnosis}. I'd like to book an appointment with a specialist.`;
        chatWindow.appendChild(createMessageElement(introMsg, true));
        sendMessage(introMsg);
    }

    chatInput.focus();
});

closeChatBtn.addEventListener('click', () => {
    chatSection.classList.add('hidden');
    diagnosisSection.classList.remove('hidden');
});

// --- Chat Logic ---
function createMessageElement(content, isUser = false) {
    const wrapper = document.createElement('div');
    wrapper.className = `message ${isUser ? 'user-message' : 'ai-message'} fade-in`;

    const formattedContent = isUser ? content : marked.parse(content);

    wrapper.innerHTML = `
        <div class="avatar">${isUser ? 'U' : 'AI'}</div>
        <div class="bubble">${formattedContent}</div>
    `;
    return wrapper;
}

function showTypingIndicator() {
    const wrapper = document.createElement('div');
    wrapper.className = 'message ai-message typing-wrap slide-up';
    wrapper.id = 'typing-indicator';
    wrapper.innerHTML = `
        <div class="avatar">AI</div>
        <div class="bubble">
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    chatWindow.appendChild(wrapper);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

async function sendMessage(overrideMessage = null) {
    const message = overrideMessage || chatInput.value.trim();
    console.log("Sending message:", message);
    if (!message) return;

    if (!overrideMessage) {
        // 1. Add User Message to UI
        chatWindow.appendChild(createMessageElement(message, true));
        chatInput.value = '';
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // 2. Show typing indicator
    showTypingIndicator();
    chatInput.disabled = true;
    sendBtn.disabled = true;

    try {
        // 3. Call Chat API
        const userEmail = localStorage.getItem('userEmail');

        // Include predicted disease in the request so agent can use it
        const payload = {
            message,
            history: chatHistory,
            email: userEmail
        };

        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Chat API failed');

        const data = await response.json();

        // 4. Update state and UI
        chatHistory = data.history;
        hideTypingIndicator();

        // Render AI response
        chatWindow.appendChild(createMessageElement(data.response, false));
        chatWindow.scrollTop = chatWindow.scrollHeight;

    } catch (error) {
        console.error("Error calling chat endpoint:", error);
        hideTypingIndicator();
        chatWindow.appendChild(createMessageElement("Sorry, I'm having trouble connecting to the server. Please try again.", false));
    } finally {
        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatInput.focus();
    }
}

sendBtn.addEventListener('click', () => sendMessage());

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
