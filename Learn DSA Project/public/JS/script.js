document.addEventListener("DOMContentLoaded", () => {
  showLogin();
});

function showLogin() {
  document.getElementById("login-form").classList.add("active");
  document.getElementById("signup-form").classList.remove("active");
  document.getElementById("login-toggle").classList.add("active");
  document.getElementById("signup-toggle").classList.remove("active");
}

function showSignup() {
  document.getElementById("login-form").classList.remove("active");
  document.getElementById("signup-form").classList.add("active");
  document.getElementById("signup-toggle").classList.add("active");
  document.getElementById("login-toggle").classList.remove("active");
}

function togglePassword(passwordId, toggleIcon) {
  const passwordField = document.getElementById(passwordId);
  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleIcon.innerText = "🙈";
  } else {
    passwordField.type = "password";
    toggleIcon.innerText = "👁️";
  }
}
