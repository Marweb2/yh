/** @format */

const API_VERSION = "v1";
const NODE_URL = "http://localhost:5000";

// Create new project
export const createProjectController = async (params) => {
  try {
    const requiredFields = [
      "clientId",
      "name",
      "desc",
      "duree",
      "competenceVirtuelle",
      "applicationWeb",
      "statutProfessionnelle",
      "experiencePro",
      "pays",
      "lang",
      "delai",
      "disponibilite",
      "tarif",
      // "montantForfaitaire",
      // "benevolat",
      "questions",
      "uniteMonaitaire",
      "statut",
    ];

    // for (let field of requiredFields) {
    //   if (!params[field]) {
    //     throw new Error(`Missing required field: ${field}`);
    //   }
    // }

    return await fetch(
      `api/${API_VERSION}/client/projet?client=${params.clientId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      }
    ).then((r) => r.json());
  } catch (error) {
    return { error };
  }
};

export const getProjetController = async (clientId) => {
  try {
    if (!clientId) throw new Error("Missing clientId");

    const data = await fetch(
      `api/${API_VERSION}/client/projet?client=${clientId}`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};
export const getAssistantProjet = async (assistantId) => {
  try {
    if (!assistantId) throw new Error("Missing clientId");

    const data = await fetch(
      `api/${API_VERSION}/assistant/projet?assistant=${assistantId}`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const getProjetAssistant = async (assistantId, page, filter) => {
  try {
    if (!assistantId || !page || !filter)
      throw new Error("Missing required parameters");

    const data = await fetch(
      `api/${API_VERSION}/assistant/avis?assistant=${assistantId}&page=${page}&filter=${filter}`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const getAssistantsProjectController = async (params) => {
  try {
    const { clientId, projectId, actualPage, filter } = params;
    if (!clientId || !projectId || !actualPage || !filter)
      throw new Error("Missing required parameters");

    const data = await fetch(
      `api/${API_VERSION}/client/projet/${projectId}/avis?client=${clientId}&page=${actualPage}&filter=${filter}`,
      { cache: "no-store" }
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const getSingleProjet = async (projectId) => {
  try {
    if (!projectId) throw new Error("Missing projectId");

    const data = await fetch(`/api/${API_VERSION}/client/projet/${projectId}`, {
      cache: "force-cache",
    }).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};
export const updateProjet = async (projectId, body) => {
  try {
    if (!projectId) throw new Error("Missing projectId");

    const data = await fetch(`/api/${API_VERSION}/client/projet/${projectId}`, {
      method: "PATCH",
      cache: "no-cache",
      body: JSON.stringify({
        ...body,
      }),
    }).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const updateAvisStatut = async (projectId, avisId, client, statut) => {
  try {
    if (!projectId || !avisId || !client || !statut)
      throw new Error("Missing required parameters");

    const data = await fetch(
      `/api/${API_VERSION}/client/projet/${projectId}/avis/${avisId}?client=${client}&statut=${statut}`,
      {
        cache: "no-cache",
        method: "PATCH",
      }
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};
export const updateAvis = async (projectId, avisId, client, isNew) => {
  try {
    if (!projectId || !avisId || !client)
      throw new Error("Missing required parameters");

    const data = await fetch(
      `/api/${API_VERSION}/client/projet/${projectId}/avis/${avisId}?client=${client}&isNew=${isNew}`,
      {
        cache: "no-cache",
        method: "PATCH",
      }
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const deleteAvis = async (projectId, avisId, user) => {
  try {
    if (!projectId || !avisId || !user)
      throw new Error("Missing required parameters");

    const data = await fetch(
      `/api/${API_VERSION}/client/projet/${projectId}/avis/${avisId}?client=${user}`,
      {
        cache: "no-cache",
        method: "DELETE",
      }
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};
export const deleteProject = async (projectId) => {
  try {
    if (!projectId) throw new Error("Missing required parameter");

    const data = await fetch(`/api/${API_VERSION}/client/projet/${projectId}`, {
      cache: "no-cache",
      method: "DELETE",
    }).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const addClientFavorite = async (avisId, clientId) => {
  try {
    if (!avisId || !clientId) throw new Error("Missing required parameters");

    const data = await fetch(`/api/${API_VERSION}/client/favoris`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        avisId,
      }),
    }).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const addAssistantFavorite = async (avisId, assistantId) => {
  try {
    if (!avisId || !assistantId) throw new Error("Missing required parameters");

    const data = await fetch(
      `/api/${API_VERSION}/assistant/favoris?assistant=${assistantId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          avisId,
        }),
      }
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const deleteClientFavorite = async (avisId, clientId) => {
  try {
    if (!avisId || !clientId) throw new Error("Missing required parameters");

    const data = await fetch(
      `/api/${API_VERSION}/client/favoris?client=${clientId}&avis=${avisId}`,
      {
        method: "DELETE",
      }
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const deleteAssistantFavorite = async (avisId, assistantId) => {
  try {
    if (!avisId || !assistantId) throw new Error("Missing required parameters");

    const data = await fetch(
      `/api/${API_VERSION}/assistant/favoris/${avisId}?assistant=${assistantId}`,
      {
        method: "DELETE",
      }
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const getClientFavorites = async (clientId) => {
  try {
    if (!clientId) throw new Error("Missing clientId");

    const data = await fetch(
      `/api/${API_VERSION}/client/favoris?client=${clientId}`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const getAssistantFavorites = async (assistantId) => {
  try {
    if (!assistantId) throw new Error("Missing assistantId");

    const data = await fetch(
      `/api/${API_VERSION}/assistant/favoris?assistant=${assistantId}`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const getConversation = async (userId, type) => {
  try {
    if (!userId || !type) throw new Error("Missing required parameters");

    const data = await fetch(
      `/api/${API_VERSION}/conversation?user=${userId}&type=${type}`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};
export const getConversationsInProject = async (userId, type, projectId) => {
  try {
    if (!userId || !type) throw new Error("Missing required parameters");
    const PAGE = "mes-projets";

    const data = await fetch(
      `/api/${API_VERSION}/conversation?user=${userId}&type=${type}&project=${projectId}&page=${PAGE}`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const getNotViewedConversation = async (userId, type) => {
  try {
    if (!userId || !type) throw new Error("Missing required parameters");

    const data = await fetch(
      `/api/${API_VERSION}/conversation/count?user=${userId}&type=${type}`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const updateAssistantChoice = async (assistantId, choice, avisId) => {
  try {
    if (!assistantId || !choice || !avisId)
      throw new Error("Missing required parameters");

    const data = await fetch(
      `/api/${API_VERSION}/assistant/avis/${avisId}?choice=${choice}&assistant=${assistantId}`,
      { method: "PATCH" }
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};
export const updateAssistantAvis = async (assistantId, avisId) => {
  try {
    if (!assistantId || !avisId) throw new Error("Missing required parameters");

    const data = await fetch(
      `/api/${API_VERSION}/assistant/avis/${avisId}?assistant=${assistantId}&isNew=${false}`,
      { method: "PATCH" }
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const searchClientFavorite = async (avisId, clientId) => {
  try {
    if (!avisId || !clientId) throw new Error("Missing required parameters");

    const data = await fetch(
      `/api/${API_VERSION}/client/favoris/${avisId}?client=${clientId}`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const searchUserBlocked = async (assistantId, clientId) => {
  try {
    if (!assistantId && !clientId)
      throw new Error("Missing required parameters");

    const data = await fetch(
      `${process.env.NEXT_PUBLIC_NODE_URL}/conversation/block?client=${clientId}&assistant=${assistantId}`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const fetchTimeLeft = async (projectId) => {
  try {
    if (!projectId) throw new Error("Missing projectId");

    const data = await fetch(
      `api/${API_VERSION}/timeleft?project=${projectId}`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const searchAssistantFavorite = async (avisId, assistantId) => {
  try {
    if (!avisId || !assistantId) throw new Error("Missing required parameters");

    const data = await fetch(
      `/api/${API_VERSION}/assistant/favoris/${avisId}?assistant=${assistantId}`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const getAssistantResponses = async (assistantId, projectId) => {
  try {
    if (!assistantId || !projectId)
      throw new Error("Missing required parameters");

    const data = await fetch(
      `/api/${API_VERSION}/assistant/avis/response?assistant=${assistantId}&project=${projectId}`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};
export const getFilters = async (userId) => {
  try {
    if (!userId) throw new Error("Missing required parameter");

    const data = await fetch(
      `/api/${API_VERSION}/${userId}/publication/filter`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};
export const hidePub = async (userId, pubId) => {
  try {
    if (!userId || !pubId) throw new Error("Missing required parameter");

    const data = await fetch(
      `/api/${API_VERSION}/${userId}/publication/${pubId}/hide`,
      {
        method: "POST",
      }
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};
export const unfollowUser = async (userId, unfollow) => {
  try {
    if (!userId || !unfollow) throw new Error("Missing required parameter");

    const data = await fetch(
      `/api/${API_VERSION}/${userId}/unfollow?unfollow=${unfollow}`,
      {
        method: "POST",
      }
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};
export const deletePub = async (userId, pubId) => {
  try {
    if (!userId || !pubId) throw new Error("Missing required parameter");

    const data = await fetch(
      `/api/${API_VERSION}/${userId}/publication/${pubId}`,
      {
        method: "DELETE",
      }
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};
export const searchPub = async (user, query, userId = "") => {
  try {
    if (!user || !query) throw new Error("Missing required parameter");

    const data = await fetch(
      `/api/${API_VERSION}/${user}/publication/search?query=${query}&userId=${userId}`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};
export const addFilters = async (userId, body) => {
  try {
    if (!userId || !body) throw new Error("Missing required parameters");

    const data = await fetch(
      `/api/${API_VERSION}/${userId}/publication/filter`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const sendAssistantResponses = async (assistantId, body) => {
  try {
    if (!assistantId || !body) throw new Error("Missing required parameters");

    const data = await fetch(
      `/api/${API_VERSION}/assistant/avis/response?assistant=${assistantId}`,
      {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        method: "POST",
      }
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};
export const createPublication = async (userId, body) => {
  try {
    if (!userId || !body) throw new Error("Missing required parameters");

    const data = await fetch(`/api/${API_VERSION}/${userId}/publication`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      method: "POST",
    }).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};
export const getPublication = async (userId, filter) => {
  try {
    if (!userId) throw new Error("Missing required parameters");

    const data = await fetch(
      `/api/${API_VERSION}/${userId}/publication?filter=${filter}`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const getAssistantResponses2 = async (
  projectId,
  assistantId,
  clientId
) => {
  try {
    if (!projectId || !assistantId || !clientId)
      throw new Error("Missing required parameters");

    const data = await fetch(
      `/api/${API_VERSION}/client/projet/${projectId}/response?assistant=${assistantId}&client=${clientId}`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const getMessages = async (
  assistantId,
  clientId,
  projectId,
  userType
) => {
  try {
    if (!assistantId || !clientId || !projectId || !userType)
      throw new Error("Missing required parameters");

    const data = await fetch(
      `${process.env.NEXT_PUBLIC_NODE_URL}/conversation/get?assistant=${assistantId}&client=${clientId}&projectId=${projectId}&userType=${userType}`
    ).then((r) => r.json());
    return data;
  } catch (error) {
    return { error };
  }
};

export const getAssistantProjectController = async (params) => {
  try {
    const { clientId, projectId, assistantId } = params;
    if (!clientId || !projectId || !assistantId)
      throw new Error("Missing required parameters");

    return await fetch(
      `api/projet/${clientId}/${projectId}/${assistantId}`
    ).then((r) => r.json());
  } catch (error) {
    return { error };
  }
};

export const deleteConversation = async (user, userType, convId) => {
  try {
    if (!user || !userType || !convId)
      throw new Error("Missing required parameters");

    return await fetch(
      `api/${API_VERSION}/conversation?user=${user}&type=${userType}&conversation=${convId}`,
      {
        method: "PATCH",
      }
    ).then((r) => r.json());
  } catch (error) {
    return { error };
  }
};
