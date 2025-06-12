document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  // Load jobs from backend
  try {
    const response = await fetch('/api/jobs', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to load jobs');
    
    const jobs = await response.json();
    renderJobs(jobs);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load jobs. Please try again.');
  }
});

function renderJobs(jobs) {
  const container = document.getElementById('jobs-container');
  container.innerHTML = '';
  
  jobs.forEach(job => {
    const jobCard = document.createElement('div');
    jobCard.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300';
    jobCard.innerHTML = `
      <img src="${job.image_url}" alt="${job.title}" class="w-full h-48 object-cover">
      <div class="p-4">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-lg">${job.title}</h3>
          <span class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">Earn Ksh 100</span>
        </div>
        <p class="text-gray-600 mb-4">${job.description}</p>
        <div class="flex space-x-2">
          <a href="https://api.whatsapp.com/send?text=Check%20out%20${encodeURIComponent(job.title)}%20${encodeURIComponent(job.description)}%20https://yourwebsite.com/register" 
             class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex-1 text-center">
            <i class="fab fa-whatsapp mr-2"></i> WhatsApp
          </a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=https://yourwebsite.com/register" 
             class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex-1 text-center">
            <i class="fab fa-facebook mr-2"></i> Facebook
          </a>
        </div>
      </div>
    `;
    
    // Add click handler for share buttons
    const shareButtons = jobCard.querySelectorAll('a');
    shareButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        const shareUrl = button.href;
        
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('/api/jobs/share', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ jobId: job.id })
          });
          
          if (!response.ok) throw new Error('Failed to record share');
          
          // Open share link in new tab
          window.open(shareUrl, '_blank');
          
          // Show success feedback
          alert('Share recorded! You earned Ksh 100');
        } catch (error) {
          console.error('Error:', error);
          alert('Failed to record share. Please try again.');
        }
      });
    });
    
    container.appendChild(jobCard);
  });
}
