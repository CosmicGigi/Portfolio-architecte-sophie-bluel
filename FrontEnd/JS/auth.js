document.addEventListener('DOMContentLoaded', () => {
    const authvalid = document.getElementById("authvalid");
    const authToken = sessionStorage.getItem('authToken');
    const userRole = sessionStorage.getItem('userRole');

    
    if (authToken) {
        authvalid.innerHTML = "logout";
        authvalid.href = "#";
        authvalid.style.fontSize = '16.8px';
        authvalid.style.padding = '0 10px';
    } else {
        authvalid.innerHTML = "login";
        authvalid.href = 'login.html';
        authvalid.style.fontWeight = 'normal';
        authvalid.style.fontSize = '16.8px';
        authvalid.style.padding = '0 10px';
    }

    authvalid.addEventListener('click', () => {
        if (authToken) {
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('userRole');
            authvalid.innerHTML = "login";
            authvalid.href = 'index.html';
            authvalid.style.fontWeight = 'normal';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const isAdmin = checkIfUserIsAdmin();

    if (isAdmin) {
        document.getElementById('openModalBtn').style.display = 'block';
    }
});

function checkIfUserIsAdmin() {
    return true;
}