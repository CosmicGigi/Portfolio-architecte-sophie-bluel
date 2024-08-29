document.addEventListener("DOMContentLoaded", () => {
  const isAdmin = checkIfUserIsAdmin();

  if (isAdmin) {
    document.getElementById("openModalBtn").style.display = "block";
  }
});

function checkIfUserIsAdmin() {
  return true;
}
