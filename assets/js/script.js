/***     Your global javascript or jquery section here */
let menu = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

menu.onclick = () => {
  menu.classList.toggle("bx-x");
  navbar.classList.toggle("active");
};
window.onscroll = () => {
  menu.classList.remove("bx-x");
  navbar.classList.remove("active");
};

const sr = ScrollReveal({
  distance: "60px",
  duration: 2500,
  reset: true,
});

sr.reveal(".main-text", { delay: 200, origin: "top" });

$(document).ready(function () {
  $("#contactForm").submit(function (event) {
    event.preventDefault(); // Prevent default form submission

    var isNameValid = validateName(),
      isEmailValid = validateEmail(),
      isDescriptionValid = validateDescription();

    if (isNameValid && isEmailValid && isDescriptionValid) {
      // Collect form data
      var formData = {
        email: $("#email").val(),
        message: $("#projectdesc").val(),
        name: $("#usernames").val(),
      };

      // Send data to Formspree
      fetch("https://formspree.io/f/xgvvldgb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.ok) {
            // Show the thank-you modal
            $("#thankYouModal").fadeIn();

            // Clear the form
            $("#contactForm")[0].reset();
          } else {
            alert("Failed to send the message. Please try again later.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to send the message. Please try again later.");
        });
    }
  });

  // Close modal on clicking the close button or outside the modal
  $(".close-modal").click(function () {
    $("#thankYouModal").fadeOut();
  });

  $(window).click(function (event) {
    if ($(event.target).is("#thankYouModal")) {
      $("#thankYouModal").fadeOut();
    }
  });

  function validateName() {
    var nameValue = $("#usernames").val();
    if (nameValue.length === 0) {
      $("#namecheck").text("Please enter your name.");
      return false;
    } else if (nameValue.length < 3 || nameValue.length > 25) {
      $("#namecheck").text("Name must be between 3 and 25 characters.");
      return false;
    }
    $("#namecheck").text("");
    return true;
  }

  function validateEmail() {
    var emailValue = $("#email").val();
    var regex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
    if (!regex.test(emailValue)) {
      $("#emailcheck").text("Please enter a valid email address.");
      return false;
    }
    $("#emailcheck").text("");
    return true;
  }

  function validateDescription() {
    var descriptionValue = $("#projectdesc").val();
    if (descriptionValue.length === 0) {
      $("#descriptioncheck").text(
        "Please enter a description for your project or career."
      );
      return false;
    }
    $("#descriptioncheck").text("");
    return true;
  }
});

document.addEventListener("DOMContentLoaded", (event) => {
  const form = document.getElementById("contactForm");
  const usernameInput = document.getElementById("usernames");
  const emailInput = document.getElementById("email");
  const projectDescInput = document.getElementById("projectdesc");
  const clearDataBtn = document.getElementById("clearData");

  usernameInput.value = getCookie("username") || "";
  emailInput.value = getCookie("email") || "";
  projectDescInput.value = getCookie("projectdesc") || "";

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    setCookie("username", usernameInput.value, 7);
    setCookie("email", emailInput.value, 7);
    setCookie("projectdesc", projectDescInput.value, 7);
  });

  clearDataBtn.addEventListener("click", function () {
    // Clear the form
    usernameInput.value = "";
    emailInput.value = "";
    projectDescInput.value = "";

    // Clear the cookies
    deleteCookie("username");
    deleteCookie("email");
    deleteCookie("projectdesc");
  });
});

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = name + "=; Max-Age=-99999999;";
}

const mybutton = document.getElementById("back-to-top");

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

mybutton.onclick = function () {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};
