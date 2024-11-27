
  
  const recruiterButton = document.getElementById('recruiterButton');
  const jobSeekerButton = document.getElementById('jobSeekerButton');
  const recruiterFormContainer = document.getElementById('recruiterFormContainer');
  const jobSeekerFormContainer = document.getElementById('jobSeekerFormContainer');

  // Show Recruiter Form
  recruiterButton.addEventListener('click', () => {
    jobSeekerFormContainer.classList.remove('active');
    recruiterFormContainer.classList.add('active');
  });

  // Show Job Seeker Form
  jobSeekerButton.addEventListener('click', () => {
    recruiterFormContainer.classList.remove('active');
    jobSeekerFormContainer.classList.add('active');
  });