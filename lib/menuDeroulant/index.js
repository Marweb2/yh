/** @format */

// const pays = [
//   {
//     pays: "Canada",
//     province: "Québec",
//     ville: [
//       "Montréal",
//       "Québec",
//       "Laval",
//       "Gatineau",
//       "Longueuil",
//       "Sherbrooke",
//       "Saguenay",
//       "Lévis",
//       "Trois-Rivières",
//       "Terrebonne",
//     ],
//   },
//   {
//     pays: "France",
//     province: "",
//     ville: [
//       "Paris",
//       "Marseille",
//       "Lyon",
//       "Toulouse",
//       "Nice",
//       "Nantes",
//       "Montpellier",
//     ],
//   },
//   {
//     pays: "Madagascar",
//     province: "",
//     ville: [
//       "Antananarivo",
//       "Antsiranana",
//       "Fianarantsoa",
//       "Mahajanga",
//       "Toamasina",
//       "Toliara",
//     ],
//   },
//   {
//     pays: "Suisse",
//     province: "",
//     ville: ["Lausanne ", "Genève", "Zurich", "Lucerne"],
//   },
//   {
//     pays: "Belgique",
//     province: "",
//     ville: ["Gand", "Bruxelles", "Anvers", "Namur", "Liège"],
//   },
// ];
const pays = [
  {
    pays: "Belgique",
  },
  {
    pays: "Bénin",
  },
  {
    pays: "Cameroun",
  },
  {
    pays: "Canada",
  },
  {
    pays: "Côte d'Ivoire",
  },
  {
    pays: "France",
  },
  {
    pays: "Madagascar",
  },
  {
    pays: "Maroc",
  },
  {
    pays: "Sénégal",
  },
  {
    pays: "Suisse",
  },
  {
    pays: "Tunisie",
  },
  {
    pays: "Autre",
  },
];

// pays.sort((a, b) => a.pays.localeCompare(b.pays));
// pays.forEach((pays) => {
//   pays.ville.sort((a, b) => a.localeCompare(b));
// });
const statut = [
  "Adjoint.e virtuel.le",
  "Étudiant.e",
  "Particulier",
  "Professionnel",
  "Stagiaire",
  "Travailleur autonome",
].sort((a, b) => a.localeCompare(b));
const statutCli = [
  "Entrepreneur",
  "Investisseur",
  "Particulier",
  "Professionnel",
  "Travailleur autonome",
].sort((a, b) => a.localeCompare(b));
const competVirt = [
  "Adjoint.e virtuel.le",

  "Bourse",
  "Comptabilité",

  "Comptabilité - Tenu de livre",
  "Html",
  "Javascript / Python",
  "Cryptomonnaie",
  "Cyber sécurité",
  "Designer web / app",
  "Developpeur web - Programmeur",

  "Formation",
  "Formation adjoint.e virtuel.le",
  "Gestion des réseaux sociaux",
  "Gestion de projet virtuel",
  "Gestion de site web",
  "Génie logiciel",
  "Immigration / visa étudiant",
  "Infographie / illustration",
  "Infolettre",
  "Marketing digital",
  "Mentorat / Coaching",
  "Montage de podcast",
  "Montage vidéo/multimédia",
  "Plan d'affaires",
  "Recherche de subventions",
  "Rédaction / Correction / Révision",
  "Référencement web / SEO ",
  "Sitting / Closing",
  "Traduction",
  "Transcription Audio",
  // "Autre",
]; //.sort((a, b) => a.localeCompare(b));
const appWeb = [
  "Adobe Creative Suite",
  "Canva",
  "GoDaddy",
  "Gravit Designer",
  "Henri",
  "Hootsuite",
  "Microsoft Office",
  "Mysql",
  "Prestashop",
  "Quickbooks",
  "Shopify",
  "Suite Google",
  "Wordpress",
  "Wix",
  "Zoho",
  // "Autre",
]; //.sort((a, b) => a.localeCompare(b));
const expPro = ["Moins de 1 Année", "1 à 3 ans", "Plus de 3 ans"];
const delai = [24, 48, 72].sort((a, b) => a - b);
const tarifications = Array.from({ length: 51 }, (_, i) => i);
const lang = [
  { obj: "Français", tp: "fr" },
  { obj: "Anglais", tp: "en" },
];
const clientPays = [
  {
    pays: "Afrique",
    ville: ["Côte d'Ivoire", "Bénin", "Sénégale", "Cameroun", "Madagascar"],
  },
  {
    pays: "Canada",
    ville: ["Gatineau", "Montréal", "Laval", "Longueuil", "Québec"],
  },
  {
    pays: "Europe",
    ville: [
      "Berlin",
      "Madrid",
      "Rome",
      "Paris",
      "Belgique",
      "France",
      "Suisse",
    ],
  },
  {
    pays: "États-Unis",
    ville: ["New York", "Los Angeles", "Chicago", "Houston"],
  },
].sort((a, b) => a.pays.localeCompare(b.pays));
const nbCmp = 3;
export {
  pays,
  statut,
  competVirt,
  statutCli,
  appWeb,
  clientPays,
  delai,
  expPro,
  tarifications,
  lang,
  nbCmp,
};
