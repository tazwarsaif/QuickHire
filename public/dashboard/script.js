document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
    const navbarLinks = document.getElementById('navbarLinks');
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const logoutButton = document.getElementById('logoutButton');
  
    // Toggle navbar visibility
    toggleButton.addEventListener('click', () => {
      navbarLinks.classList.toggle('active');
    });
  
    // Search functionality
    searchButton.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) {
        alert(`Searching for: ${query}`);
        // Add search functionality logic here
      } else {
        alert('Please enter a search term.');
      }
    });
  
    // Logout functionality
    logoutButton.addEventListener('click', () => {
      const confirmation = confirm('Are you sure you want to log out?');
      
    });
  });
  