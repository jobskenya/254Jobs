document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  // Load user data
  try {
    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to load profile');
    
    const user = await response.json();
    renderProfile(user);
    
    // Load transactions
    await loadTransactions();
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load profile. Please try again.');
  }

  // Set up withdrawal button
  const withdrawBtn = document.getElementById('withdraw-btn');
  const modal = document.getElementById('withdrawal-modal');
  const closeModal = document.getElementById('close-modal');
  
  withdrawBtn.addEventListener('click', () => {
    const balance = parseInt(document.getElementById('balance').textContent.replace('Ksh ', ''));
    
    if (balance >= 3000) {
      window.open('https://api.whatsapp.com/send?phone=+2547XXXXXXX&text=Please%20allow%20my%20withdrawal', '_blank');
    } else {
      document.getElementById('modal-message').textContent = `You need to reach Ksh 3000 before you can withdraw. Current balance: Ksh ${balance}`;
      modal.classList.remove('hidden');
    }
  });
  
  closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
});

function renderProfile(user) {
  document.getElementById('profile-image').src = user.profile_image;
  document.getElementById('full-name').textContent = user.full_name;
  document.getElementById('user-phone').textContent = user.phone;
  document.getElementById('total-shares').textContent = user.shares;
  document.getElementById('total-earnings').textContent = `Ksh ${user.earnings}`;
  document.getElementById('balance').textContent = `Ksh ${user.balance}`;
  
  // Update progress bar
  const progress = Math.min((user.balance / 3000) * 100, 100);
  document.getElementById('progress-bar').style.width = `${progress}%`;
  
  // Enable/disable withdraw button
  const withdrawBtn = document.getElementById('withdraw-btn');
  if (user.balance >= 3000) {
    withdrawBtn.disabled = false;
    // Trigger confetti if just reached threshold
    if (user.balance - 100 < 3000) {
      triggerConfetti();
    }
  } else {
    withdrawBtn.disabled = true;
  }
}

async function loadTransactions() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/auth/transactions', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to load transactions');
    
    const transactions = await response.json();
    renderTransactions(transactions);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load transactions. Please try again.');
  }
}

function renderTransactions(transactions) {
  const table = document.getElementById('transactions-table');
  table.innerHTML = '';
  
  if (transactions.length === 0) {
    table.innerHTML = '<tr><td colspan="3" class="py-4 text-center text-gray-500">No transactions yet</td></tr>';
    return;
  }
  
  transactions.forEach(transaction => {
    const row = document.createElement('tr');
    row.className = 'border-b';
    row.innerHTML = `
      <td class="py-3">${transaction.job_title}</td>
      <td class="py-3">Ksh ${transaction.amount}</td>
      <td class="py-3">${new Date(transaction.timestamp).toLocaleString()}</td>
    `;
    table.appendChild(row);
  });
}

function triggerConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}
