/*** Portfolio interactions for Negar Pirasteh ***/
const menuToggle = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('header');
const backToTopButton = document.getElementById('back-to-top');
const body = document.body;
const navBackdrop = document.getElementById('nav-backdrop');
const navLinks = Array.from(document.querySelectorAll('.navbar a[href^="#"]'));
const scrollProgressBar = document.getElementById('scroll-progress');
const sectionAnchors = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter((section) => section);

const closeMobileMenu = () => {
  if (menuToggle) {
    menuToggle.classList.remove('bx-x');
  }
  if (navbar) {
    navbar.classList.remove('active');
  }
  body.classList.remove('menu-open');
  if (navBackdrop) {
    navBackdrop.classList.remove('active');
  }
};

if (menuToggle && navbar) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('active');
    menuToggle.classList.toggle('bx-x', isOpen);
    body.classList.toggle('menu-open', isOpen);
    if (navBackdrop) {
      navBackdrop.classList.toggle('active', isOpen);
    }
  });
}

function updateActiveNav(activeOverride) {
  if (!sectionAnchors.length) {
    return;
  }

  let activeId = activeOverride || sectionAnchors[0].id;

  if (!activeOverride) {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    sectionAnchors.forEach((section) => {
      if (section.offsetTop - 160 <= scrollPos) {
        activeId = section.id;
      }
    });
  }

  navLinks.forEach((link) => {
    const matches = activeId && link.getAttribute('href') === `#${activeId}`;
    link.classList.toggle('active', matches);
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const targetId = link.getAttribute('href')?.slice(1);
    closeMobileMenu();
    if (targetId) {
      updateActiveNav(targetId);
    }
  });
});

function updateScrollProgress(scrollOffset) {
  if (!scrollProgressBar) {
    return;
  }

  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? Math.min(scrollOffset / docHeight, 1) : 0;
  scrollProgressBar.style.transform = `scaleX(${progress})`;
}

const handleScroll = () => {
  const offset = window.scrollY || document.documentElement.scrollTop;

  if (header) {
    header.classList.toggle('scrolled', offset > 24);
  }

  if (offset > 48 && navbar && navbar.classList.contains('active')) {
    closeMobileMenu();
  }

  updateScrollProgress(offset);
  updateActiveNav();

  if (backToTopButton) {
    backToTopButton.style.display = offset > 240 ? 'block' : 'none';
  }
};

window.addEventListener('scroll', handleScroll);
handleScroll();

if (navBackdrop) {
  navBackdrop.addEventListener('click', closeMobileMenu);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && body.classList.contains('menu-open')) {
    closeMobileMenu();
  }
});

if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const sr = ScrollReveal({
  distance: '60px',
  duration: 2000,
  reset: false,
  easing: 'ease',
});

sr.reveal('.main-text', { delay: 120, origin: 'left' });
sr.reveal('.hero-visual', { delay: 220, origin: 'right' });
sr.reveal('.about-img', { delay: 160, origin: 'left' });
sr.reveal('.about-text', { delay: 220, origin: 'right' });
sr.reveal('.resume .row', { interval: 120, origin: 'bottom' });
sr.reveal('.skill-item', { interval: 90, origin: 'bottom' });
sr.reveal('.experience-item', { interval: 160, origin: 'bottom' });
sr.reveal('.project-tile', { interval: 140, origin: 'bottom' });
sr.reveal('.contact-form', { delay: 200, origin: 'bottom' });
sr.reveal('.social-icons-contact', { delay: 260, origin: 'bottom' });

$(document).ready(function () {
  $('#contactForm').submit(function (event) {
    event.preventDefault();

    var isNameValid = validateName(),
      isEmailValid = validateEmail(),
      isDescriptionValid = validateDescription();

    if (isNameValid && isEmailValid && isDescriptionValid) {
      var formData = {
        email: $('#email').val(),
        message: $('#projectdesc').val(),
        name: $('#usernames').val(),
      };

      fetch('https://formspree.io/f/xgvvldgb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.ok) {
            $('#thankYouModal').fadeIn();
            $('#contactForm')[0].reset();
          } else {
            alert('Failed to send the message. Please try again later.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('Failed to send the message. Please try again later.');
        });
    }
  });

  $('.close-modal').click(function () {
    $('#thankYouModal').fadeOut();
    $('#clearDataModal').fadeOut();
  });

  $(window).click(function (event) {
    if ($(event.target).is('#thankYouModal')) {
      $('#thankYouModal').fadeOut();
    }
    if ($(event.target).is('#clearDataModal')) {
      $('#clearDataModal').fadeOut();
    }
  });

  function validateName() {
    var nameValue = $('#usernames').val();
    if (nameValue.length === 0) {
      $('#namecheck').text('Please enter your name.');
      return false;
    } else if (nameValue.length < 3 || nameValue.length > 25) {
      $('#namecheck').text('Name must be between 3 and 25 characters.');
      return false;
    }
    $('#namecheck').text('');
    return true;
  }

  function validateEmail() {
    var emailValue = $('#email').val();
    var regex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
    if (!regex.test(emailValue)) {
      $('#emailcheck').text('Please enter a valid email address.');
      return false;
    }
    $('#emailcheck').text('');
    return true;
  }

  function validateDescription() {
    var descriptionValue = $('#projectdesc').val();
    if (descriptionValue.length === 0) {
      $('#descriptioncheck').text(
        'Please enter a description for your project or career.'
      );
      return false;
    }
    $('#descriptioncheck').text('');
    return true;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const usernameInput = document.getElementById('usernames');
  const emailInput = document.getElementById('email');
  const projectDescInput = document.getElementById('projectdesc');
  const clearDataBtn = document.getElementById('clearData');

  if (!form) {
    return;
  }

  usernameInput.value = getCookie('username') || '';
  emailInput.value = getCookie('email') || '';
  projectDescInput.value = getCookie('projectdesc') || '';

  form.addEventListener('submit', function () {
    setCookie('username', usernameInput.value, 7);
    setCookie('email', emailInput.value, 7);
    setCookie('projectdesc', projectDescInput.value, 7);
  });

  clearDataBtn.addEventListener('click', function () {
    usernameInput.value = '';
    emailInput.value = '';
    projectDescInput.value = '';

    deleteCookie('username');
    deleteCookie('email');
    deleteCookie('projectdesc');

    document.getElementById('clearDataModal').style.display = 'block';
  });

  document.querySelectorAll('.close-modal').forEach((closeBtn) => {
    closeBtn.addEventListener('click', function () {
      document.getElementById('clearDataModal').style.display = 'none';
    });
  });

  window.addEventListener('click', function (event) {
    const clearModal = document.getElementById('clearDataModal');
    if (event.target === clearModal) {
      clearModal.style.display = 'none';
    }
  });

  function setCookie(name, value, days) {
    var expires = '';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  }

  function getCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
  }
});


