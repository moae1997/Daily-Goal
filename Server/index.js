const {client, createTables, createUser, createGoal, knockoutGoal, fetchUser, fetchGoals, updateGoal, deleteUser, deleteGoals} = require('./database');
const express = require('express');
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
const SECRET = "fmyumchsymxgnbfgtmugfnym";




app.post('/api/register', async(req,res,next)=> {
    try {
        const checkCustomer = await fetchUser(req.body.email);
        if(!checkCustomer) {
            const newCostomer = await createUser(req.body);
        const token = jwt.sign(newCostomer.id, SECRET);
        res.send({token, newCostomer});
        } else {
            res.send("try logging in!")
        }
    } catch(ex){
        next(ex); 
    } 
});

app.post('/api/login', async(req,res,next)=> {
    try {
        const checkCustomer = await fetchUser(req.body.email);
        if(!checkCustomer) {
            res.send("Sorry, you are not a user, try signing up");
        } else if (!(await bcrypt.compare(req.body.password, checkCustomer.password))) {
            res.send("try logging in!")
        } else {
            const token = jwt.sign(checkCustomer.id, SECRET);
            res.send({token, checkCustomer});
        }
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
        res.status(201).send(await updateGoal({goal_id: req.params.id, goal: req.body.goal}));
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

  app.delete('/api/user/:userID', async(req, res, next)=> {
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
