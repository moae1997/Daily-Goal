import React from "react";
import { useState } from "react";
import { registerUser } from "../api/apiFetch";



export default function Register({signup}) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await registerUser({username, email, password});
            setUsername('');
            setEmail('');
            setpassword('');
          } catch (error) {
            console.error('Failed to create user:', error);
            setError(error.message || 'Failed to create user');
          } finally {
            setLoading(false);
            signup(false);
          }
    }

    const switchToLogin = () => {
        signup(false)
    }

    return (
        <div>
            <form onSubmit={handleRegister}>
            {error && <p className="error">{error}</p>} 
            <label>Username:</label><input type="text" onChange={(event) => {setUsername(event.target.value)}} value={username} required/>
            <label>Email:</label><input type="text" onChange={(event) => {setEmail(event.target.value)}} value={email} required/>
            <label>Password:</label><input type="text" onChange={(event) => {setpassword(event.target.value)}} value={password} required/>
            <button type="submit">{loading ? 'Registering...' : 'Submit'}</button>
            <p>Already have an account? <span onClick={switchToLogin}>Login</span></p>
            </form>
        </div>
    )


}