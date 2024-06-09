import axios from "axios";

const URL_BASE = "https://proj.raitonobe.ru/api/";

export const createUserAccount = async (user: INewUser) => {
    const response = await axios.post(`${URL_BASE}register`, user);
    return response.data;
};

export const loginUser = async (email: string, password: string) => {
    const response = await axios.post(`${URL_BASE}login`, {email, password});
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

export const getCompetitions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const response = await axios.get(`${URL_BASE}competitions`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.competitions;
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

export const updateCompetition = async (id: number, competition: IEditCompetition) => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const response = await axios.patch(`${URL_BASE}competitions/${id}`, competition, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const registerForCompetition = async (competitionId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const response = await axios.post(`${URL_BASE}competitions/${competitionId}/registrations`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const cancelRegistration = async (competitionId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const response = await axios.delete(`${URL_BASE}competitions/${competitionId}/registrations`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}
