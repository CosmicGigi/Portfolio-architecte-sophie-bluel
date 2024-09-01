async function fetchWorks() {
  try {
    const resp = await fetch("http://localhost:5678/api/works");
    return resp.json();
  } catch (error) {
    console.log("Erreur lors du chargement", error);
    return [];
  }
}

async function fetchCategories() {
  try {
    const resp = await fetch("http://localhost:5678/api/categories");
    return resp.json();
  } catch (error) {
    console.log("Erreur lors du chargement", error);
    return [];
  }
}

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
