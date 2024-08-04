/** @format */

// Fonction de calcul de pourcentage de correspondance entre un utilisateur et un projet
export default function calculerPourcentageCorrespondance({ user, projet }) {
  // Paramètres pour attribuer des poids aux différentes caractéristiques
  const poids = {
    disponibilite: 1,
  };

  // Fonction pour calculer la similarité entre deux tableaux
  function calculerSimilariteTableau(arr1, arr2) {
    const intersection = arr1.filter((value) => arr2.includes(value));
    return (2 * intersection?.length) / (arr1?.length + arr2?.length);
  }

  // Calculer la similarité pour chaque caractéristique
  const similariteDisponibilite = calculerSimilariteTableau(
    projet.disponibilite,
    user.disponibilite
  );

  // Calculer le pourcentage de correspondance pondéré
  const pourcentageCorrespondance =
    (poids.disponibilite * similariteDisponibilite) /
    // Ajoutez d'autres caractéristiques pondérées
    poids.disponibilite; /* + ... */

  return pourcentageCorrespondance; // Convertir en pourcentage
}

// ALGORITHME COMPLET

// Fonction de calcul de pourcentage de correspondance entre un utilisateur et un projet
// function calculerPourcentageCorrespondance(utilisateur, projet) {
//     const poids = {
//         competenceVirtuelle: 0.4,
//         applicationWeb: 0.3,
//         experiencePro: 0.2,
//         tarif: 0.1,
//     };

//     function calculerSimilariteTableau(arr1, arr2) {
//         const intersection = arr1.filter(value => arr2.includes(value));
//         return (2 * intersection.length) / (arr1.length + arr2.length);
//     }

//     const similariteCompetence = calculerSimilariteTableau(utilisateur.competenceVirtuelle, projet.competenceVirtuelle);
//     const similariteApplicationWeb = (utilisateur.applicationWeb === projet.applicationWeb) ? 1 : 0;
//     const similariteExperiencePro = (utilisateur.experiencePro === projet.experiencePro) ? 1 : 0;
//     const similariteTarif = 1 - Math.abs(utilisateur.tarif - projet.tarif) / Math.max(utilisateur.tarif, projet.tarif);

//     const pourcentageCorrespondance = (
//         poids.competenceVirtuelle * similariteCompetence +
//         poids.applicationWeb * similariteApplicationWeb +
//         poids.experiencePro * similariteExperiencePro +
//         poids.tarif * similariteTarif
//     ) / (poids.competenceVirtuelle + poids.applicationWeb + poids.experiencePro + poids.tarif /* + ... */);

//     return pourcentageCorrespondance * 100; // Convertir en pourcentage
// }
