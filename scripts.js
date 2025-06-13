// Registration Form Handling
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    full_name: document.getElementById('full_name').value,
    phone: document.getElementById('phone').value,
    gender: document.getElementById('gender').value,
    password: document.getElementById('password').value
  };

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    
    localStorage.setItem('token', data.token);
    window.location.href = 'profile.html';
  } catch (error) {
    alert(error.message);
    console.error('Registration error:', error);
  }
});

// Login Form Handling
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    phone: document.getElementById('login-phone').value,
    password: document.getElementById('login-password').value
  };

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    
    if (!response.ok) throw new Error(data.message || 'Login failed');
    
    localStorage.setItem('token', data.token);
    window.location.href = 'profile.html';
  } catch (error) {
    alert(error.message);
    console.error('Login error:', error);
  }
});

// Check authentication state
function checkAuth() {
  const token = localStorage.getItem('token');
  const protectedPages = ['profile.html', 'jobs.html'];
  
  if (protectedPages.includes(window.location.pathname.split('/').pop()) && !token) {
    window.location.href = 'index.html';
  }
}

// Initialize
const API_URL = process.env.API_URL || 'http://localhost:5000';
checkAuth();
