const {client, createTables, createUser, createGoal, knockoutGoal, fetchUser, fetchGoals, updateGoal, deleteUser, deleteGoals} = require('./database');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require('bcrypt');




app.post('/api/register', async(req,res,next)=> {
    try {
        const checkUser = await fetchUser(req.body.email);
        if(!checkUser) {
            const newUser = await createUser(req.body);
        const token = jwt.sign(newUser.id, process.env.SECRET);
        res.send({token, newUser});
        } else {
            res.send("User already exists!")
        }
    } catch(ex){
        next(ex); 
    } 
});

app.post('/api/login', async(req,res,next)=> {
    try {
        const checkUser = await fetchUser(req.body.email);
        if(!checkUser) {
            res.send("Login failed");
        } else if (!(await bcrypt.compare(req.body.password, checkUser.password))) {
            res.send("Login failed");
        } else {
            const token = jwt.sign(checkUser.id, process.env.SECRET);
            res.send({token, checkUser});
        }
    } catch(ex){
        next(ex); 
    } 
});

app.get('/api/auth', async(req,res,next)=>{
  try {
      const token = req.headers['authorization'].split(' ')[1];
      if (!token) {
          res.send("request failed");
      }
      jwt.verify(token, process.env.SECRET, (err, decoded)=>{
        if (err) {
         res.sendStatus(403);
        }
        res.send(decoded);
      });
  } catch(ex){
    next(ex);
  }

});

app.post('/api/user/:id/goal', async(req, res, next)=> {
    try {
      res.status(201).send(await createGoal({ user_id: req.params.id, goal: req.body.goal}));
    }
    catch(ex){
      next(ex);
    }
  });

app.get('/api/:id/mygoals', async(req, res, next)=> {
    try {
      res.send(await fetchGoals(req.params.id));
    }
    catch(ex){
      next(ex);
    }
  });

app.patch('/api/goal/:id', async(req, res, next)=>{
    try {
        res.status(201).send(await updateGoal({goal_id: req.params.id, goal: req.body.fixedGoal}));
    } catch(ex){
        next(ex);
    }
});  

app.delete('/api/user/:userId/goal/:id', async(req, res, next)=> {
    try {
      await knockoutGoal({ id: req.params.id, user_id: req.params.userId });
      res.sendStatus(204);
    }
    catch(ex){
      next(ex);
    }
  });

  app.delete('/api/user/:userId', async(req, res, next)=> {
        try {
            await deleteUser({ user_id: req.params.userId });
            res.sendStatus(204);
          }
          catch(ex){
            next(ex);
          }
  });

  app.delete('/api/goal/:userID', async(req, res, next)=> {
    try {
        await deleteGoals({ user_id: req.params.userID });
        res.sendStatus(204);
      }
      catch(ex){
        next(ex);
      }
});

    const init = async()=> {
    await client.connect();
    console.log('connected to database');
    await createTables();
  
    const port = 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  
  };
  
  init();
