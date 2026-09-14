// ============================================================
// GESTION DU COURRIEL
// ============================================================

const parametresCourriel = {

    destinataireInterne: "xavier@sehcn.com",

    objet: "Rapport de déplacements — [Nom] — [DateRapport] — [NatureActivite]",

    texte: `Bonjour Marie,

Voici mon rapport de déplacements concernant l'activité suivante :

[NatureActivite]

Les pièces justificatives requises sont jointes à ce courriel.

Merci,

[Nom]`

};


// ============================================================
// ADRESSE POWER AUTOMATE
// ============================================================

const adressePowerAutomate = "https://rapport-deplacements.xavier-37f.workers.dev";


// ============================================================
// REMPLACEMENT DES CODES
// ============================================================

function remplacerCodesCourriel() {

    const nom =
        document.getElementById("nom").value.trim();

    const courriel = 
	document.getElementById("courriel").value.trim();

    const natureActivite =
        document.getElementById("motifActivite").value.trim();

    const dateRapport =
        new Date().toLocaleDateString(
            "fr-CA"
        );

    const numeroRapport =
        "À attribuer";


    let objet =
        parametresCourriel.objet;

    let texte =
        parametresCourriel.texte;


    objet =
        objet.replace(
            /\[Nom\]/g,
            nom
        );

    objet =
        objet.replace(
            /\[DateRapport\]/g,
            dateRapport
        );

    objet =
        objet.replace(
            /\[NatureActivite\]/g,
            natureActivite
        );

    objet =
        objet.replace(
            /\[NumeroRapport\]/g,
            numeroRapport
        );


    texte =
        texte.replace(
            /\[Nom\]/g,
            nom
        );

    texte =
        texte.replace(
            /\[DateRapport\]/g,
            dateRapport
        );

    texte =
        texte.replace(
            /\[NatureActivite\]/g,
            natureActivite
        );

    texte =
        texte.replace(
            /\[NumeroRapport\]/g,
            numeroRapport
        );


    return {
	destinataire: courriel,        
	objet: objet,
        texte: texte
    };

}


// ============================================================
// CONVERSION D'UN FICHIER EN BASE64
// ============================================================

function fichierEnBase64(fichier) {

    return new Promise(
        function(resolve, reject) {

            const lecteur =
                new FileReader();

            lecteur.onload =
                function() {

                    const resultat =
                        lecteur.result;

                    const base64 =
                        resultat.split(",")[1];

                    resolve(base64);

                };

            lecteur.onerror =
                function() {

                    reject(
                        lecteur.error
                    );

                };

            lecteur.readAsDataURL(fichier);

        }
    );

}


// ============================================================
// PRÉPARATION DES PIÈCES JUSTIFICATIVES
// ============================================================

async function preparerPiecesJustificatives() {

    const champ =
        document.getElementById(
            "piecesJustificatives"
        );

    const fichiers =
        champ.files;

    const pieces = [];


    for (
        let i = 0;
        i < fichiers.length;
        i++
    ) {

        const fichier =
            fichiers[i];

        const contenu =
            await fichierEnBase64(
                fichier
            );

        pieces.push({

            nom: fichier.name,

            type: fichier.type,

            contenu: contenu

        });

    }


    return pieces;

}


// ============================================================
// ENVOI DU RAPPORT
// ============================================================

async function envoyerRapportParCourriel() {

    if (!adressePowerAutomate) {

        alert(
            "L'envoi par courriel n'est pas encore configuré. " +
            "Le branchement à Power Automate sera effectué à l'étape suivante."
        );

        return;

    }


    const confirmation =
        confirm(
            "Voulez-vous envoyer ce rapport par courriel ?"
        );


    if (!confirmation) {

        return;

    }


    const parametres =
        remplacerCodesCourriel();


    const pdf =
        await genererPDF();


    if (!pdf) {

        return;

    }


    const pdfBase64 =
        pdf.output("datauristring")
            .split(",")[1];


    const pieces =
        await preparerPiecesJustificatives();


    const donnees = {

	destinataireInterne:
	    parametresCourriel.destinataireInterne,       

	destinataire:
            parametres.destinataire,

        objet:
            parametres.objet,

        texte:
            parametres.texte,

        pdf: {

            nom:
                "Rapport_de_deplacements.pdf",

            type:
                "application/pdf",

            contenu:
                pdfBase64

        },

        piecesJustificatives:
            pieces

    };


    try {

        const reponse =
            await fetch(
                adressePowerAutomate,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            donnees
                        )

                }
            );


        if (!reponse.ok) {

            throw new Error(
                "Erreur lors de l'envoi."
            );

        }


        alert(
            "Le rapport a été envoyé par courriel avec succès."
        );


    }
    catch (erreur) {

        console.error(
            erreur
        );

        alert(
            "Une erreur est survenue lors de l'envoi du rapport."
        );

    }

}


// ============================================================
// BOUTON « ENVOYER PAR COURRIEL »
// ============================================================

document.getElementById(
    "boutonEnvoyerCourriel"
)
.addEventListener(
    "click",
    envoyerRapportParCourriel
);