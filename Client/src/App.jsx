import Register from "./components/Register"
import SetGoal from "./components/SetGoal"
import Login from "./components/Login"
import { useState, React } from "react"
import { Route, Routes } from "react-router-dom";


function App() {
    const [signUp, setSignUp] = useState(false);

    return (
        <Routes>
            <Route path="/authenticate" element={signUp? <Register  signup={setSignUp} /> : <Login signup={setSignUp} />} />
            <Route path="/dashboard" element={<SetGoal />}/>
        </Routes>
       
    )
    
}

export default App
