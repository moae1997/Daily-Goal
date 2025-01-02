import { setGoal } from "../api/apiFetch";
import { useState, useEffect, React } from "react";
import { getUserGoals, authenticate } from "../api/apiFetch";
import ShowGoals from "./ShowGoals";
import { useNavigate } from "react-router-dom";

export default function SetGoal() {

    const [goal, setYourGoal] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [goalList, setGoalList] = useState([]);
    const navigate = useNavigate();
    
    const user = localStorage.getItem('user');
    const Token = localStorage.getItem('token');


  
    useEffect(() => {
        try {
            if (Token === null) {
                navigate('/authenticate')
            } else {
                authenticate({Token}).then((response)=>{
                    if (response.status === 403) {
                        localStorage.clear();
                        navigate('/authenticate');
                    }
                    try {
                        getUserGoals({user}).then((res)=>{
                            if (res === "This is an error") {
                                localStorage.clear();
                                navigate('/authenticate');
                            }
                            setGoalList(res);
                        })
                    } catch(err) {
                        localStorage.clear();
                        navigate('/authenticate');
                    }   
                })
                    
            }
        } catch(err) {
            localStorage.clear();
            navigate('/authenticate');
        }
          
    }, []);

    const handleGoal = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await setGoal({user, goal});
            getUserGoals({user}).then(setGoalList)
            setYourGoal('');
          } catch (error) {
            setError(error.message || 'Please login before adding a goal');
            localStorage.clear();
            navigate('/authenticate');
          } finally {
            setLoading(false);
          }
    }

    return (
        <div>
            <form onSubmit={handleGoal}>
            {error && <p className="error">{error}</p>} 
            <label>What are your goals for today:</label><input type="text" onChange={(event) => {setYourGoal(event.target.value)}} value={goal} placeholder="goal..." required/>
            <button type="submit">{loading ? 'Adding...' : 'Set'}</button>
            </form>
            <ShowGoals goalList={goalList} setGoalList={setGoalList}/>
      </div>
    )
}