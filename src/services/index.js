export const API_URL = import.meta.env.VITE_API_URL;

export async function signUp({ data }) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response;
};

export async function login({ data }) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response;
};

// export async function setUser({ data }) {
//     const response = await fetch(`${API_URL}/user`, {
//         method: 'PUT',
//         body: JSON.stringify(data),
//         headers: {
//             "Content-Type": "application/json"
//         }
//     });
//     return response
// }

export const updateUser = async (token, updates) => {
    try {
        const response = await fetch(`${API_URL}/user`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            const errorMessage = await response.text();  // Get actual error message
            throw new Error(`Failed to update user data: ${errorMessage}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating user data:", error);
        throw error;
    }
};

export async function getUser(token) {
    try {
        const response = await fetch(`${API_URL}/user`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch user data")
        }
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}