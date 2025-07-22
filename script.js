// Récupération des éléments du DOM
const formulaire = document.getElementById("foin-form");
const liste = document.getElementById("liste-evenements");
const resetBtn = document.getElementById("reset-historique");
const selectType = document.getElementById("type");
const quantiteInput = document.getElementById("quantite");
const dureeInput = document.getElementById("duree");

// Récupération des éléments du carnet d'adresses
const formContact = document.getElementById("form-contact");
const listeContacts = document.getElementById("liste-contacts");

// Durées par défaut en jours selon le type
const dureesParType = {
  "foin": 13,
  "vermifuge": 75,
  "marechal": 49,
  "veterinaire": 0
};

// Charger les données depuis localStorage au chargement
window.onload = () => {
  const evenements = JSON.parse(localStorage.getItem("evenements")) || [];
  evenements.forEach(afficherEvenement);

  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contacts.forEach(afficherContact);
};

// Met à jour automatiquement la durée estimée selon type + quantité
quantiteInput.addEventListener("input", () => {
  const type = selectType.value;
  const quantite = parseInt(quantiteInput.value);
  if (!isNaN(quantite) && dureesParType[type]) {
    dureeInput.value = quantite * dureesParType[type];
  } else {
    dureeInput.value = "";
  }
});

// Gestion du formulaire d'événement
formulaire.addEventListener("submit", (e) => {
  e.preventDefault();

  const type = selectType.value;
  const date = document.getElementById("date").value;
  const quantite = quantiteInput.value;
  const duree = dureeInput.value;

  const dateRachat = new Date(date);
  dateRachat.setDate(dateRachat.getDate() + Number(duree));
  const datePrevue = dateRachat.toISOString().split("T")[0];

  const evenement = {
    type,
    date,
    quantite,
    duree,
    datePrevue
  };

  afficherEvenement(evenement);
  enregistrerEvenement(evenement);
  formulaire.reset();
});

function afficherEvenement(e) {
  const li = document.createElement("li");

  const pastille = document.createElement("div");
  pastille.className = `pastille ${e.type}`;

  const texte = document.createElement("div");
  texte.className = "texte-evenement";
  texte.innerHTML = `
    <strong>${e.type.charAt(0).toUpperCase() + e.type.slice(1)}</strong>
    Date : ${e.date}<br>
    Quantité : ${e.quantite}<br>
    Durée estimée : ${e.duree} jours<br>
    Date prévue : ${e.datePrevue}
  `;

  li.appendChild(pastille);
  li.appendChild(texte);
  liste.appendChild(li);
}

function enregistrerEvenement(e) {
  const evenements = JSON.parse(localStorage.getItem("evenements")) || [];
  evenements.push(e);
  localStorage.setItem("evenements", JSON.stringify(evenements));
}

resetBtn.addEventListener("click", () => {
  localStorage.removeItem("evenements");
  liste.innerHTML = "";
});

// Gestion du carnet d'adresses
formContact.addEventListener("submit", (e) => {
  e.preventDefault();
  const nom = document.getElementById("nom-contact").value;
  const tel = document.getElementById("tel-contact").value;

  const contact = { nom, tel };
  afficherContact(contact);
  enregistrerContact(contact);
  formContact.reset();
});

function afficherContact(contact) {
  const li = document.createElement("li");
  li.innerHTML = `
    ${contact.nom} : ${contact.tel}
    <button onclick="supprimerContact(this, '${contact.nom}')">Supprimer</button>
  `;
  listeContacts.appendChild(li);
}

function enregistrerContact(contact) {
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contacts.push(contact);
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function supprimerContact(button, nom) {
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contacts = contacts.filter(c => c.nom !== nom);
  localStorage.setItem("contacts", JSON.stringify(contacts));
  button.parentElement.remove();
}
