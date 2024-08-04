/** @format */

// fetchUserInfos
export const fetchUserInfosController = async (id) => {
  return await fetch(`/api/user/${id}`, { cache: "no-store" }).then((r) =>
    r.json()
  );
};
// updateUserInfos
export const updateUserInfosController = async ({
  id,
  username,
  name,
  pays,
  province,
  ville,
  lang,
  statutProfessionnelle,
  lienProfessionnelle,
  portfolio,
  competenceVirtuelle,
  experiencePro,
  applicationWeb,
  offresDeService,
  tarif,
  benevolat,
  montantForfaitaire,
  bio,
  image,
  devise,
}) => {
  return await fetch(`/api/user/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      name,
      pays,
      province,
      ville,
      lang,
      statutProfessionnelle,
      lienProfessionnelle,
      portfolio,
      competenceVirtuelle,
      experiencePro,
      applicationWeb,
      offresDeService,
      tarif,
      benevolat,
      montantForfaitaire,
      bio,
      image,
      devise,
    }),
  }).then((r) => r.json());
};

// update note && disp
export const updateDispController = async ({ id, note, disponibilite }) => {
  return await fetch(`/api/user/${id}/disp`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note, disponibilite }),
  }).then((r) => r.json());
};

// get photos
export const getPhotosController = async (id) => {
  return await fetch(`/api/user/${id}/photo`).then((r) => r.json());
};
