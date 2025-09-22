// ---------------------- Validation Functions ----------------------
function validateSignupName(name) {
    return name && name.length >= 6;
}

function validateSignupEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email && re.test(email);
}

function validateSignupPassword(password) {
    return password && password.length >= 8;
}

// ---------------------- Local Storage ----------------------
function locallyStoreUser(res) {
    if ('email' in res) window.localStorage.setItem('EMAIL', res.email);
    if ('name' in res) window.localStorage.setItem('NAME', res.name);
    if ('gender' in res) window.localStorage.setItem('GENDER', res.gender);
    if ('profile' in res) window.localStorage.setItem('PROFILE_URL', res.profile);
    if ('location' in res) window.localStorage.setItem('LOCATION', res.location);
    if ('caption' in res) window.localStorage.setItem('CAPTION', res.caption);
}

// ---------------------- Signup Handler ----------------------
function signupInputHandler() {
    const nameBox = document.getElementById('signup-name');
    const emailBox = document.getElementById('signup-email');
    const passwordBox = document.getElementById('signup-password');
    const confirmPasswordBox = document.getElementById('signup-confirm-password');

    // ---------------------- Validations ----------------------
    if (!validateSignupName(nameBox.value)) {
        alert('Enter Full Name of at least 6 characters.');
        return;
    }
    if (!validateSignupEmail(emailBox.value)) {
        alert('Enter a valid email.');
        return;
    }
    if (!validateSignupPassword(passwordBox.value)) {
        alert('Enter a password containing at least 8 characters.');
        return;
    }
    if (passwordBox.value !== confirmPasswordBox.value) {
        alert('Password and Confirm Password should match.');
        return;
    }

    // ---------------------- AJAX Call ----------------------
    $.ajax({
        url: 'http://127.0.0.1:8000/createUser',
        type: 'POST',
        data: JSON.stringify({
            name: nameBox.value,
            email: emailBox.value,
            password: passwordBox.value,
            password_confirmation: confirmPasswordBox.value
        }),
        contentType: 'application/json',
        success: function (response) {
            alert('Account created successfully!');
            locallyStoreUser(response);
            window.location.href = 'login.html';
        },
        error: function (xhr, status, error) {
            try {
                const res = JSON.parse(xhr.responseText);
                if (res.errors && res.errors.email) {
                    alert('Signup failed: ' + res.errors.email[0]);
                } else if (res.message) {
                    alert('Signup failed: ' + res.message);
                } else {
                    alert('Signup failed: Unknown error');
                }
            } catch (e) {
                alert('Signup failed: ' + xhr.responseText);
            }
        }
    });
}
