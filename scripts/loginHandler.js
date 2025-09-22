function validateLoginEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email === null || email.length === 0 || !re.test(email)){
        return false;
    }
    return true;
}

function validateLoginPassowrd(password){
    if(password === null || password.length < 8){
        return false;
    }
    return true;
}

function locallyStoreUser(res) {
    console.log(res);
    if('email' in res){
        window.localStorage.setItem('EMAIL', res.email);
    }
    if('name' in res){
        window.localStorage.setItem('NAME', res.name);
    }
    if('gender' in res){
        window.localStorage.setItem('GENDER', res.gender);
    }
    if('profile' in res){
        window.localStorage.setItem('PROFILE_URL', res.profile);
    }
    if('location' in res){
        window.localStorage.setItem('LOCATION', res.location);
    }
    if('caption' in res){
        window.localStorage.setItem('CAPTION', res.caption);
    }
    if('created_at' in res){
        window.localStorage.setItem('CREATED_AT', res.created_at);
    }
}

function loginInputHandler(){
    emailBox = document.getElementById('login-email');
    passwordBox = document.getElementById('login-password');
    console.log(emailBox.value, passwordBox.value);
    if(!validateLoginEmail(emailBox.value)){
        alert('Enter valid email');
        return;
    }
    if(!validateLoginPassowrd(passwordBox.value)){
        alert('Enter valid password');
        return;
    }
    // TODO: DB operation and account exists check
    data = { "email": emailBox.value, "password": passwordBox.value};
    $.ajax({
    type: 'POST',
    url: 'http://localhost:8000/login',
    contentType: 'application/json', // ✅ tells Laravel to treat body as JSON
    data: JSON.stringify(data),
    success: function(res) {
        if("error" in res){
            alert(res["error"]);
            return;
        }

        // Persist login cookie for 30 days instead of 1 day to avoid frequent sign-outs
        var thirtyDaysMs = 30 * 24 * 60 * 60 * 1000; // 30 days
        var expires = (new Date(Date.now() + thirtyDaysMs)).toUTCString();
        // SameSite=Lax works well for normal navigation flows
        document.cookie = "FOOD_LOVERS_LOGIN=" + res["email"] + "; expires=" + expires + "; path=/; SameSite=Lax";
        locallyStoreUser(res);
        window.location.href = 'home.html';
    },
    error: function(error){
        console.log('Error');
        console.log(JSON.stringify(error));
        alert(error.responseJSON?.error || 'Login failed. Try again.');
    }
});


}

function displayImageOnProfileIcon(){
    const imgEl = document.getElementById('nav-profile-img-icon');
    if (!imgEl) return;
    // Use the verified working absolute path for default image
    const defaultSrc = window.location.origin + '/YUMUNITY%20APP/assets/images/default-profile.jpeg';

    // Fallback to default if provided URL fails to load
    imgEl.onerror = function() {
        this.onerror = null; // prevent infinite loop
        this.src = defaultSrc;
        try { console.warn('Navbar profile image failed to load. Falling back to default:', this.src); } catch(e) {}
    };

    const stored = window.localStorage.getItem('PROFILE_URL');
    const profileUrl = stored !== null ? String(stored) : '';
    // Always set default first
    imgEl.src = defaultSrc;
    try { console.log('Navbar default image set to:', defaultSrc); } catch(e) {}

    // Use stored URL if present (supports data URL and http/https URLs)
    const looksValid = profileUrl && profileUrl !== 'null' && profileUrl !== 'undefined' && profileUrl.trim() !== '';
    if (looksValid) {
        try { console.log('Setting navbar profile image from stored URL'); } catch(e) {}
        imgEl.src = profileUrl;
    }
}

function alterNavigation(isLoggedIn){
    profileImage = document.getElementById('nav-profile-img');
    loginButton = document.getElementById('nav-login-btn');
    signupButton = document.getElementById('nav-signup-btn');
    profileImageMobile = document.getElementById('nav-profile-img-mobile');
    loginButtonMobile = document.getElementById('nav-login-btn-mobile');
    signupButtonMobile = document.getElementById('nav-signup-btn-mobile');
    if(isLoggedIn){
        profileImage.style.display = 'block';
        displayImageOnProfileIcon();
        loginButton.style.display = 'none';
        signupButton.style.display = 'none';
        profileImageMobile.style.display = 'block';
        loginButtonMobile.style.display = 'none';
        signupButtonMobile.style.display = 'none';
    }
    else {
        profileImage.style.display = 'none';
        loginButton.style.display = 'block';
        signupButton.style.display = 'block';
        profileImageMobile.style.display = 'none';
        loginButtonMobile.style.display = 'block';
        signupButtonMobile.style.display = 'block';
    }
}

function checkAlreadyLoggedIn(){
    if(typeof $.cookie('FOOD_LOVERS_LOGIN') === 'undefined'){
        return false;
    }
    else {
        return true;
    }
}

function ensureServerUserExists(email){
    if(!email) return;
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/getUser',
        contentType: 'application/json',
        dataType: 'json',
        headers: { 'Accept': 'application/json' },
        data: JSON.stringify({ email: email }),
        success: function(res){
            // ok
        },
        error: function(err){
            // Only clear session if server CONFIRMS user does not exist (404)
            var status = err && (err.status || err?.responseJSON?.status);
            if (status === 404) {
                try { console.warn('User not found on server. Clearing local session.'); } catch(e) {}
                try { $.removeCookie('FOOD_LOVERS_LOGIN', { path: '/' }); } catch(e) {}
                try { window.localStorage.clear(); } catch(e) {}
                alert('Your session is invalid or the user no longer exists. Please log in again.');
                alterNavigation(false);
            } else {
                // Network/CORS/5xx: keep user logged in and just warn in console
                try { console.warn('Could not verify session with server. Status:', status); } catch(e) {}
            }
        }
    });
}

function updateStorageIfLoggedIn(){
    if(checkAlreadyLoggedIn()){
        let email = $.cookie('FOOD_LOVERS_LOGIN')
        window.localStorage.setItem('EMAIL', email);
        alterNavigation(true);
        // Verify that this email exists on the server; if not, reset session
        ensureServerUserExists(email);
    }
    else {
        alterNavigation(false);
    }
}

updateStorageIfLoggedIn();