let numeroJournee = 1;


/* ================================
   PARAMÈTRES
================================ */

function obtenirParametresPourJournee(numero) {

    const dateDepart =
        document.getElementById("dateDepart")?.value;

    if (!dateDepart) {
        return null;
    }

    const date = new Date(
        dateDepart + "T00:00:00"
    );

    date.setDate(
        date.getDate() + numero - 1
    );

    const annee =
        String(date.getFullYear());

    const parametres =
        donneesParametres[annee];

    if (!parametres) {

        console.error(
            "Les paramètres pour l'année " +
            annee +
            " sont introuvables."
        );

        return null;
    }

    return parametres;
}


/* ================================
   AFFICHAGE DES MONTANTS
================================ */

function afficherMontant(montant) {
    return montant
	.toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
	.replace(".", ",") + " $";
}


/* ================================
   OUTIL : HEURE
================================ */

function heureEnMinutes(heure) {
    const [heures, minutes] = heure.split(":").map(Number);
    return heures * 60 + minutes;
}


/* ================================
   REPAS ADMISSIBLES
================================ */

function verifierRepas(numero) {

    const heureDepart = document.getElementById("heureDepart").value;
    const heureRetour = document.getElementById("heureRetour").value;

    if (!heureDepart || !heureRetour) {
        return;
    }

    const dateDepart = document.getElementById("dateDepart").value;
    const dateRetour = document.getElementById("dateRetour").value;

    if (!dateDepart || !dateRetour) {
        return;
    }

    const debut = new Date(dateDepart + "T00:00:00");
    const fin = new Date(dateRetour + "T00:00:00");

    const nombreJournees =
        Math.round((fin - debut) / (1000 * 60 * 60 * 24)) + 1;


    /* ================================
       DÉTERMINER LE TYPE DE JOURNÉE
    ================================ */

    const estPremiereJournee = numero === 1;
    const estDerniereJournee = numero === nombreJournees;
    const estJourneeUnique = nombreJournees === 1;


    let dejeunerAdmissible = false;
    let dinerAdmissible = false;
    let souperAdmissible = false;
    let collationAdmissible = false;


    /* ================================
       VOYAGE D'UNE SEULE JOURNÉE
    ================================ */

    if (estJourneeUnique) {

        const depart = heureEnMinutes(heureDepart);
        const retour = heureEnMinutes(heureRetour);

        dejeunerAdmissible =
            depart <= heureEnMinutes("07:30") &&
            retour > heureEnMinutes("09:00");

        dinerAdmissible =
            depart <= heureEnMinutes("12:00") &&
            retour > heureEnMinutes("12:30");

        souperAdmissible =
            depart <= heureEnMinutes("18:00") &&
            retour > heureEnMinutes("18:30");

        collationAdmissible =
            depart <= heureEnMinutes("22:00") &&
            retour > heureEnMinutes("22:00");
    }


    /* ================================
       PREMIÈRE JOURNÉE
    ================================ */

    else if (estPremiereJournee) {

        const depart = heureEnMinutes(heureDepart);

        dejeunerAdmissible =
            depart < heureEnMinutes("07:30");

        dinerAdmissible =
            depart < heureEnMinutes("12:00");

        souperAdmissible =
            depart < heureEnMinutes("18:00");

        collationAdmissible =
            depart < heureEnMinutes("22:00");
    }


    /* ================================
       JOURNÉE INTERMÉDIAIRE
    ================================ */

    else if (!estDerniereJournee) {

        dejeunerAdmissible = true;
        dinerAdmissible = true;
        souperAdmissible = true;
        collationAdmissible = true;
    }


    /* ================================
       DERNIÈRE JOURNÉE
    ================================ */

    else {

        const retour = heureEnMinutes(heureRetour);

        dejeunerAdmissible =
            retour > heureEnMinutes("09:00");

        dinerAdmissible =
            retour > heureEnMinutes("12:30");

        souperAdmissible =
            retour > heureEnMinutes("18:30");

        collationAdmissible =
            retour > heureEnMinutes("22:00");
    }


    /* ================================
       APPLICATION AUX CASES
    ================================ */

    const dejeuner = document.getElementById("dejeuner" + numero);
    const diner = document.getElementById("diner" + numero);
    const souper = document.getElementById("souper" + numero);
    const collation = document.getElementById("collation" + numero);


    if (dejeuner) {

        dejeuner.disabled = !dejeunerAdmissible;

        if (!dejeunerAdmissible) {
            dejeuner.checked = false;
        }
    }


    if (diner) {

        diner.disabled = !dinerAdmissible;

        if (!dinerAdmissible) {
            diner.checked = false;
        }
    }


    if (souper) {

        souper.disabled = !souperAdmissible;

        if (!souperAdmissible) {
            souper.checked = false;
        }
    }


    if (collation) {

        collation.disabled = !collationAdmissible;

        if (!collationAdmissible) {
            collation.checked = false;
        }
    }


    calculerTotalRepas(numero);
    calculerTotalJournee(numero);
}


/* ================================
   MONTANTS DES REPAS
================================ */

function afficherMontantsRepas(numero) {

    const parametres =
        obtenirParametresPourJournee(numero);

    if (!parametres) {
        return;
    }


    const dejeuner =
        document.getElementById(
            "dejeuner" + numero
        );

    const diner =
        document.getElementById(
            "diner" + numero
        );

    const souper =
        document.getElementById(
            "souper" + numero
        );

    const collation =
        document.getElementById(
            "collation" + numero
        );


    const montantDejeuner =
        document.getElementById(
            "montantDejeuner" + numero
        );

    const montantDiner =
        document.getElementById(
            "montantDiner" + numero
        );

    const montantSouper =
        document.getElementById(
            "montantSouper" + numero
        );

    const montantCollation =
        document.getElementById(
            "montantCollation" + numero
        );


    if (montantDejeuner) {
        montantDejeuner.textContent =
            afficherMontant(
                parametres.dejeuner
            );
    }

    if (montantDiner) {
        montantDiner.textContent =
            afficherMontant(
                parametres.diner
            );
    }

    if (montantSouper) {
        montantSouper.textContent =
            afficherMontant(
                parametres.souper
            );
    }

    if (montantCollation) {
        montantCollation.textContent =
            afficherMontant(
                parametres.collation
            );
    }
}


/* ================================
   TOTAL REPAS
================================ */

function calculerTotalRepas(numero) {

    const parametres =
        obtenirParametresPourJournee(numero);

    if (!parametres) {
        return;
    }


    const dejeuner =
        document.getElementById(
            "dejeuner" + numero
        )?.checked || false;

    const diner =
        document.getElementById(
            "diner" + numero
        )?.checked || false;

    const souper =
        document.getElementById(
            "souper" + numero
        )?.checked || false;

    const collation =
        document.getElementById(
            "collation" + numero
        )?.checked || false;


    let total = 0;


    if (dejeuner) {
        total += parametres.dejeuner;
    }

    if (diner) {
        total += parametres.diner;
    }

    if (souper) {
        total += parametres.souper;
    }

    if (collation) {
        total += parametres.collation;
    }


    const affichage =
        document.getElementById(
            "totalRepas" + numero
        );


    if (affichage) {
        affichage.textContent =
            afficherMontant(total);
    }
}


/* ================================
   TOTAL KILOMÉTRAGE
================================ */

function calculerKilometrage(numero) {

    const parametres =
        obtenirParametresPourJournee(numero);

    if (!parametres) {
        return;
    }

    const tauxKilometrage =
        parametres.tauxKilometrage;


    const transit = parseFloat(
        document.getElementById(
            "deplacementTransit" + numero
        )?.value
    ) || 0;

    const locaux = parseFloat(
        document.getElementById(
            "deplacementsLocaux" + numero
        )?.value
    ) || 0;


    const totalKm = transit + locaux;

    const montant =
        totalKm * tauxKilometrage;


    const affichage = document.getElementById(
        "totalKilometrage" + numero
    );


    if (affichage) {
        affichage.textContent =
            afficherMontant(montant);
    }
}


/* ================================
   TOTAL AUTRES TRANSPORTS
================================ */

function calculerAutresTransports(numero) {

    const locationCout = parseFloat(
        document.getElementById(
            "locationCout" + numero
        )?.value
    ) || 0;

    const locationEssence = parseFloat(
        document.getElementById(
            "locationEssence" + numero
        )?.value
    ) || 0;

    const transportPublic = parseFloat(
        document.getElementById(
            "transportPublic" + numero
        )?.value
    ) || 0;


    const total =
        locationCout +
        locationEssence +
        transportPublic;


    const affichage = document.getElementById(
        "totalAutresTransports" + numero
    );


    if (affichage) {
        affichage.textContent =
            afficherMontant(total);
    }
}


/* ================================
   TOTAL HÉBERGEMENT
================================ */

function calculerHebergement(numero) {

    const parametres =
        obtenirParametresPourJournee(numero);

    if (!parametres) {
        return;
    }

    const hotel = parseFloat(
        document.getElementById(
            "hotel" + numero
        )?.value
    ) || 0;

    const hotelChoix =
        document.getElementById(
            "hotelChoix" + numero
        )?.checked || false;

    const proches =
        document.getElementById(
            "proches" + numero
        )?.checked || false;


    let total = 0;


    if (hotelChoix) {
        total = hotel;
    } else if (proches) {
        total = parametres.proches;
    }


    const affichage = document.getElementById(
        "totalHebergement" + numero
    );


    if (affichage) {
        affichage.textContent =
            afficherMontant(total);
    }
}


/* ================================
   TOTAL AUTRES DÉPENSES
================================ */

function calculerAutresDepenses(numero) {

    const taxi = parseFloat(
        document.getElementById(
            "taxi" + numero
        )?.value
    ) || 0;

    const stationnement = parseFloat(
        document.getElementById(
            "stationnement" + numero
        )?.value
    ) || 0;

    const divers = parseFloat(
        document.getElementById(
            "divers" + numero
        )?.value
    ) || 0;


    const total =
        taxi +
        stationnement +
        divers;


    const affichage = document.getElementById(
        "totalAutresDepenses" + numero
    );


    if (affichage) {
        affichage.textContent =
            afficherMontant(total);
    }
}

/* ================================
   CONVERSION D'UN MONTANT AFFICHÉ
================================ */

function montantEnNombre(texte) {

    return parseFloat(
        texte
            .replace(/\s/g, "")
            .replace("$", "")
            .replace(",", ".")
    ) || 0;
}

/* ================================
   TOTAL DE LA JOURNÉE
================================ */

function calculerTotalJournee(numero) {

    calculerKilometrage(numero);
    calculerAutresTransports(numero);
    calculerTotalRepas(numero);
    calculerHebergement(numero);
    calculerAutresDepenses(numero);


    const kilometrage = montantEnNombre(
        document.getElementById(
            "totalKilometrage" + numero
        )?.textContent || ""
    );

    const autresTransports = montantEnNombre(
        document.getElementById(
            "totalAutresTransports" + numero
        )?.textContent || ""
    );

    const repas = montantEnNombre(
        document.getElementById(
            "totalRepas" + numero
        )?.textContent || ""
    );

    const hebergement = montantEnNombre(
        document.getElementById(
            "totalHebergement" + numero
        )?.textContent || ""
    );

    const autresDepenses = montantEnNombre(
        document.getElementById(
            "totalAutresDepenses" + numero
        )?.textContent || ""
    );


    const total =
        kilometrage +
        autresTransports +
        repas +
        hebergement +
        autresDepenses;


    /* ================================
       RÉCAPITULATIF DE LA JOURNÉE
    ================================ */

    const recapKilometrage = document.getElementById(
        "recapKilometrage" + numero
    );

    const recapAutresTransports = document.getElementById(
        "recapAutresTransports" + numero
    );

    const recapRepas = document.getElementById(
        "recapRepas" + numero
    );

    const recapHebergement = document.getElementById(
        "recapHebergement" + numero
    );

    const recapAutresDepenses = document.getElementById(
        "recapAutresDepenses" + numero
    );

    const recapTotalJournee = document.getElementById(
        "recapTotalJournee" + numero
    );


    if (recapKilometrage) {
        recapKilometrage.textContent =
            afficherMontant(kilometrage);
    }

    if (recapAutresTransports) {
        recapAutresTransports.textContent =
            afficherMontant(autresTransports);
    }

    if (recapRepas) {
        recapRepas.textContent =
            afficherMontant(repas);
    }

    if (recapHebergement) {
        recapHebergement.textContent =
            afficherMontant(hebergement);
    }

    if (recapAutresDepenses) {
        recapAutresDepenses.textContent =
            afficherMontant(autresDepenses);
    }

    if (recapTotalJournee) {
        recapTotalJournee.textContent =
            afficherMontant(total);
    }


    /* ================================
       TOTAL DU RAPPORT
    ================================ */

    calculerTotalRapport();
}


/* ================================
   TOTAL DU RAPPORT
================================ */

function calculerTotalRapport() {

    let totalKilometrage = 0;
    let totalAutresTransports = 0;
    let totalRepas = 0;
    let totalHebergement = 0;
    let totalAutresDepenses = 0;


    for (
        let i = 1;
        i <= numeroJournee;
        i++
    ) {

        totalKilometrage += montantEnNombre(
            document.getElementById(
                "totalKilometrage" + i
            )?.textContent || ""
        );

        totalAutresTransports += montantEnNombre(
            document.getElementById(
                "totalAutresTransports" + i
            )?.textContent || ""
        );

        totalRepas += montantEnNombre(
            document.getElementById(
                "totalRepas" + i
            )?.textContent || ""
        );

        totalHebergement += montantEnNombre(
            document.getElementById(
                "totalHebergement" + i
            )?.textContent || ""
        );

        totalAutresDepenses += montantEnNombre(
            document.getElementById(
                "totalAutresDepenses" + i
            )?.textContent || ""
        );
    }


    const totalGeneral =
        totalKilometrage +
        totalAutresTransports +
        totalRepas +
        totalHebergement +
        totalAutresDepenses;


    document.getElementById(
        "totalRapportKilometrage"
    ).textContent =
        afficherMontant(totalKilometrage);


    document.getElementById(
        "totalRapportAutresTransports"
    ).textContent =
        afficherMontant(totalAutresTransports);


    document.getElementById(
        "totalRapportRepas"
    ).textContent =
        afficherMontant(totalRepas);


    document.getElementById(
        "totalRapportHebergement"
    ).textContent =
        afficherMontant(totalHebergement);


    document.getElementById(
        "totalRapportAutresDepenses"
    ).textContent =
        afficherMontant(totalAutresDepenses);


    document.getElementById(
        "totalRapportGeneral"
    ).textContent =
        afficherMontant(totalGeneral);
}

/* ================================
   CONFIGURATION D'UNE JOURNÉE
================================ */

function configurerJournee(numero) {

    afficherMontantsRepas(numero);
    verifierRepas(numero);
    calculerTotalJournee(numero);


    const champsCalcul = [
        "deplacementTransit",
        "deplacementsLocaux",
        "locationCout",
        "locationEssence",
        "transportPublic",
        "hotel",
        "taxi",
        "stationnement",
        "divers"
    ];


    champsCalcul.forEach(function(champ) {

        const element = document.getElementById(
            champ + numero
        );


        if (element) {

            element.addEventListener(
                "input",
                function() {
                    calculerTotalJournee(numero);
                }
            );

        }

    });


    const casesRepas = [
        "dejeuner",
        "diner",
        "souper",
        "collation"
    ];


    casesRepas.forEach(function(repas) {

        const element = document.getElementById(
            repas + numero
        );


        if (element) {

            element.addEventListener(
                "change",
                function() {
                    calculerTotalJournee(numero);
                }
            );

        }

    });


    const proches = document.getElementById(
        "proches" + numero
    );


    const hotelChoix = document.getElementById(
        "hotelChoix" + numero
    );

    const hotel = document.getElementById(
        "hotel" + numero
    );


    if (hotelChoix) {

        hotelChoix.addEventListener(
            "change",
            function() {

                if (hotelChoix.checked) {

                    proches.checked = false;
                    hotel.disabled = false;

		    const montantProches = 
			document.querySelector(
			    "#proches" + numero
			).closest("div")
			.querySelector(".montant-proches");
		    montantProches.style.color = "#aaa";

                } else {

                    hotel.disabled = true;
                    hotel.value = "";

                }

                calculerTotalJournee(numero);
            }
        );

    }


    if (proches) {

        proches.addEventListener(
            "change",
            function() {

                const montantProches =
                    document.querySelector(
                        "#proches" + numero
                    ).closest("div")
                    .querySelector(".montant-proches");


                if (proches.checked) {

                    hotelChoix.checked = false;
                    hotel.disabled = true;
                    hotel.value = "";

                    montantProches.style.color = "#354352";

                } else {

                    montantProches.style.color = "#aaa";

                }

                calculerTotalJournee(numero);
            }
        );

    }
    const divers = document.getElementById(
        "divers" + numero
    );

    const justification = document.getElementById(
        "justification" + numero
    );

    if (divers && justification) {

        const labelJustification = document.querySelector(
            'label[for="justification' + numero + '"]'
        );

        function mettreAJourJustification() {

            const montant = parseFloat(divers.value) || 0;

            if (montant > 0) {

                justification.disabled = false;
		justification.required = true;
		
		justification.placeholder =
    		    "Préciser la nature de la dépense inscrite en 'Autres'";

                if (labelJustification) {
                    labelJustification.style.color = "#354352";
		    labelJustification.innerHTML =
			'Justification <span class="obligatoire">*</span>';
                }

            } else {

                justification.disabled = true;
		justification.required = false;
                justification.value = "";
		justification.placeholder = "";

                if (labelJustification) {
                    labelJustification.style.color = "#aaa";
		    labelJustification.textContent = "Justification";
                }

            }
	    verifierChampsObligatoires();

        }

        divers.addEventListener(
            "input",
            mettreAJourJustification
        );

	justification.addEventListener(
	    "input",
	    verifierChampsObligatoires
	);

        mettreAJourJustification();

    }
}


/* ================================
   CRÉATION AUTOMATIQUE DES JOURNÉES
================================ */

function creerJournees() {

    const dateDepart = document.getElementById("dateDepart").value;
    const dateRetour = document.getElementById("dateRetour").value;

    const conteneur = document.getElementById("conteneurJournees");


    if (!dateDepart) {
        conteneur.innerHTML = "";
        numeroJournee = 0;
        return;
    }


    const debut = new Date(dateDepart + "T00:00:00");

    let fin;


    if (dateRetour) {

        fin = new Date(dateRetour + "T00:00:00");


        if (fin < debut) {
            conteneur.innerHTML = "";
            numeroJournee = 0;
            return;
        }

    } else {

        fin = debut;

    }


    const nombreJournees =
        Math.round(
            (fin - debut) /
            (1000 * 60 * 60 * 24)
        ) + 1;


    conteneur.innerHTML = "";
    numeroJournee = nombreJournees;


    for (let i = 0; i < nombreJournees; i++) {

        const dateJournee = new Date(debut);

        dateJournee.setDate(
            debut.getDate() + i
        );

const anneeJournee =
    String(dateJournee.getFullYear());

const parametresJournee =
    donneesParametres[anneeJournee];

if (!parametresJournee) {

    console.error(
        "Les paramètres pour l'année " +
        anneeJournee +
        " sont introuvables."
    );

    alert(
        "Les paramètres pour l'année " +
        anneeJournee +
        " sont introuvables."
    );

    return;
}


        const dateFormatee =
            dateJournee.getFullYear() +
            "-" +
            String(
                dateJournee.getMonth() + 1
            ).padStart(2, "0") +
            "-" +
            String(
                dateJournee.getDate()
            ).padStart(2, "0");


        const section =
            document.createElement("section");


        const dateAffichee =
            dateJournee.toLocaleDateString(
                "fr-CA",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        section.innerHTML = `

    <h2>Jour ${i + 1} — ${dateAffichee}</h2>

            <h3>Transports</h3>

            <div class="sous-section">

                <h4>Villes</h4>

                <div>
                    <label for="villeDepart${i + 1}">
                        Ville de départ
                    </label>

                    <input
                        type="text"
                        id="villeDepart${i + 1}"
                        name="villeDepart${i + 1}"
                        placeholder="Inscrire la ville de départ"
                    >
                </div>

                <div>
                    <label for="villeArrivee${i + 1}">
                        Ville d'arrivée
                    </label>

                    <input
                        type="text"
                        id="villeArrivee${i + 1}"
                        name="villeArrivee${i + 1}"
                        placeholder="Inscrire la ville d'arrivée"
                    >
                </div>

            </div>

            <div class="sous-section">

                <h4>Kilométrage</h4>

                <div>
                    <label for="deplacementTransit${i + 1}">
                        Déplacement (transit)
                    </label>

                    <input
                        type="number"
                        id="deplacementTransit${i + 1}"
                        name="deplacementTransit${i + 1}"
                        min="0"
                        step="0.01"
                        placeholder="Inscrire le nombre de kilomètres"
                    >
                </div>

                <div>
                    <label for="deplacementsLocaux${i + 1}">
                        Déplacements locaux
                    </label>

                    <input
                        type="number"
                        id="deplacementsLocaux${i + 1}"
                        name="deplacementsLocaux${i + 1}"
                        min="0"
                        step="0.01"
                        placeholder="Inscrire le nombre de kilomètres"
                    >
                </div>

                <div class="total-sous-section">
                    <strong>Total kilométrage :</strong>
                    <span id="totalKilometrage${i + 1}">
                        0,00 $
                    </span>
                </div>

            </div>

            <div class="sous-section">

                <h4>Location et autres transports</h4>

                <div>
                    <label for="locationCout${i + 1}">
                        Location — coût
                    </label>

                    <input
                        type="number"
                        id="locationCout${i + 1}"
                        name="locationCout${i + 1}"
                        min="0"
                        step="0.01"
                        placeholder="Inscrire le montant"
                    >
                </div>

                <div>
                    <label for="locationEssence${i + 1}">
                        Location — essence
                    </label>

                    <input
                        type="number"
                        id="locationEssence${i + 1}"
                        name="locationEssence${i + 1}"
                        min="0"
                        step="0.01"
                        placeholder="Inscrire le montant"
                    >
                </div>

                <div>
                    <label for="transportPublic${i + 1}">
                        Transport public
                    </label>

                    <input
                        type="number"
                        id="transportPublic${i + 1}"
                        name="transportPublic${i + 1}"
                        min="0"
                        step="0.01"
                        placeholder="Inscrire le montant"
                    >
                </div>

                <div class="total-sous-section">
                    <strong>Total autres transports :</strong>
                    <span id="totalAutresTransports${i + 1}">
                        0,00 $
                    </span>
                </div>

            </div>

            <h3>Frais de séjour</h3>

            <div class="sous-section">

                <h4>Repas</h4>

                <div class="repas-options">

                    <div>
                        <label for="dejeuner${i + 1}">
                            Déjeuner
                        </label>
                        <span id="montantDejeuner${i + 1}"></span>
                        <input
                            type="checkbox"
                            id="dejeuner${i + 1}"
                            name="dejeuner${i + 1}"
                            disabled
                        >
                    </div>

                    <div>
                        <label for="diner${i + 1}">
                            Dîner
                        </label>
                        <span id="montantDiner${i + 1}"></span>
                        <input
                            type="checkbox"
                            id="diner${i + 1}"
                            name="diner${i + 1}"
                            disabled
                        >
                    </div>

                    <div>
                        <label for="souper${i + 1}">
                            Souper
                        </label>
                        <span id="montantSouper${i + 1}"></span>
                        <input
                            type="checkbox"
                            id="souper${i + 1}"
                            name="souper${i + 1}"
                            disabled
                        >
                    </div>

                    <div>
                        <label for="collation${i + 1}">
                            Collation
                        </label>
                        <span id="montantCollation${i + 1}"></span>
                        <input
                            type="checkbox"
                            id="collation${i + 1}"
                            name="collation${i + 1}"
                            disabled
                        >
                    </div>

                </div>

                <div class="total-sous-section">
                    <strong>Total repas :</strong>
                    <span id="totalRepas${i + 1}">
                        0,00 $
                    </span>
                </div>

            </div>

            <div class="sous-section">

                <h4>Hébergement</h4>

                <div class="hebergement-options">

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                id="hotelChoix${i + 1}"
                                name="hotelChoix${i + 1}"
                            >
                            Hôtel
                        </label>

                        <input
                            type="number"
                            id="hotel${i + 1}"
                            name="hotel${i + 1}"
                            min="0"
                            step="0.01"
                            placeholder="Inscrire le montant"
                            disabled
                        >
                    </div>

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                id="proches${i + 1}"
                                name="proches${i + 1}"
                            >
                            Chez des proches
                        </label>

			<span class="montant-proches">
			    ${afficherMontant(parametresJournee.proches)}
			</span>
                    </div>

                </div>

                <div class="total-sous-section">
                    <strong>Total hébergement :</strong>
                    <span id="totalHebergement${i + 1}">
                        0,00 $
                    </span>
                </div>

            </div>

            <div class="sous-section">

                <h4>Frais divers</h4>

                <div>
                    <label for="taxi${i + 1}">
                        Taxi
                    </label>

                    <input
                        type="number"
                        id="taxi${i + 1}"
                        name="taxi${i + 1}"
                        min="0"
                        step="0.01"
                        placeholder="Inscrire le montant"
                    >
                </div>

                <div>
                    <label for="stationnement${i + 1}">
                        Stationnement
                    </label>

                    <input
                        type="number"
                        id="stationnement${i + 1}"
                        name="stationnement${i + 1}"
                        min="0"
                        step="0.01"
                        placeholder="Inscrire le montant"
                    >
                </div>

                <div>
                    <label for="divers${i + 1}">
                        Autres
                    </label>

                    <input
                        type="number"
                        id="divers${i + 1}"
                        name="divers${i + 1}"
                        min="0"
                        step="0.01"
                        placeholder="Inscrire le montant"
                    >
                </div>

                <div>
                    <label for="justification${i + 1}">
                        Justification
                    </label>

                    <textarea
                        id="justification${i + 1}"
                        name="justification${i + 1}"
                        rows="3"
                        placeholder="Préciser la nature de la dépense inscrite en 'Autres'"
			disabled
                    ></textarea>
                </div>

                <div class="total-sous-section">
                    <strong>Total frais divers :</strong>
                    <span id="totalAutresDepenses${i + 1}">
                        0,00 $
                    </span>
                </div>

            </div>

        `;


        conteneur.appendChild(section);

        configurerJournee(i + 1);
    }
}


/* ================================
   SÉLECTEURS DE DATE
================================ */

flatpickr.l10ns.fr.firstDayOfWeek = 0;


flatpickr("#dateDepart", {

    locale: "fr",

    dateFormat: "Y-m-d",

    altInput: true,

    altFormat: "j F Y",

    allowInput: false,


    onReady: function(
        selectedDates,
        dateStr,
        instance
    ) {

        const bouton =
            document.createElement("button");


        bouton.type = "button";

        bouton.textContent = "Aujourd'hui";


        bouton.style.width = "100%";

        bouton.style.marginTop = "8px";

        bouton.style.padding = "8px";

        bouton.style.border = "1px solid #ccc";

        bouton.style.borderRadius = "4px";

        bouton.style.backgroundColor = "#f5f5f5";

        bouton.style.cursor = "pointer";


        bouton.addEventListener(
            "click",
            function() {

                instance.setDate(
                    new Date(),
                    true
                );

                instance.close();

            }
        );


        instance.calendarContainer
            .appendChild(bouton);
    }
});


flatpickr("#dateRetour", {

    locale: "fr",

    dateFormat: "Y-m-d",

    altInput: true,

    altFormat: "j F Y",

    allowInput: false,


    onReady: function(
        selectedDates,
        dateStr,
        instance
    ) {

        const bouton =
            document.createElement("button");


        bouton.type = "button";

        bouton.textContent = "Aujourd'hui";


        bouton.style.width = "100%";

        bouton.style.marginTop = "8px";

        bouton.style.padding = "8px";

        bouton.style.border = "1px solid #ccc";

        bouton.style.borderRadius = "4px";

        bouton.style.backgroundColor = "#f5f5f5";

        bouton.style.cursor = "pointer";


        bouton.addEventListener(
            "click",
            function() {

                instance.setDate(
                    new Date(),
                    true
                );

                instance.close();

            }
        );


        instance.calendarContainer
            .appendChild(bouton);
    }
});


/* ================================
   DATES DE DÉPART ET DE RETOUR
================================ */

document.getElementById("dateDepart")
    .addEventListener(
        "input",
        function() {

            const valeur = this.value;

            const affichage =
                document.getElementById(
                    "dateDepartAffichee"
                );


            if (!affichage) {
                return;
            }


            if (!valeur) {
                affichage.textContent = "";
                return;
            }


            const date =
                new Date(
                    valeur + "T00:00:00"
                );


            affichage.textContent =
                date.toLocaleDateString(
                    "fr-CA",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );
        }
    );


document.getElementById("dateDepart")
    .addEventListener(
        "change",
        function() {

            creerJournees();

	    const pieces =
		document.getElementById(
		    "piecesJustificatives"
		);
	    if (pieces) {
		pieces.disabled = !this.value;
	    }

            verifierChampsObligatoires();

        }
    );


document.getElementById("dateRetour")
    .addEventListener(
        "change",
        function() {

            creerJournees();
            verifierChampsObligatoires();

        }
    );


/* ================================
   HEURE DE DÉPART
================================ */

document.getElementById("heureDepart")
    .addEventListener(
        "change",
        function() {

            for (
                let i = 1;
                i <= numeroJournee;
                i++
            ) {

                verifierRepas(i);

            }
            verifierChampsObligatoires();

        }
    );


/* ================================
   HEURE DE RETOUR
================================ */

document.getElementById("heureRetour")
    .addEventListener(
        "change",
        function() {

            for (
                let i = 1;
                i <= numeroJournee;
                i++
            ) {

                verifierRepas(i);

            }
            verifierChampsObligatoires();

        }
    );


/* ================================
   INITIALISATION
================================ */

creerJournees();

/* ================================
   PIÈCES JUSTIFICATIVES
================================ */

document.getElementById("piecesJustificatives")
    .addEventListener(
        "change",
        function() {

            const liste =
                document.getElementById(
                    "listePiecesJustificatives"
                );

            const entete =
                document.getElementById(
                    "entetePiecesJustificatives"
                );


            /* CONSERVER LES FICHIERS DÉJÀ PRÉSENTS */

            const fichiersExistants =
                Array.from(this.files);


            /* RÉCUPÉRER LES NOUVEAUX FICHIERS */

            const nouveauxFichiers =
                Array.from(this.files);


            /*
                Les fichiers actuellement présents dans
                l'input sont déjà ceux de la dernière sélection.
                
                Pour permettre l'ajout progressif, on conserve
                les fichiers déjà affichés dans la liste.
            */

            const fichiersActuels =
                Array.from(
                    liste.querySelectorAll(
                        ".nom-piece"
                    )
                );


            /*
                Si des fichiers étaient déjà affichés,
                récupérer leurs objets File à partir
                de la liste interne.
            */

            let tousLesFichiers = [];


            if (
                this._fichiersSelectionnes &&
                this._fichiersSelectionnes.length > 0
            ) {

                tousLesFichiers =
                    this._fichiersSelectionnes.slice();

            }


            /*
                Ajouter les nouveaux fichiers
                sans vider les fichiers précédents.
            */

            nouveauxFichiers.forEach(
                function(fichier) {

                    const dejaPresent =
                        tousLesFichiers.some(
                            function(fichierExistant) {

                                return (
                                    fichierExistant.name === fichier.name &&
                                    fichierExistant.size === fichier.size &&
                                    fichierExistant.lastModified === fichier.lastModified
                                );

                            }
                        );


                    if (!dejaPresent) {

                        tousLesFichiers.push(
                            fichier
                        );

                    }

                }
            );


            /*
                MÉMORISER LES FICHIERS
            */

            this._fichiersSelectionnes =
                tousLesFichiers;


            /*
                RECONSTRUIRE LE CHAMP DE FICHIERS
                AVEC TOUS LES FICHIERS
            */

            const transfert =
                new DataTransfer();


            tousLesFichiers.forEach(
                function(fichier) {

                    transfert.items.add(
                        fichier
                    );

                }
            );


            this.files =
                transfert.files;


            /*
                AFFICHER L'EN-TÊTE
            */

            if (entete) {

                entete.style.display =
                    tousLesFichiers.length > 0
                        ? "grid"
                        : "none";

            }


            /* DATE DE DÉPART DU RAPPORT */

            const dateDepart =
                document.getElementById(
                    "dateDepart"
                )?.value;


            /* NOMBRE DE JOURNÉES */

            const dateRetour =
                document.getElementById(
                    "dateRetour"
                )?.value;


            let nombreJournees = 1;


            if (
                dateDepart &&
                dateRetour
            ) {

                const debut =
                    new Date(
                        dateDepart +
                        "T00:00:00"
                    );


                const fin =
                    new Date(
                        dateRetour +
                        "T00:00:00"
                    );


                nombreJournees =
                    Math.round(
                        (fin - debut) /
                        (1000 * 60 * 60 * 24)
                    ) + 1;

            }


            /*
                AJOUTER UNIQUEMENT LES NOUVEAUX FICHIERS
            */

            nouveauxFichiers.forEach(
                function(fichierActuel) {

                    const dejaAffiche =
                        Array.from(
                            liste.querySelectorAll(
                                ".nom-piece"
                            )
                        ).some(
                            function(element) {

                                return (
                                    element.textContent ===
                                    fichierActuel.name
                                );

                            }
                        );


                    if (dejaAffiche) {

                        return;

                    }


                    /* CRÉER UNE LIGNE */

                    const fichier =
                        document.createElement(
                            "div"
                        );

                    fichier.className =
                        "piece-justificative";


                    /* NOM DU FICHIER */

                    const nomFichier =
                        document.createElement(
                            "span"
                        );

                    nomFichier.className =
                        "nom-piece";

                    nomFichier.textContent =
                        fichierActuel.name;


                    /* CATÉGORIE */

                    const selectCategorie =
                        document.createElement(
                            "select"
                        );

                    selectCategorie.className =
                        "categorie-piece";

                    selectCategorie.required =
                        true;


                    const optionDefaut =
                        document.createElement(
                            "option"
                        );

                    optionDefaut.value = "";

                    optionDefaut.textContent =
                        "Choisir une catégorie";

                    optionDefaut.disabled =
                        true;

                    optionDefaut.selected =
                        true;


                    selectCategorie.appendChild(
                        optionDefaut
                    );


                    const categories = [
                        "Hébergement",
                        "Stationnement",
                        "Transport collectif",
                        "Taxi",
                        "Location de véhicule",
                        "Essence pour véhicule loué",
                        "Autres dépenses"
                    ];


                    categories.forEach(
                        function(categorie) {

                            const option =
                                document.createElement(
                                    "option"
                                );

                            option.value =
                                categorie;

                            option.textContent =
                                categorie;

                            selectCategorie.appendChild(
                                option
                            );

                        }
                    );


                    /* JOURNÉE */

                    const selectJournee =
                        document.createElement(
                            "select"
                        );

                    selectJournee.className =
                        "journee-piece";


                    const optionAucune =
                        document.createElement(
                            "option"
                        );

                    optionAucune.value = "";

                    optionAucune.textContent =
                        "Aucune journée";


                    selectJournee.appendChild(
                        optionAucune
                    );


                    /* CRÉER LES OPTIONS DE JOURNÉES */

                    if (dateDepart) {

                        const debut =
                            new Date(
                                dateDepart +
                                "T00:00:00"
                            );


                        for (
                            let j = 1;
                            j <= nombreJournees;
                            j++
                        ) {

                            const dateJournee =
                                new Date(debut);


                            dateJournee.setDate(
                                debut.getDate() +
                                j -
                                1
                            );


                            const option =
                                document.createElement(
                                    "option"
                                );


                            option.value =
                                String(j);


                            option.textContent =
                                "Jour " +
                                j +
                                " — " +
                                dateJournee.toLocaleDateString(
                                    "fr-CA",
                                    {
                                        day: "numeric",
                                        month: "long"
                                    }
                                );


                            selectJournee.appendChild(
                                option
                            );

                        }

                    }


                    /* BOUTON SUPPRIMER */

const boutonSupprimer =
    document.createElement(
        "button"
    );

boutonSupprimer.type =
    "button";

boutonSupprimer.className =
    "bouton-supprimer-piece";

boutonSupprimer.textContent =
    "🗑️";

boutonSupprimer.title =
    "Supprimer cette pièce";


boutonSupprimer.addEventListener(
    "click",
    function() {

        /*
            Retirer le fichier de la liste
            interne des fichiers sélectionnés.
        */

        tousLesFichiers =
            tousLesFichiers.filter(
                function(fichierExistant) {

                    return fichierExistant !==
                        fichierActuel;

                }
            );


        /*
            Mettre à jour la liste mémorisée.
        */

        document.getElementById(
            "piecesJustificatives"
        )._fichiersSelectionnes =
            tousLesFichiers;


        /*
            Reconstruire la sélection réelle
            du champ de fichiers.
        */

        const nouveauTransfert =
            new DataTransfer();


        tousLesFichiers.forEach(
            function(fichierExistant) {

                nouveauTransfert.items.add(
                    fichierExistant
                );

            }
        );


        document.getElementById(
            "piecesJustificatives"
        ).files =
            nouveauTransfert.files;


        /*
            Retirer la ligne de l'écran.
        */

        fichier.remove();


        /*
            Masquer l'en-tête s'il ne reste
            plus aucune pièce.
        */

        if (
            entete &&
            tousLesFichiers.length === 0
        ) {

            entete.style.display =
                "none";

        }

    }
);


/* AJOUTER LES ÉLÉMENTS */

fichier.appendChild(
    nomFichier
);

fichier.appendChild(
    selectCategorie
);

fichier.appendChild(
    selectJournee
);

fichier.appendChild(
    boutonSupprimer
);


liste.appendChild(
    fichier
);

                }
            );

        }
    );

/* ================================
   GÉNÉRATION DU PDF
================================ */

async function genererPDF() {

    /* ================================
       OUTILS
    ================================ */

    function obtenirValeur(id) {

        const element =
            document.getElementById(id);

        return element
            ? element.value || ""
            : "";
    }


    function obtenirCoche(id) {

        const element =
            document.getElementById(id);

        return element
            ? element.checked
            : false;
    }


    function obtenirNombre(id) {

        return parseFloat(
            obtenirValeur(id)
        ) || 0;
    }


    function formaterDate(dateString) {

        if (!dateString) {
            return "";
        }

        const date =
            new Date(
                dateString + "T00:00:00"
            );

        return date.toLocaleDateString(
            "fr-CA",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    }


    function formaterDateCourte(dateString) {

        if (!dateString) {
            return "";
        }

        const date =
            new Date(
                dateString + "T00:00:00"
            );

        return date.toLocaleDateString(
            "fr-CA",
            {
                day: "numeric",
                month: "short"
            }
        );
    }


    function obtenirDateJournee(numero) {

        const dateDepart =
            obtenirValeur("dateDepart");

        if (!dateDepart) {
            return "";
        }

        const date =
            new Date(
                dateDepart + "T00:00:00"
            );

        date.setDate(
            date.getDate() + numero - 1
        );

        return (
            date.getFullYear() +
            "-" +
            String(
                date.getMonth() + 1
            ).padStart(2, "0") +
            "-" +
            String(
                date.getDate()
            ).padStart(2, "0")
        );
    }


    function obtenirParametres(numero) {

        return obtenirParametresPourJournee(
            numero
        );
    }


    function montantPDF(montant) {

        return montant
            .toFixed(2)
            .replace(".", ",") + " $";
    }


    function valeurOuTiret(valeur) {

        if (
            valeur === "" ||
            valeur === null ||
            valeur === undefined
        ) {
            return "—";
        }

        return valeur;
    }


    /* ================================
       INFORMATIONS GÉNÉRALES
    ================================ */

    const nom =
        obtenirValeur("nom");

    const adresse =
        obtenirValeur("adresse");

    const courriel = 
	obtenirValeur("courriel");

    const dateDepart =
        obtenirValeur("dateDepart");

    const heureDepart =
        obtenirValeur("heureDepart");

    const dateRetour =
        obtenirValeur("dateRetour");

    const heureRetour =
        obtenirValeur("heureRetour");

    const motif =
        obtenirValeur("motifActivite");


    /* ================================
       NOMBRE DE JOURNÉES
    ================================ */

    let nombreJournees =
        numeroJournee;

    if (!nombreJournees) {

        if (
            dateDepart &&
            dateRetour
        ) {

            const debut =
                new Date(
                    dateDepart +
                    "T00:00:00"
                );

            const fin =
                new Date(
                    dateRetour +
                    "T00:00:00"
                );

            nombreJournees =
                Math.round(
                    (fin - debut) /
                    (1000 * 60 * 60 * 24)
                ) + 1;

        } else if (dateDepart) {

            nombreJournees = 1;

        } else {

            return null;
        }
    }


    /* ================================
       CRÉER LE CONTENEUR PDF
    ================================ */

    const conteneurPDF =
        document.createElement("div");

    conteneurPDF.style.position =
        "absolute";

    conteneurPDF.style.left =
        "-10000px";

    conteneurPDF.style.top =
        "0";

    conteneurPDF.style.width =
        "760px";

    conteneurPDF.style.backgroundColor =
        "white";

    conteneurPDF.style.fontFamily =
        "Arial, sans-serif";

    conteneurPDF.style.color =
        "#354352";

    document.body.appendChild(
        conteneurPDF
    );


    /* ================================
       CRÉATION D'UNE PAGE
    ================================ */

    function creerPagePDF(
        premierJour,
        dernierJour,
        numeroPage
    ) {

        const page =
            document.createElement("div");

        page.style.width =
            "760px";

        page.style.minHeight =
            "1000px";

        page.style.boxSizing =
            "border-box";

        page.style.padding =
            "18px 20px";

        page.style.backgroundColor =
            "white";


        /* ================================
           TITRE
        ================================ */

        const titre =
            document.createElement("div");

        titre.style.backgroundColor =
            "#354352";

        titre.style.color =
            "white";

        titre.style.padding =
            "8px 12px";

        titre.style.fontSize =
            "18px";

        titre.style.fontWeight =
            "700";

        titre.style.marginBottom =
            "8px";

        titre.textContent =
            "RAPPORT DE DÉPLACEMENTS";

        page.appendChild(titre);


        /* ================================
           IDENTIFICATION
        ================================ */

        const identification =
            document.createElement("table");

        identification.style.width =
            "100%";

        identification.style.borderCollapse =
            "collapse";

        identification.style.fontSize =
            "11px";

	identification.style.color =
	    "#202a33";

        identification.style.marginBottom =
            "8px";


        identification.innerHTML = `

            <tr>

                <td
                    style="
                        width:16%;
                        border:1px solid #bfc7ce;
                        background:#eef1f3;
                        font-weight:bold;
                        padding:4px;
                    "
                >
                    Nom
                </td>

                <td
                    style="
                        width:34%;
                        border:1px solid #bfc7ce;
                        padding:4px;
                    "
                >
                    ${valeurOuTiret(nom)}
                </td>

                <td
                    style="
                        width:16%;
                        border:1px solid #bfc7ce;
                        background:#eef1f3;
                        font-weight:bold;
                        padding:4px;
                    "
                >
                    Date du rapport
                </td>

                <td
                    style="
                        width:34%;
                        border:1px solid #bfc7ce;
                        padding:4px;
                    "
                >
                    ${formaterDate(new Date().toISOString().slice(0, 10))}
                </td>

            </tr>

            <tr>

                <td
                    style="
                        width:16%;
			border:1px solid #bfc7ce;
                        background:#eef1f3;
                        font-weight:bold;
                        padding:4px;
                    "
                >
                    Adresse
                </td>

		<td
		    style="
			width:34%;
			border:1px solid #bfc7ce;
			padding:4px;
		    "
		>
		    ${valeurOuTiret(adresse)}
		</td>

		<td
		    style="
			width:16%;
			border:1px solid #bfc7ce;
			background: #eef1f3;
			font-weight:bold;
			padding:4px
		    "
		>
		
		    Courriel
		</td>

		<td
		    style="
			width:34%;
			border:1px solid #bfc7ce;
			padding:4px;
		    "
		>
		
		    ${valeurOuTiret(courriel)}

		</td>
	</tr>

            <tr>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        background:#eef1f3;
                        font-weight:bold;
                        padding:4px;
                    "
                >
                    Départ
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        padding:4px;
                    "
                >
                    ${formaterDate(dateDepart)}
                    &nbsp;&nbsp;
                    ${valeurOuTiret(heureDepart)}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        background:#eef1f3;
                        font-weight:bold;
                        padding:4px;
                    "
                >
                    Retour
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        padding:4px;
                    "
                >
                    ${formaterDate(dateRetour)}
                    &nbsp;&nbsp;
                    ${valeurOuTiret(heureRetour)}
                </td>

            </tr>

            <tr>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        background:#eef1f3;
                        font-weight:bold;
                        padding:4px;
                    "
                >
                    Nature de l'activité
                </td>

                <td
                    colspan="3"
                    style="
                        border:1px solid #bfc7ce;
                        padding:4px;
                    "
                >
                    ${valeurOuTiret(motif)}
                </td>

            </tr>

        `;

        page.appendChild(
            identification
        );


        /* ================================
           TABLEAU TRANSPORTS
        ================================ */

        const titreTransports =
            document.createElement("div");

        titreTransports.textContent =
            "ACTIVITÉS ET TRANSPORTS";

        titreTransports.style.backgroundColor =
            "#354352";

        titreTransports.style.color =
            "white";

        titreTransports.style.fontWeight =
            "700";

        titreTransports.style.fontSize =
            "11px";

        titreTransports.style.padding =
            "4px 6px";

        page.appendChild(
            titreTransports
        );


        const tableauTransports =
            document.createElement("table");

        tableauTransports.style.width =
            "100%";

        tableauTransports.style.borderCollapse =
            "collapse";

        tableauTransports.style.tableLayout =
            "fixed";

        tableauTransports.style.fontSize =
            "10px";

	tableauTransports.style.color =
	    "#202a33";

        tableauTransports.innerHTML = `

            <tr style="background:#eef1f3;font-weight:bold;text-align:center;">

                <td style="width:4%;border:1px solid #9faab3;padding:3px;">Jour</td>

                <td style="width:10%;border:1px solid #9faab3;padding:3px;">Date</td>

                <td style="width:19%;border:1px solid #9faab3;padding:3px;">Ville de départ</td>

                <td style="width:19%;border:1px solid #9faab3;padding:3px;">Ville d'arrivée</td>

                <td style="width:10%;border:1px solid #9faab3;padding:3px;">Transit<br>km</td>

                <td style="width:10%;border:1px solid #9faab3;padding:3px;">Locaux<br>km</td>

                <td style="width:10%;border:1px solid #9faab3;padding:3px;">Location</td>

                <td style="width:10%;border:1px solid #9faab3;padding:3px;">Essence</td>

                <td style="width:8%;border:1px solid #9faab3;padding:3px;">Transport<br>public</td>

            </tr>

        `;


        for (
            let i = premierJour;
            i <= dernierJour;
            i++
        ) {

            const dateJournee =
                obtenirDateJournee(i);

            const transit =
                obtenirNombre(
                    "deplacementTransit" + i
                );

            const locaux =
                obtenirNombre(
                    "deplacementsLocaux" + i
                );

            const location =
                obtenirNombre(
                    "locationCout" + i
                );

            const essence =
                obtenirNombre(
                    "locationEssence" + i
                );

            const transportPublic =
                obtenirNombre(
                    "transportPublic" + i
                );


            const ligne =
                document.createElement("tr");


            ligne.innerHTML = `

                <td
                    style="
                        border:1px solid #bfc7ce;
                        text-align:center;
                        padding:3px;
                    "
                >
                    ${i}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        text-align:center;
                        padding:3px;
                    "
                >
                    ${formaterDateCourte(dateJournee)}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        padding:3px;
                    "
                >
                    ${valeurOuTiret(obtenirValeur("villeDepart" + i))}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        padding:3px;
                    "
                >
                    ${valeurOuTiret(obtenirValeur("villeArrivee" + i))}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        text-align:right;
                        padding:3px;
                    "
                >
                    ${transit ? transit.toFixed(2).replace(".", ",") : "—"}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        text-align:right;
                        padding:3px;
                    "
                >
                    ${locaux ? locaux.toFixed(2).replace(".", ",") : "—"}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        text-align:right;
                        padding:3px;
                    "
                >
                    ${location ? montantPDF(location) : "—"}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        text-align:right;
                        padding:3px;
                    "
                >
                    ${essence ? montantPDF(essence) : "—"}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        text-align:right;
                        padding:3px;
                    "
                >
                    ${transportPublic ? montantPDF(transportPublic) : "—"}
                </td>

            `;

            tableauTransports.appendChild(
                ligne
            );
        }


        page.appendChild(
            tableauTransports
        );


        /* ================================
           TABLEAU FRAIS DE SÉJOUR
        ================================ */

        const titreFrais =
            document.createElement("div");

        titreFrais.textContent =
            "FRAIS DE SÉJOUR ET AUTRES DÉPENSES";

        titreFrais.style.backgroundColor =
            "#354352";

        titreFrais.style.color =
            "white";

        titreFrais.style.fontWeight =
            "700";

        titreFrais.style.fontSize =
            "11px";

        titreFrais.style.padding =
            "4px 6px";

        titreFrais.style.marginTop =
            "8px";

        page.appendChild(
            titreFrais
        );


        const tableauFrais =
            document.createElement("table");

        tableauFrais.style.width =
            "100%";

        tableauFrais.style.borderCollapse =
            "collapse";

        tableauFrais.style.tableLayout =
            "fixed";

        tableauFrais.style.fontSize =
            "10px";

	tableauFrais.style.color =
	    "#202a33";


        tableauFrais.innerHTML = `

            <tr style="background:#eef1f3;font-weight:bold;text-align:center;">

                <td style="width:4%;border:1px solid #9faab3;padding:3px;">Jour</td>

                <td style="width:7%;border:1px solid #9faab3;padding:3px;">Déj.</td>

                <td style="width:7%;border:1px solid #9faab3;padding:3px;">Dîner</td>

                <td style="width:7%;border:1px solid #9faab3;padding:3px;">Souper</td>

                <td style="width:7%;border:1px solid #9faab3;padding:3px;">Coll.</td>

                <td style="width:9%;border:1px solid #9faab3;padding:3px;">Hôtel</td>

                <td style="width:9%;border:1px solid #9faab3;padding:3px;">Proches</td>

                <td style="width:8%;border:1px solid #9faab3;padding:3px;">Taxi</td>

                <td style="width:10%;border:1px solid #9faab3;padding:3px;">Stat.</td>

                <td style="width:8%;border:1px solid #9faab3;padding:3px;">Autres</td>

                <td style="width:24%;border:1px solid #9faab3;padding:3px;">Justification</td>

            </tr>

        `;


        for (
            let i = premierJour;
            i <= dernierJour;
            i++
        ) {

            const parametres =
                obtenirParametres(i);

            if (!parametres) {
                continue;
            }


            const dejeuner =
                obtenirCoche(
                    "dejeuner" + i
                )
                    ? parametres.dejeuner
                    : 0;

            const diner =
                obtenirCoche(
                    "diner" + i
                )
                    ? parametres.diner
                    : 0;

            const souper =
                obtenirCoche(
                    "souper" + i
                )
                    ? parametres.souper
                    : 0;

            const collation =
                obtenirCoche(
                    "collation" + i
                )
                    ? parametres.collation
                    : 0;


            const hotelChoix =
                obtenirCoche(
                    "hotelChoix" + i
                );

            const proches =
                obtenirCoche(
                    "proches" + i
                );


            const hotel =
                obtenirNombre(
                    "hotel" + i
                );

            const taxi =
                obtenirNombre(
                    "taxi" + i
                );

            const stationnement =
                obtenirNombre(
                    "stationnement" + i
                );

            const divers =
                obtenirNombre(
                    "divers" + i
                );


            let hotelAffichage =
                "—";

            if (hotelChoix) {

                hotelAffichage =
                    montantPDF(hotel);
            }


            let prochesAffichage =
                "—";

            if (proches) {

                prochesAffichage =
                    montantPDF(
                        parametres.proches
                    );
            }


            const justification =
                obtenirValeur(
                    "justification" + i
                );


            const ligne =
                document.createElement("tr");


            ligne.innerHTML = `

                <td
                    style="
                        border:1px solid #bfc7ce;
                        text-align:center;
                        padding:3px;
                    "
                >
                    ${i}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        text-align:right;
                        padding:3px;
                    "
                >
                    ${dejeuner ? montantPDF(dejeuner) : "—"}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        text-align:right;
                        padding:3px;
                    "
                >
                    ${diner ? montantPDF(diner) : "—"}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        text-align:right;
                        padding:3px;
                    "
                >
                    ${souper ? montantPDF(souper) : "—"}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        text-align:right;
                        padding:3px;
                    "
                >
                    ${collation ? montantPDF(collation) : "—"}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        text-align:right;
                        padding:3px;
                    "
                >
                    ${hotelAffichage}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        text-align:right;
                        padding:3px;
                    "
                >
                    ${prochesAffichage}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        text-align:right;
                        padding:3px;
                    "
                >
                    ${taxi ? montantPDF(taxi) : "—"}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        text-align:right;
                        padding:3px;
                    "
                >
                    ${stationnement ? montantPDF(stationnement) : "—"}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        text-align:right;
                        padding:3px;
                    "
                >
                    ${divers ? montantPDF(divers) : "—"}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        padding:3px;
                        word-wrap:break-word;
                    "
                >
                    ${valeurOuTiret(justification)}
                </td>

            `;

            tableauFrais.appendChild(
                ligne
            );
        }


        page.appendChild(
            tableauFrais
        );


        /* ================================
           TOTAUX
        ================================ */

        if (
            dernierJour === nombreJournees
        ) {

            const titreTotaux =
                document.createElement("div");

            titreTotaux.textContent =
                "TOTAL DU RAPPORT";

            titreTotaux.style.backgroundColor =
                "#354352";

            titreTotaux.style.color =
                "white";

            titreTotaux.style.fontWeight =
                "700";

            titreTotaux.style.fontSize =
                "11px";

            titreTotaux.style.padding =
                "4px 6px";

            titreTotaux.style.marginTop =
                "8px";

            page.appendChild(
                titreTotaux
            );


            const tableauTotaux =
                document.createElement("table");

            tableauTotaux.style.width =
                "100%";

            tableauTotaux.style.borderCollapse =
                "collapse";

            tableauTotaux.style.tableLayout =
                "fixed";

            tableauTotaux.style.fontSize =
                "10px";


            tableauTotaux.innerHTML = `

                <tr style="background:#eef1f3;font-weight:bold;text-align:center;">

                    <td style="border:1px solid #9faab3;padding:4px;">
                        Kilométrage
                    </td>

                    <td style="border:1px solid #9faab3;padding:4px;">
                        Autres transports
                    </td>

                    <td style="border:1px solid #9faab3;padding:4px;">
                        Repas
                    </td>

                    <td style="border:1px solid #9faab3;padding:4px;">
                        Hébergement
                    </td>

                    <td style="border:1px solid #9faab3;padding:4px;">
                        Autres dépenses
                    </td>

                    <td style="border:1px solid #354352;padding:4px;background:#dfe5e9;">
                        TOTAL GÉNÉRAL
                    </td>

                </tr>

                <tr style="text-align:right;font-weight:bold;">

                    <td style="border:1px solid #bfc7ce;padding:4px;">
                        ${document.getElementById("totalRapportKilometrage")?.textContent || "0,00 $"}
                    </td>

                    <td style="border:1px solid #bfc7ce;padding:4px;">
                        ${document.getElementById("totalRapportAutresTransports")?.textContent || "0,00 $"}
                    </td>

                    <td style="border:1px solid #bfc7ce;padding:4px;">
                        ${document.getElementById("totalRapportRepas")?.textContent || "0,00 $"}
                    </td>

                    <td style="border:1px solid #bfc7ce;padding:4px;">
                        ${document.getElementById("totalRapportHebergement")?.textContent || "0,00 $"}
                    </td>

                    <td style="border:1px solid #bfc7ce;padding:4px;">
                        ${document.getElementById("totalRapportAutresDepenses")?.textContent || "0,00 $"}
                    </td>

                    <td style="border:2px solid #354352;padding:4px;font-size:9px;">
                        ${document.getElementById("totalRapportGeneral")?.textContent || "0,00 $"}

                    </td>

                </tr>

            `;


            page.appendChild(
                tableauTotaux
            );

            /* ================================
               RÉSERVÉ À L'ADMINISTRATION
            ================================ */

            const titreAdministration =
                document.createElement("div");

            titreAdministration.textContent =
                "RÉSERVÉ À L’ADMINISTRATION";

            titreAdministration.style.backgroundColor =
                "#354352";

            titreAdministration.style.color =
                "white";

            titreAdministration.style.fontWeight =
                "700";

            titreAdministration.style.fontSize =
                "11px";

            titreAdministration.style.padding =
                "4px 6px";

            titreAdministration.style.marginTop =
                "8px";

            page.appendChild(
                titreAdministration
            );


            const tableauAdministration =
                document.createElement("table");

            tableauAdministration.style.width =
                "100%";

            tableauAdministration.style.borderCollapse =
                "collapse";

            tableauAdministration.style.tableLayout =
                "fixed";

            tableauAdministration.style.fontSize =
                "10px";

            tableauAdministration.innerHTML = `

                <tr
                    style="
                        background:#eef1f3;
                        font-weight:bold;
                    "
                >

                    <td
                        style="
                            width:66.67%;
                            border:1px solid #9faab3;
                            padding:4px;
                        "
                    >
                        Poste budgétaire
                    </td>

                    <td
                        style="
                            width:33.33%;
                            border:1px solid #9faab3;
                            padding:4px;
                        "
                    >
                        $
                    </td>

                </tr>

                <tr>

                    <td
                        style="
                            height:18px;
                            border:1px solid #bfc7ce;
                        "
                    ></td>

                    <td
                        style="
                            height:18px;
                            border:1px solid #bfc7ce;
                        "
                    ></td>

                </tr>

                <tr>

                    <td
                        style="
                            height:18px;
                            border:1px solid #bfc7ce;
                        "
                    ></td>

                    <td
                        style="
                            height:18px;
                            border:1px solid #bfc7ce;
                        "
                    ></td>

                </tr>

                <tr>

                    <td
                        style="
                            height:18px;
                            border:1px solid #bfc7ce;
                        "
                    ></td>

                    <td
                        style="
                            height:18px;
                            border:1px solid #bfc7ce;
                        "
                    ></td>

                </tr>

                <tr>

                    <td
                        style="
                            height:18px;
                            border:1px solid #bfc7ce;
                        "
                    ></td>

                    <td
                        style="
                            height:18px;
                            border:1px solid #bfc7ce;
                        "
                    ></td>

                </tr>

                <tr>

                    <td
                        style="
                            border:1px solid #bfc7ce;
                            padding:5px;
                        "
                    >
                        <strong>Autorisé par :</strong>
                    </td>

                    <td
                        style="
                            border:1px solid #bfc7ce;
                            padding:5px;
                        "
                    >
                        <strong>Date</strong>
                    </td>

                </tr>

            `;


            page.appendChild(
                tableauAdministration
            );


            /* ================================
               PIÈCES JUSTIFICATIVES
            ================================ */

            const inputPieces =
                document.getElementById(
                    "piecesJustificatives"
                );


            if (
                inputPieces &&
                inputPieces.files &&
                inputPieces.files.length > 0
            ) {

                const titrePieces =
                    document.createElement("div");

                titrePieces.textContent =
                    "PIÈCES JUSTIFICATIVES";

                titrePieces.style.backgroundColor =
                    "#354352";

                titrePieces.style.color =
                    "white";

                titrePieces.style.fontWeight =
                    "700";

                titrePieces.style.fontSize =
                    "11px";

                titrePieces.style.padding =
                    "4px 6px";

                titrePieces.style.marginTop =
                    "8px";

                page.appendChild(
                    titrePieces
                );


                const tableauPieces =
                    document.createElement("table");

                tableauPieces.style.width =
                    "100%";

                tableauPieces.style.borderCollapse =
                    "collapse";

                tableauPieces.style.fontSize =
                    "10px";


                tableauPieces.innerHTML = `

                    <tr style="background:#eef1f3;font-weight:bold;">

                        <td style="width:45%;border:1px solid #9faab3;padding:3px;">
                            Fichier
                        </td>

                        <td style="width:30%;border:1px solid #9faab3;padding:3px;">
                            Catégorie
                        </td>

                        <td style="width:25%;border:1px solid #9faab3;padding:3px;">
                            Journée
                        </td>

                    </tr>

                `;


                const lignesPieces =
                    document.querySelectorAll(
                        "#listePiecesJustificatives .piece-justificative"
                    );


                lignesPieces.forEach(
                    function(ligne) {

                        const nomFichier =
                            ligne.querySelector(
                                ".nom-piece"
                            )?.textContent || "";

                        const categorie =
                            ligne.querySelector(
                                ".categorie-piece"
                            )?.value || "";

                        const journee =
                            ligne.querySelector(
                                ".journee-piece"
                            )?.selectedOptions[0]
                                ?.textContent || "";


                        const tr =
                            document.createElement("tr");


                        tr.innerHTML = `

                            <td style="border:1px solid #bfc7ce;padding:3px;">
                                ${valeurOuTiret(nomFichier)}
                            </td>

                            <td style="border:1px solid #bfc7ce;padding:3px;">
                                ${valeurOuTiret(categorie)}
                            </td>

                            <td style="border:1px solid #bfc7ce;padding:3px;">
                                ${valeurOuTiret(journee)}
                            </td>

                        `;


                        tableauPieces.appendChild(
                            tr
                        );
                    }
                );


                page.appendChild(
                    tableauPieces
                );
            }
        }


        /* ================================
           NUMÉRO DE PAGE
        ================================ */

        const pied =
            document.createElement("div");

        pied.style.textAlign =
            "right";

        pied.style.fontSize =
            "8px";

        pied.style.color =
            "#777";

        pied.style.marginTop =
            "5px";

        pied.textContent =
            "Page " +
            numeroPage;

        page.appendChild(
            pied
        );


        return page;
    }


    /* ================================
       CRÉER LA PAGE
    ================================ */

    const pagePDF =
        creerPagePDF(
            1,
            nombreJournees,
            1
        );


    conteneurPDF.appendChild(
        pagePDF
    );


    /* ================================
       CRÉATION DU PDF
    ================================ */

    const {
        jsPDF
    } = window.jspdf;


    const pdf =
        new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "letter"
        });


    const largeurPage =
        pdf.internal.pageSize.getWidth();

    const hauteurPage =
        pdf.internal.pageSize.getHeight();


    const pages =
        conteneurPDF.children;


    for (
        let i = 0;
        i < pages.length;
        i++
    ) {

        const page =
            pages[i];


        const canvas =
            await html2canvas(
                page,
                {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#ffffff"
                }
            );


        const marge =
            8;

        const largeurDisponible =
            largeurPage -
            marge * 2;

        const hauteurDisponible =
            hauteurPage -
            marge * 2;


        const ratioLargeur =
            largeurDisponible /
            canvas.width;

        const ratioHauteur =
            hauteurDisponible /
            canvas.height;


        const ratio =
            Math.min(
                ratioLargeur,
                ratioHauteur
            );


        const largeurImage =
            canvas.width *
            ratio;

        const hauteurImage =
            canvas.height *
            ratio;


        const positionX =
            (
                largeurPage -
                largeurImage
            ) / 2;


        const positionY =
            (
                hauteurPage -
                hauteurImage
            ) / 2;


        if (i > 0) {
            pdf.addPage();
        }


        pdf.addImage(
            canvas.toDataURL(
                "image/jpeg",
                0.95
            ),
            "JPEG",
            positionX,
            positionY,
            largeurImage,
            hauteurImage
        );
    }


    /* ================================
       NETTOYAGE
    ================================ */

    document.body.removeChild(
        conteneurPDF
    );


    return pdf;
}

document.getElementById("boutonGenererPDF")
    .addEventListener(
        "click",
        async function() {

            const pdf =
                await genererPDF();

            if (!pdf) {
                return;
            }

            pdf.save(
                "Rapport_de_deplacements.pdf"
            );

        }
    );

document.getElementById("boutonImprimer")
    .addEventListener(
        "click",
        async function() {

            const fenetreImpression =
                window.open(
                    "",
                    "_blank"
                );

            if (!fenetreImpression) {
                return;
            }

            const pdf =
                await genererPDF();

            if (!pdf) {
                fenetreImpression.close();
                return;
            }

            const pdfBlob =
                pdf.output("blob");

            const pdfUrl =
                URL.createObjectURL(pdfBlob);

            fenetreImpression.location.href =
                pdfUrl;

            setTimeout(
                function() {

                    fenetreImpression.focus();
                    fenetreImpression.print();

                },
                1500
            );

        }
    );

document.getElementById("boutonReinitialiser")
    .addEventListener(
        "click",
        function() {

            /* ================================
               RÉINITIALISER LES CHAMPS
            ================================ */

            const champs =
                document.querySelectorAll(
                    "input, textarea, select"
                );

            champs.forEach(
                function(champ) {

                    if (
                        champ.type === "checkbox" ||
                        champ.type === "radio"
                    ) {

                        champ.checked = false;

                    } else if (
                        champ.type !== "file"
                    ) {

                        champ.value = "";

                    }

                }
            );


            /* ================================
               RÉINITIALISER LES CALENDRIERS
            ================================ */

            const dateDepart =
                document.getElementById(
                    "dateDepart"
                );

            const dateRetour =
                document.getElementById(
                    "dateRetour"
                );


            if (
                dateDepart &&
                dateDepart._flatpickr
            ) {

                dateDepart._flatpickr.clear();

            }


            if (
                dateRetour &&
                dateRetour._flatpickr
            ) {

                dateRetour._flatpickr.clear();

            }


            /* ================================
               RÉINITIALISER LES PIÈCES
            ================================ */

            const pieces =
                document.getElementById(
                    "piecesJustificatives"
                );

            if (pieces) {
                pieces.value = "";
            }


            const listePieces =
                document.getElementById(
                    "listePiecesJustificatives"
                );

            if (listePieces) {
                listePieces.innerHTML = "";
            }


            const entetePieces =
                document.getElementById(
                    "entetePiecesJustificatives"
                );

            if (entetePieces) {
                entetePieces.style.display = "none";
            }


            /* ================================
               RÉINITIALISER L'AFFICHAGE
            ================================ */

            const dateDepartAffichee =
                document.getElementById(
                    "dateDepartAffichee"
                );

            if (dateDepartAffichee) {
                dateDepartAffichee.textContent = "";
            }


            /* ================================
               RÉINITIALISER LES JOURNÉES
            ================================ */

            numeroJournee = 1;

            creerJournees();

        }
    );

/* ================================
   VALIDATION DES CHAMPS OBLIGATOIRES
================================ */

function verifierChampsObligatoires() {

    const champsObligatoires = [
        "nom",
        "courriel",
        "adresse",
        "dateDepart",
        "heureDepart",
        "dateRetour",
        "heureRetour",
        "motifActivite"
    ];

    let formulaireComplet = true;


    champsObligatoires.forEach(function(id) {

        const champ =
            document.getElementById(id);

        if (
            !champ ||
            !champ.value ||
            champ.value.trim() === ""
        ) {

            formulaireComplet = false;

        }

    });


    const champCourriel =
        document.getElementById("courriel");

    if (!champCourriel) {

        formulaireComplet = false;

    } else {

        const courriel =
            champCourriel.value.trim();

        const formatCourriel =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            courriel === "" ||
            !formatCourriel.test(courriel)
        ) {

            formulaireComplet = false;

        }

    }


    const champsAvecRequired =
        document.querySelectorAll(
            "input[required], textarea[required], select[required]"
        );

    champsAvecRequired.forEach(function(champ) {

        if (
            !champ.disabled &&
            champ.value.trim() === ""
        ) {

            formulaireComplet = false;

        }

    });


    const boutonPDF =
        document.getElementById(
            "boutonGenererPDF"
        );

    const boutonCourriel =
        document.getElementById(
            "boutonEnvoyerCourriel"
        );

    const boutonImprimer =
        document.getElementById(
            "boutonImprimer"
        );


    if (boutonPDF) {
        boutonPDF.disabled =
            !formulaireComplet;
    }

    if (boutonCourriel) {
        boutonCourriel.disabled =
            !formulaireComplet;
    }

    if (boutonImprimer) {
        boutonImprimer.disabled =
            !formulaireComplet;
    }

}


/* ================================
   SURVEILLANCE DES CHAMPS
================================ */

const champsObligatoires = [
    "nom",
    "courriel",
    "adresse",
    "dateDepart",
    "heureDepart",
    "dateRetour",
    "heureRetour",
    "motifActivite"
];


champsObligatoires.forEach(function(id) {

    const champ =
        document.getElementById(id);

    if (!champ) {
        return;
    }


    champ.addEventListener(
        "input",
        verifierChampsObligatoires
    );


    champ.addEventListener(
        "change",
        verifierChampsObligatoires
    );

});


/* ================================
   ÉTAT INITIAL
================================ */

verifierChampsObligatoires();
