export const API_URL = import.meta.env.VITE_API_URL;

export async function signUp(data) {
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

        return response;
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

export async function createMeeting(updates, token) {
    try {
        const response = await fetch(`${API_URL}/meeting`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });
        if (!response.ok) {
            throw new Error("Failed to post meeting: ", await response.text());
        }
        return response;
    } catch (error) {
        console.error("Error in meeting creation :", error);
        throw error;
    }
}

export async function getUserMeetings(username, token) { //this
    try {
        const response = await fetch(`${API_URL}/meeting/user/${username}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        })
        if(!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to get user meetings: ${errorMessage}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error("Try failed on getting user meeting: ", error);
    }
}

export async function updateUserInvitationStatus(userEmail, status, meetingId, token) {
    try {
        const response = await fetch(`${API_URL}/meeting/${meetingId}/invite`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ userEmail, status })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to update invitation: ${errorMessage}`);
        }

        return response;  // Always return response
    } catch (error) {
        console.error("Error updating invitation:", error);
        return null;  // Explicitly return null to avoid undefined errors
    }
}

export async function updateEvent(meetingId, updates, token) {
    try {
        const response = await fetch(`${API_URL}/meeting/${meetingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });
        if (!response.ok) {
            throw new Error("Failed to post meeting: ", await response.text());
        }
        return response;
    } catch (error) {
        console.log("Error in updating the meeting: ", error);
    }
}

export async function DeleteEvent(meetingId, token, userEmail, userId) {
    try {
        const response = await fetch(`${API_URL}/meeting/${meetingId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ userEmail, userId })
        })

        return response;
    } catch (error) {
        console.error("Error trying to delete event: ", error)
    }
}