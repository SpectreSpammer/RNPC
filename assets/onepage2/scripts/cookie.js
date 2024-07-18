// Utility functions for cookie operations (from #1)
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// Specific functions for cookie consent (from #4)
function acceptCookies() {
    setCookie('cookieConsent', 'accepted', 30);
    document.getElementById('cookieConsent').style.display = 'none';
    document.getElementById('cookieStatus').innerHTML = 'Cookies accepted!';
}

function rejectCookies() {
    setCookie('cookieConsent', 'rejected', 30);
    document.getElementById('cookieConsent').style.display = 'none';
    document.getElementById('cookieStatus').innerHTML = 'Cookies rejected.';
}

// Check cookie consent status on page load
window.onload = function() {
    let consent = getCookie('cookieConsent');
    if (consent === 'accepted') {
        document.getElementById('cookieConsent').style.display = 'none';
        document.getElementById('cookieStatus').innerHTML = 'Cookies accepted!';
    } else if (consent === 'rejected') {
        document.getElementById('cookieConsent').style.display = 'none';
        document.getElementById('cookieStatus').innerHTML = 'Cookies rejected.';
    }
}