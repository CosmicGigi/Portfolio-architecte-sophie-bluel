document.addEventListener('DOMContentLoaded', () => {
    const authvalid = document.getElementById("authvalid");
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    // Affiche ou cache le lien de connexion/déconnexion selon l'état d'authentification
    if (authToken) {
        authvalid.innerHTML = "logout";
        authvalid.href = "#"; // Empêche la redirection par défaut
        authvalid.style.fontSize = '16.8px'; // Ajuste la taille du texte si nécessaire
        authvalid.style.padding = '0 10px'; // Ajout du padding
    } else {
        authvalid.innerHTML = "login";
        authvalid.href = 'login.html'; // Lien vers la page de connexion
        authvalid.style.fontWeight = 'normal'; // Réinitialise le style du texte
        authvalid.style.fontSize = '16.8px'; // Ajuste la taille du texte si nécessaire
        authvalid.style.padding = '0 10px'; // Ajout du padding
    }

    authvalid.addEventListener('click', () => {
        if (authToken) {
            localStorage.removeItem('authToken'); // Supprime le token d'authentification
            localStorage.removeItem('userRole'); // Supprime le rôle de l'utilisateur (si nécessaire)
            authvalid.innerHTML = "login"; // Réinitialise le lien de connexion
            authvalid.href = 'index.html'; // Redirige vers la page de connexion
            authvalid.style.fontWeight = 'normal'; // Réinitialise le style du texte
        }
    });
});
