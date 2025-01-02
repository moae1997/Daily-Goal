const baseURL = "http://localhost:3000/api"

export const getUserGoals = async ({user}) => {
    try {
        const response = await fetch(`${baseURL}/${user}/mygoals`);
    if (!response.ok) throw new Error('Failed to show user goals');
    return response.json();
    } catch(err) {
        return "This is an error";
    }

};

export const registerUser =  async ({username, email, password}) => {
    const response = await fetch(`${baseURL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username, email, password}),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
};

export const setGoal = async ({user, goal}) => {
    const response = await fetch(`${baseURL}/user/${user}/goal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({goal}),
    });
    if (!response.ok) throw new Error('You are not logged in!!');
    return response.json();
};


export const authenticateUser = async ({email, password}) => {
    const response = await fetch(`${baseURL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email, password}),
    });
    if (!response.ok) throw new Error('Failed to login user');
    return response.json();
};

export const updateGoal = async ({editId, fixedGoal}) => {
    const response = await fetch(`${baseURL}/goal/${editId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({fixedGoal}),
    });
    if (!response.ok) throw new Error('Did not update');
    return response.json();
};

export const deleteGoal = async ({user, goalId}) => {
    const response = await fetch(`${baseURL}/user/${user}/goal/${goalId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete player');
    return response;
};

export const deleteGoals = async ({userId}) => {
    const response = await fetch(`${baseURL}/goal/${userId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete player');
    return response;
};

export const deleteUser = async ({userId}) => {
    const response = await fetch(`${baseURL}/user/${userId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete player');
    return response;
};


export async function authenticate({Token}) {

    try {
        const response = await fetch(`${baseURL}/auth`, {
            headers: {
              'Content-Type': 'application/json',  
              'Authorization': `Bearer ${Token}`
            },
          });
           return response;
    } catch(error) {
        return error;
    }

}