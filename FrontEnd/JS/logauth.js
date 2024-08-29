document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
  const authValid = document.getElementById("authvalid");
  const authToken = sessionStorage.getItem("authToken");
  const userRole = sessionStorage.getItem("userRole");
  const editionMode = document.getElementById("editionmode");
  const editionWorkContainer = document.querySelectorAll(
    "#editionwork i",
    "#editionwork span"
  );

  if (editionMode) {
    if ((authToken && userRole === "editionMode", "editionAdmin")) {
      editionMode.style.display = "flex";
    }
    if (!authToken && !userRole) {
      editionMode.style.display = "none";
    }
  }

  const errorMessage = document.createElement("p");
  errorMessage.id = "error-message";
  errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe";
  errorMessage.style.display = "none";
  errorMessage.style.color = "red";
  if (loginForm) {
    loginForm.appendChild(errorMessage);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const isAuthenticated = await authenticateUser(email, password);

      if (isAuthenticated) {
        authValid.innerHTML = "logout";
        authValid.href = "#";
        authValid.style.fontSize = "16px";
        window.location.href = "index.html";
      } else {
        errorMessage.style.display = "block";
      }
    });
  }

  authValid.addEventListener("click", () => {
    if (authToken) {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userRole");
      authValid.innerHTML = "login";
      authValid.href = "index.html";
      authValid.style.fontWeight = "normal";
    }
  });
});

async function authenticateUser(email, password) {
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      sessionStorage.setItem("authToken", data.token);
      sessionStorage.setItem("userRole", data.role);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erreur dans l’identifiant ou le mot de passe", error);
    return false;
  }
}
