import { MdDone } from "react-icons/md";
import { IoMdRemoveCircle } from "react-icons/io";
import { MdEdit, MdCancel } from "react-icons/md";
import { GoFileSubmodule } from "react-icons/go";
import { IoArrowUndoCircleSharp } from "react-icons/io5";
import { useState } from "react";
import { updateGoal, getUserGoals, deleteGoal } from "../api/apiFetch";



export default function ShowGoals({goalList, setGoalList}) {

    const [editId, setEditId] = useState(null)
    const [doneId, setDoneId] = useState(null)
    const [fixedGoal, setFixedGoal] = useState('');

    const user = localStorage.getItem('user');


    const handleUpdatedGoal = async (e) => {
        e.preventDefault();
        try{
            updateGoal({editId, fixedGoal}).then(()=>{
                getUserGoals({user}).then(setGoalList);
            })
            
        } catch(err) {
            setEditId(null);
            setFixedGoal('')
        } finally {
            setEditId(null);
            setFixedGoal('')
        }
       
        
    }

    const handleCancel = (e)=> {
        e.preventDefault();
        setEditId(null);
    }

    const handleDelete = async (goalId)=> {
       deleteGoal({user, goalId}).then(()=>{
        getUserGoals({user}).then(setGoalList);
       })

    }

    return (
        <>
        {goalList.map((go)=>{ return ( 
          <div key={go.id}>
            {editId === go.id ? 
            <form onSubmit={handleUpdatedGoal}>
                <label><span>Change</span> {go.goal}: </label>
                <input type="text" onChange={(event) => {setFixedGoal(event.target.value)}} value={fixedGoal} required/>
                <button type="submit"><GoFileSubmodule size={13}/></button>
                <button onClick={handleCancel}><IoMdRemoveCircle size={13}/></button>
            </form> 
            : 
            <div>
                {doneId === go.id ? 
                    <h2 className="slash">{go.goal}</h2> 
                : 
                    <h2>{go.goal}</h2>
                }
                {doneId === go.id ? 
                    <button onClick={()=>{setDoneId(null)}}><IoArrowUndoCircleSharp size={24}/></button> 
                : 
                    <button onClick={()=>{setDoneId(go.id)}}><MdDone size={24}/></button>
                }
                <button onClick={()=>{setEditId(go.id)}}><MdEdit size={24}/></button>
                <button onClick={()=>{handleDelete(go.id)}}><MdCancel size={24}/></button>
            </div>}
          </div>
        )})}
        </>
    )
}

