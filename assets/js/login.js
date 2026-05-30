document.addEventListener('DOMContentLoaded', function (e) {
    e.preventDefault();
            const loginForm = document.getElementById('loginForm');
            const passwordToggle = document.getElementById('passwordToggle');
            const passwordInput = document.getElementById('password');
            const alertContainer = document.getElementById('alertContainer');

            // Password visibility toggle
            passwordToggle.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                // Update icon
                const icon = this.querySelector('i');
                icon.classList.toggle('bi-eye');
                icon.classList.toggle('bi-eye-slash');
            });

            // Login form submission
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value;

                // Validate inputs
                if (!email || !password) {
                    showAlert('All fields are required', 'warning');
                    return;
                }

                // Validate email format
                if (!isValidEmail(email)) {
                    showAlert(langManager.translate('errorEmailInvalid'), 'danger');
                    return;
                }

                // Attempt login
                const result = authManager.login(email, password);

                if (result.success) {
                    showAlert(result.message, 'success');
                    
                    // Redirect based on role
                    setTimeout(() => {
                        const user = result.user;
                        if (user.role === 'admin') {
                            window.location.href = '../admin/dashboard.html';
                        } else {
                            window.location.href = '../client/dashboard.html';
                        }
                    }, 1500);
                } else {
                    showAlert(result.message, 'danger');
                }
            });

            // Show alert function
            function showAlert(message, type) {
                alertContainer.innerHTML = `
                    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                        ${message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
            }

            // Email validation
            function isValidEmail(email) {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(email);
            }

            // Auto-translate on language change
            document.addEventListener('languageChanged', function(e) {
                const lang = e.detail.language;
                if (lang === 'ar') {
                    document.documentElement.dir = 'rtl';
                } else {
                    document.documentElement.dir = 'ltr';
                }
            });
        });