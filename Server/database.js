const pg = require('pg');
const client = new pg.Client('postgres://localhost/daily_goal_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const createTables = async()=> {
    const SQL = `
      DROP TABLE IF EXISTS goals;  
      DROP TABLE IF EXISTS users;
      CREATE TABLE users(
        id UUID PRIMARY KEY,
        username VARCHAR(20) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
      CREATE TABLE goals(
        id UUID PRIMARY KEY,
        goal VARCHAR(255),
        user_id UUID REFERENCES users(id) NOT NULL,
        CONSTRAINT unique_user UNIQUE (user_id)
      );
    `;
    await client.query(SQL);
  };

  const createUser = async({ username, email, password})=> {
    const SQL = `
      INSERT INTO users(id, username, email, password) VALUES($1, $2, $3, $4) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), username, email, await bcrypt.hash(password, 5)]);
    return response.rows[0];
  };

  const createGoal = async({ user_id, goal })=> {
    const SQL = `
      INSERT INTO goals(id, user_id, goal) VALUES($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), user_id, goal]);
    return response.rows[0];
  };

  const knockoutGoal = async({ user_id, id })=> {
    const SQL = `
      DELETE FROM goals WHERE user_id=$1 AND id=$2
    `;
    await client.query(SQL, [user_id, id]);
  };

  const fetchUser = async(email) => {
    const SQL = `
      SELECT * FROM users
      WHERE email = $1
    `;
    const response = await client.query(SQL, [email]);
    return response.rows[0];
  }

  const fetchGoals = async(user_id)=> {
    const SQL = `
      SELECT * FROM goals where user_id = $1
    `;
    const response = await client.query(SQL, [user_id]);
    return response.rows;
  };

  const updateGoal = async({goal_id, goal})=> {
    const SQL = `
    UPDATE goals
    SET goal = $1
    WHERE id = $2 
    RETURNING *;
    `;
    const response = await client.query(SQL, [ goal, goal_id ]);
    return response.rows[0];
  }

  const deleteUser = async({ user_id })=> {
    const SQL = `
      DELETE FROM users WHERE id=$1;
    `;
    await client.query(SQL, [user_id]);
  };

  const deleteGoals = async({ user_id })=> {
    const SQL = `
      DELETE FROM goals WHERE id=$1;
    `;
    await client.query(SQL, [user_id]);
  };



module.exports = {
    client,
    createTables,
    createUser,
    createGoal,
    knockoutGoal,
    fetchUser,
    fetchGoals,
    updateGoal,
    deleteUser,
    deleteGoals
};