document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form'); // Utilisation de 'form' pour être plus générique
    const authvalid = document.getElementById("authvalid");
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole'); // Récupère le rôle de l'utilisateur (si nécessaire)

    // Crée et ajoute le message d'erreur au DOM
    const errorMessage = document.createElement('p');
        errorMessage.id = 'error-message';
        errorMessage.textContent = 'Informations de connexion incorrectes.';
        errorMessage.style.display = 'none'; // Initialement caché
        errorMessage.style.color = 'red'; // Couleur du texte rouge
    if (loginForm) {
        loginForm.appendChild(errorMessage);
    }

    // Affiche ou cache le lien de connexion/déconnexion selon l'état d'authentification
    if (authToken) {
        authvalid.innerHTML = "logout";
        authvalid.href = "#"; // Empêche la redirection par défaut
        authvalid.style.fontWeight = 'bold'; // Rend le texte plus gras
        authvalid.style.fontSize = '16px'; // Ajuste la taille du texte si nécessaire
    } else {
        authvalid.innerHTML = "login";
        authvalid.href = 'login.html'; // Lien vers la page de connexion
        authvalid.style.fontWeight = 'normal'; // Réinitialise le style du texte
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Empêche le comportement par défaut du formulaire

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const isAuthenticated = await authenticateUser(email, password);

            if (isAuthenticated) {
                // Mise à jour de l'état du lien de connexion après une connexion réussie
                authvalid.innerHTML = "logout";
                authvalid.href = "#"; // Empêche la redirection par défaut
                authvalid.style.fontWeight = 'bold'; // Rend le texte plus gras
                authvalid.style.fontSize = '16px'; // Ajuste la taille du texte si nécessaire
                window.location.href = 'index.html'; // Redirige vers la page d'accueil
            } else {
                errorMessage.style.display = 'block'; // Affiche le message d'erreur
            }
        });
    }

    authvalid.addEventListener('click', () => {
        if (authToken) {
            localStorage.removeItem('authToken'); // Supprime le token d'authentification
            localStorage.removeItem('userRole'); // Supprime le rôle de l'utilisateur (si nécessaire)
            authvalid.innerHTML = "login"; // Réinitialise le lien de connexion
            authvalid.href = 'login.html'; // Redirige vers la page de connexion
            authvalid.style.fontWeight = 'normal'; // Réinitialise le style du texte
        }
    });
});

async function authenticateUser(email, password) {
    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('authToken', data.token); // Stocke le token d'authentification
            localStorage.setItem('userRole', data.role); // Stocke le rôle de l'utilisateur (si nécessaire)
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Erreur lors de la tentative d\'authentification', error);
        return false;
    }
}
