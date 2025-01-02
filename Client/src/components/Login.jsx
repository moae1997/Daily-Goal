import { useState, useEffect } from "react";
import { authenticate, authenticateUser } from "../api/apiFetch";
import { useNavigate } from "react-router-dom";



export default function Login({signup}) {
    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const Token = localStorage.getItem('token');

  useEffect(()=> {
      try {
        if(Token !== null) {
          navigate('/dashboard');
        }
      } catch(err){
        console.log(err);
      }
  }, [])

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await authenticateUser({email, password});
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', data.checkUser.id);
            setEmail('');
            setpassword('');
          } catch (error) {
            console.error('Failed to login user:', error);
            setError(error.message || 'Failed to login user');
          } finally {
            setLoading(false);
            navigate('/dashboard')
          }
    }

    const switchToSignUp = () => {
        signup(true)
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
            {error && <p className="error">{error}</p>} 
            <label>Email:</label><input type="text" onChange={(event) => {setEmail(event.target.value)}} value={email} required/>
            <label>Password:</label><input type="text" onChange={(event) => {setpassword(event.target.value)}} value={password} required/>
            <button type="submit">{loading ? 'Registering...' : 'Submit'}</button>
            <p>Don't have an account? <span onClick={switchToSignUp}>SignUp</span></p>
            </form>
        </div>
    )


}