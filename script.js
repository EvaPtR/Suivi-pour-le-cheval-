// Fonction pour charger les événements depuis le localStorage
function chargerEvenements() {
  const evenements = JSON.parse(localStorage.getItem("evenements")) || [];
  const liste = document.getElementById("liste-evenements");
  liste.innerHTML = "";

  evenements.forEach(evenement => {
    const li = document.createElement("li");

    // Pastille de couleur
    const pastille = document.createElement("div");
    pastille.className = `pastille ${evenement.type}`;

    // Contenu texte de l’événement
    const texte = document.createElement("div");
    texte.className = "texte-evenement";
    texte.innerHTML = `
      <strong>${evenement.type}</strong>
      le ${evenement.date} (${evenement.quantite || "n/a"}) → Prochaine : ${evenement.prochaineDate}
    `;

    li.appendChild(pastille);
    li.appendChild(texte);
    liste.appendChild(li);
  });
}

// Fonction pour sauvegarder un événement dans le localStorage
function enregistrerEvenement(event) {
  event.preventDefault();

  const type = document.getElementById("type-evenement").value;
  const date = document.getElementById("date").value;
  const quantite = document.getElementById("quantite").value;

  if (!type || !date) return;

  let dureeEstimee = 0;

  // Calcul de la durée estimée automatique selon le type et la quantité
  switch (type) {
    case "foin":
      dureeEstimee = parseFloat(quantite) * 13;
      break;
    case "vermifuge":
      dureeEstimee = 75; // 2,5 mois
      break;
    case "marechal":
      dureeEstimee = 49; // 7 semaines
      break;
    case "veterinaire":
      dureeEstimee = 180; // valeur indicative
      break;
  }

  // Calcul de la date de renouvellement
  const prochaineDate = new Date(date);
  prochaineDate.setDate(prochaineDate.getDate() + dureeEstimee);
  const prochaineDateStr = prochaineDate.toISOString().split("T")[0];

  const nouvelEvenement = {
    type,
    date,
    quantite,
    prochaineDate: prochaineDateStr
  };

  const evenements = JSON.parse(localStorage.getItem("evenements")) || [];
  evenements.push(nouvelEvenement);
  localStorage.setItem("evenements", JSON.stringify(evenements));

  chargerEvenements();
  document.getElementById("form-evenement").reset();
}

// Réinitialisation de l’historique
function resetHistorique() {
  localStorage.removeItem("evenements");
  chargerEvenements();
}

// Gestion des contacts
function ajouterContact(event) {
  event.preventDefault();

  const nom = document.getElementById("nom-contact").value;
  const tel = document.getElementById("tel-contact").value;
  const role = document.getElementById("role-contact").value;

  if (!nom || !tel) return;

  const nouveauContact = { nom, tel, role };

  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contacts.push(nouveauContact);
  localStorage.setItem("contacts", JSON.stringify(contacts));

  chargerContacts();
  document.getElementById("form-contact").reset();
}

// Afficher les contacts
function chargerContacts() {
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  const liste = document.getElementById("liste-contacts");
  liste.innerHTML = "";

  contacts.forEach((contact, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${contact.nom} (${contact.role}) : ${contact.tel}
      <button onclick="supprimerContact(${index})">Supprimer</button>
    `;
    liste.appendChild(li);
  });
}

// Supprimer un contact par son index
function supprimerContact(index) {
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contacts.splice(index, 1);
  localStorage.setItem("contacts", JSON.stringify(contacts));
  chargerContacts();
}

// Initialisation
document.getElementById("form-evenement").addEventListener("submit", enregistrerEvenement);
document.getElementById("form-contact").addEventListener("submit", ajouterContact);
document.getElementById("reset").addEventListener("click", resetHistorique);

chargerEvenements();
chargerContacts();
