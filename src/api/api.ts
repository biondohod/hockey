import axios from "axios";
const URL_BASE = "https://proj.raitonobe.ru/api/";

export const createUserAccount = async (user: INewUser | IEditUser | INewUserAdmin) => {
  const response = await axios.post(`${URL_BASE}register`, user);
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${URL_BASE}login`, { email, password });
  return response.data;
};

export const getCurrentUser = async (
  id: string | number | null | undefined,
  token: string | null
) => {
  if (!id || !token) return null;
  const response = await axios.get(`${URL_BASE}users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getUser = async (
  id: string | number | null | undefined,
  token: string | null
) => {
  if (!id || !token) return null;
  const response = await axios.get(`${URL_BASE}users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createCompetition = async (
  competition: IFormattedCompetition,
  token: string | null
) => {
  if (!token) return null;
  const response = await axios.post(`${URL_BASE}competitions`, competition, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getCompetitions = async (offset: number | string, limit: number | string) => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.get(`${URL_BASE}competitions?limit=${limit}&offset=${offset}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getCompetition = async (id: number) => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.get(`${URL_BASE}competitions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateCompetition = async (
  id: number,
  competition: IEditCompetition
) => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.patch(
    `${URL_BASE}competitions/${id}`,
    competition,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const registerForCompetition = async (competitionId: number) => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.post(
    `${URL_BASE}competitions/${competitionId}/registrations`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const cancelRegistration = async (competitionId: number) => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.delete(
    `${URL_BASE}competitions/${competitionId}/registrations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getCompetitionRegistrations = async (competitionId: number) => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.get(
    `${URL_BASE}competitions/${competitionId}/registrations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateProfile = async (user: INewUser | IEditUser) => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.patch(`${URL_BASE}users`, user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateProfileAsAdmin = async (
  id: number | string,
  user: IEditUser
) => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.patch(`${URL_BASE}users/${id}`, user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getRoles = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.get(`${URL_BASE}roles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateRegistration = async (
  playerId: number,
  competitionId: number,
  data: IUpdateRegistration
) => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.patch(
    `${URL_BASE}competitions/${competitionId}/registrations/${playerId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getCompetitionMatches = async (
  competitionId: number,
  offset: number | string,
  limit: number | string
) => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.get(
    `${URL_BASE}competitions/${competitionId}/matches?limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const uploadDocument = async (document: DocumentForm) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("document", document.document);
  formData.append("name", document.name);
  if (!token) return null;
  const response = await axios.post(`${URL_BASE}documents`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getUserDocuments = async (userId: number) => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.get(`${URL_BASE}users/${userId}/documents`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getDocumentUrl = async (
  documentId: number
): Promise<IDocumentUrl | null> => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.get(`${URL_BASE}documents/${documentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getUsersAsAdmin = async (
  roleId: number,
  limit: number | string,
  offset: number | string
): Promise<IAllUsersByRole | null> => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.get(
    `${URL_BASE}users?limit=${limit}&offset=${offset}&role_id=${roleId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const creatUserAsAdmin = async (user: INewUser) => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.post(`${URL_BASE}users`, user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.delete(`${URL_BASE}users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteDocument = async (documentId: number) => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.delete(`${URL_BASE}documents/${documentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getUserRegistrations = async (
  id: number,
  offset: number | string,
  limit: number | string
): Promise<IUserRegistrations | null> => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.get(
    `${URL_BASE}users/${id}/registrations?limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const editMatchScore = async (
  competitionId: number,
  matchId: number,
  leftScore: number,
  rightScore: number
) => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.patch(
    `${URL_BASE}competitions/${competitionId}/matches/${matchId}`,
    { left_score: leftScore, right_score: rightScore },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteCompetition = async (competitionId: number) => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.delete(
    `${URL_BASE}competitions/${competitionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getCompetitionScores = async (CompetitionId: number): Promise<ICompetitionScore[] | null> => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const response = await axios.get(
    `${URL_BASE}competitions/${CompetitionId}/scores`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
