// Sélection des éléments du formulaire
const formulaire = document.getElementById("foin-form");
const typeSelect = document.getElementById("type");
const dateInput = document.getElementById("date");
const quantiteInput = document.getElementById("quantite");
const dureeInput = document.getElementById("duree");
const listeEvenements = document.getElementById("liste-evenements");
const resetBtn = document.getElementById("reset-historique");

const formContact = document.getElementById("form-contact");
const nomContact = document.getElementById("nom-contact");
const telContact = document.getElementById("tel-contact");
const listeContacts = document.getElementById("liste-contacts");

// Met à jour la durée automatiquement selon le type et la quantité
function mettreAJourDuree() {
  const type = typeSelect.value;
  const quantite = parseInt(quantiteInput.value) || 0;

  if (type === "foin") {
    dureeInput.value = quantite * 13;
  } else if (type === "vermifuge") {
    dureeInput.value = 75;
  } else if (type === "marechal") {
    dureeInput.value = 49;
  } else {
    dureeInput.value = "";
  }
}

quantiteInput.addEventListener("input", mettreAJourDuree);
quantiteInput.addEventListener("change", mettreAJourDuree);
typeSelect.addEventListener("change", mettreAJourDuree);

// Enregistre un événement dans le localStorage
function enregistrerEvenement(evenement) {
  const evenements = JSON.parse(localStorage.getItem("evenements")) || [];
  evenements.push(evenement);
  localStorage.setItem("evenements", JSON.stringify(evenements));
}

// Affiche un événement dans la liste
function afficherEvenement(evenement) {
  const li = document.createElement("li");
  const pastille = document.createElement("div");
  pastille.classList.add("pastille", evenement.type);

  const texte = document.createElement("div");
  texte.classList.add("texte-evenement");
  texte.innerHTML = `
    <strong>Type :</strong> ${evenement.type}<br>
    <strong>Date :</strong> ${evenement.date}<br>
    <strong>Quantité :</strong> ${evenement.quantite}<br>
    <strong>Durée estimée :</strong> ${evenement.duree} jours<br>
    <strong>Date prévue :</strong> ${evenement.datePrevue}
  `;

  li.appendChild(pastille);
  li.appendChild(texte);
  listeEvenements.appendChild(li);
}

// Gère la soumission du formulaire
formulaire.addEventListener("submit", function (e) {
  e.preventDefault();

  const type = typeSelect.value;
  const date = dateInput.value;
  const quantite = parseInt(quantiteInput.value) || 0;
  const duree = parseInt(dureeInput.value);

  const dateObj = new Date(date);
  dateObj.setDate(dateObj.getDate() + duree);
  const datePrevue = dateObj.toISOString().split("T")[0];

  const evenement = {
    type,
    date,
    quantite,
    duree,
    datePrevue,
  };

  enregistrerEvenement(evenement);
  afficherEvenement(evenement);
  formulaire.reset();
});

// Recharge les événements au chargement de la page
window.addEventListener("load", () => {
  const evenements = JSON.parse(localStorage.getItem("evenements")) || [];
  evenements.forEach(afficherEvenement);

  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contacts.forEach(afficherContact);
});

// Efface l'historique
resetBtn.addEventListener("click", () => {
  localStorage.removeItem("evenements");
  listeEvenements.innerHTML = "";
});

// Gère l'ajout de contacts
formContact.addEventListener("submit", (e) => {
  e.preventDefault();

  const nom = nomContact.value.trim();
  const tel = telContact.value.trim();
  if (!nom || !tel) return;

  const contact = { nom, tel };
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contacts.push(contact);
  localStorage.setItem("contacts", JSON.stringify(contacts));

  afficherContact(contact);
  formContact.reset();
});

// Affiche un contact dans la liste
function afficherContact(contact) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span><strong>${contact.nom} :</strong> ${contact.tel}</span>
    <button onclick="supprimerContact(this, '${contact.nom}')">Supprimer</button>
  `;
  listeContacts.appendChild(li);
}

// Supprime un contact du localStorage et de la liste
function supprimerContact(button, nom) {
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contacts = contacts.filter((c) => c.nom !== nom);
  localStorage.setItem("contacts", JSON.stringify(contacts));
  button.parentElement.remove();
}
