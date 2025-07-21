document.addEventListener("DOMContentLoaded", function () {
  const formulaire = document.getElementById("foin-form");
  const liste = document.getElementById("liste-achats");
  const resetBtn = document.getElementById("reset-historique");

  let achats = JSON.parse(localStorage.getItem("achatsFoin")) || [];

  function afficherHistorique() {
    liste.innerHTML = "";

    achats.forEach((achat, index) => {
      const li = document.createElement("li");

      li.textContent = `📅 Achat le ${achat.date} – quantité : ${achat.quantite} – durée : ${achat.duree} jours → Prochain achat estimé : ${achat.prochaineDate}`;

      const corrigerBtn = document.createElement("button");
      corrigerBtn.textContent = "Corriger la durée";
      corrigerBtn.style.marginLeft = "10px";
      corrigerBtn.addEventListener("click", () => {
        const nouvelleDuree = prompt("Combien de jours le foin a-t-il duré ?");
        if (nouvelleDuree) {
          achat.duree = parseInt(nouvelleDuree);
          const nouvelleDate = new Date(achat.date);
          nouvelleDate.setDate(nouvelleDate.getDate() + achat.duree);
          achat.prochaineDate = nouvelleDate.toISOString().split("T")[0];
          localStorage.setItem("achatsFoin", JSON.stringify(achats));
          afficherHistorique();
        }
      });

      li.appendChild(corrigerBtn);
      liste.appendChild(li);
    });
  }

  formulaire.addEventListener("submit", function (e) {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const quantite = parseInt(document.getElementById("quantite").value);
    const duree = parseInt(document.getElementById("duree").value);

    const dateObjet = new Date(date);
    dateObjet.setDate(dateObjet.getDate() + duree);
    const prochaineDate = dateObjet.toISOString().split("T")[0];

    const nouvelAchat = {
      date,
      quantite,
      duree,
      prochaineDate,
    };

    achats.push(nouvelAchat);
    localStorage.setItem("achatsFoin", JSON.stringify(achats));
    afficherHistorique();
    formulaire.reset();
  });

  resetBtn.addEventListener("click", () => {
    if (confirm("Supprimer tout l’historique ?")) {
      localStorage.removeItem("achatsFoin");
      achats = [];
      afficherHistorique();
    }
  });

  afficherHistorique();
});
