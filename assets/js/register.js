
// document.addEventListener('DOMContentLoaded', function() {
//     const registerForm = document.getElementById('registerFormbtn');
//     const passwordToggle = document.getElementById('passwordToggle');
//     const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
//     const passwordInput = document.getElementById('password');
//     const confirmPasswordInput = document.getElementById('confirmPassword');
//     const alertContainer = document.getElementById('alertContainer');

//     // Password visibility toggle
//     passwordToggle.addEventListener('click', function() {
//         togglePasswordVisibility(passwordInput, this);
//     });

//     confirmPasswordToggle.addEventListener('click', function() {
//         togglePasswordVisibility(confirmPasswordInput, this);
//     });

//     // Registration form submission
//     registerForm.addEventListener('submit', function(e) {
//         e.preventDefault();
        
//         const fullName = document.getElementById('fullName').value.trim();
//         const email = document.getElementById('email').value.trim();
//         const phone = document.getElementById('phone').value.trim();
//         const password = document.getElementById('password').value.trim();
//         const confirmPassword = document.getElementById('confirmPassword').value.trim();

//         // Validate all fields
//         if (!fullName || !email || !phone || !password || !confirmPassword) {
//             showAlert(langManager.translate('errorNameRequired'), 'warning');
//             return;
//         }
//         // Validate email format
//         if (!isValidEmail(email)) {
//             showAlert(langManager.translate('errorEmailInvalid'), 'danger');
//             return;
//         }
//         // Validate phone format
//         if (!isValidPhone(phone)) {
//             showAlert(langManager.translate('errorPhoneInvalid'), 'danger');
//             return;
//         }
//         // Validate password length
//         if (password.length < 8) {
//             showAlert(langManager.translate('errorPasswordMinLength'), 'danger');
//             return;
//         }
//         // Check password match
//         if (password !== confirmPassword) {
//             showAlert(langManager.translate('errorPasswordMatch'), 'danger');
//             return;
//         }
//         // Attempt registration
//         const result = authManager.register(fullName, email, phone, password);
//         if (result.success) {
//             showAlert(langManager.translate('successRegistration'), 'success');
//             // Redirect to login
//             window.location.href = 'login.html';
//         } else {
//             showAlert(result.message, 'danger');
//         }
//     });

//     // Show alert function
//     function showAlert(message, type) {
//         alertContainer.innerHTML = `
//             <div class="alert alert-${type} alert-dismissible fade show" role="alert">
//                 ${message}
//                 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//             </div>
//         `;
//     }

//     // Toggle password visibility
//     function togglePasswordVisibility(input, button) {
//         const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
//         input.setAttribute('type', type);
        
//         const icon = button.querySelector('i');
//         icon.classList.toggle('bi-eye');
//         icon.classList.toggle('bi-eye-slash');
//     }

//     // Email validation
//     function isValidEmail(email) {
//         const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return regex.test(email);
//     }

//     // Phone validation
//     function isValidPhone(phone) {
//         const regex = /^[0-9\s\-\+\(\)]{8,}$/;
//         return regex.test(phone);
//     }

//     // Auto-translate on language change
//     document.addEventListener('languageChanged', function(e) {
//         const lang = e.detail.language;
//         if (lang === 'ar') {
//             document.documentElement.dir = 'rtl';
//         } else {
//             document.documentElement.dir = 'ltr';
//         }
//     });
// });
