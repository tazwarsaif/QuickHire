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
  });
  