
window.onscroll = function() {scrollFunction()};

window.onload = function () {
  const typedText = document.getElementById("typed-text");
  const cursor = document.querySelector(".cursor");

  if (!typedText || !cursor) return;

  const titles = [
    "Md Washim Akram",
    "a Software Engineer",
    "a Problem Solver",
    "a Researcher",
    "an Explorer",
    "a Tech Enthusiast",
    "a Lifelong Learner"
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;

  function typeLoop() {
    const currentTitle = titles[titleIndex];
    if (isDeleting) {
      typedText.textContent = currentTitle.substring(0, charIndex--);
    } else {
      typedText.textContent = currentTitle.substring(0, charIndex++);
    }

    if (!isDeleting && charIndex === currentTitle.length + 1) {
      isDeleting = true;
      delay = 3500;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      delay = 300;
    } else {
      delay = isDeleting ? 50 : 100;
    }

    setTimeout(typeLoop, delay);
  }

  typeLoop();
};



function scrollFunction() {
    var navbar = document.getElementById("navbar");
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        navbar.style.position = "fixed";
        navbar.style.top = "0";
        navbar.style.right = "0px";
    } else {
        navbar.style.position = "static";
    }
}


function BadClicked(){
    var win = window.open("majak.html","Kesa laga mere majak","width=500, height=400 scrollbars=1");
    setTimeout(function() { win. close();}, 2000);
}



// JavaScript to toggle the visibility of the navbar on smaller screens and restore it on window resize
document.addEventListener('DOMContentLoaded', function() {
  var menuIcon = document.getElementById('menu-icon');
  var navbar = document.getElementById('navbar');
  
  // Function to toggle the visibility of the navbar and update the icon
  function toggleNavbar() {
      navbar.classList.toggle('active');
      
      // Change the icon based on the visibility of the navbar
      if (navbar.classList.contains('active')) {
          menuIcon.querySelector('i').classList.remove('fa-eye-slash');
          menuIcon.querySelector('i').classList.add('fa-eye');
      } else {
          menuIcon.querySelector('i').classList.remove('fa-eye');
          menuIcon.querySelector('i').classList.add('fa-eye-slash');
      }
  }
  
  // Toggle the visibility of the navbar on clicking the menu icon
  menuIcon.addEventListener('click', toggleNavbar);
  
  // Function to check the window width and toggle the navbar visibility accordingly
  function checkWindowWidth() {
      if (window.innerWidth <= 768) { // Adjust the breakpoint as needed
          //navbar.classList.remove('active');
          menuIcon.querySelector('i').classList.remove('fa-eye');
          menuIcon.querySelector('i').classList.add('fa-eye-slash');
      } else {
          navbar.classList.add('active');
          menuIcon.querySelector('i').classList.remove('fa-eye-slash');
          menuIcon.querySelector('i').classList.add('fa-eye');
      }
  }
  
  // Call the function to check window width initially
  checkWindowWidth();
  
  // Listen for window resize events and toggle navbar visibility accordingly
  window.addEventListener('resize', checkWindowWidth);
});



//about me auto scroll start.......................................................
// Function to scroll to the "About Me" section
function scrollToAboutMe() {
    // Get the position of the "About Me" section
    var aboutMeSection = document.getElementById('about-me');
  
    if (aboutMeSection) {
      // Get the height of the navbar
      var navbarHeight = document.querySelector('.navbar').offsetHeight;
      // Add the top margin of the navbar to the scroll position
      var topMargin = 500; // Adjust this value as needed
  
      // Calculate the target scroll position
      var targetScrollPosition = aboutMeSection.offsetTop - navbarHeight - topMargin;
  
      // Scroll to the "About Me" section with smooth behavior
      window.scrollTo({
        top: 5000,
        behavior: 'smooth'
      });
    }
  }
  
  // Add event listener to the "About Me" link
  document.addEventListener('DOMContentLoaded', function() {
    var aboutMeLink = document.getElementById('about-me-link');
    if (aboutMeLink) {
      aboutMeLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        scrollToAboutMe(); // Call the scrollToAboutMe function
      });
    }
  });
// about me auto scroll end here..........................................

// auto scroll to contact / footer start......................................
// Function to scroll to the "Contact" section
function scrollToContact() {
    // Get the position of the "Contact" section
    var contactSection = document.getElementById('footer');
  
    if (contactSection) {
      // Get the height of the navbar
      var navbarHeight = document.querySelector('.navbar').offsetHeight;
      // Add the top margin of the navbar to the scroll position
      var topMargin = 120; // Adjust this value as needed
  
      // Calculate the target scroll position
      var targetScrollPosition = contactSection.offsetTop - navbarHeight - topMargin;
  
      // Scroll to the "Contact" section with smooth behavior
      window.scrollTo({
        top: targetScrollPosition,
        behavior: 'smooth'
      });
    }
}

// Add event listener to the "Contact" link
document.addEventListener('DOMContentLoaded', function() {
    var contactLink = document.getElementById('contact-link');
    if (contactLink) {
        contactLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            scrollToContact(); // Call the scrollToContact function
        });
    }
});

// auto scroll to contact / footer end here...........................................


