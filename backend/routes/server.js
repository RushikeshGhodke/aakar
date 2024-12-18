import express from "express";
import { connection } from "../db/index.js";
const app = express.Router();

// Login API to check if employeeId exists
app.post('/api/login', (req, res) => {
  const { employeeId } = req.body; // Get employeeId from the request body

  if (!employeeId) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  // SQL query to fetch employee, department, and designation details
  const query = `
    SELECT e.employeeId, d.departmentId, des.designationId
    FROM employee e
    JOIN employeeDesignation ed ON e.employeeId = ed.employeeId
    JOIN department d ON ed.departmentId = d.departmentId
    JOIN designation des ON ed.designationId = des.designationId
    WHERE e.employeeId = ?;
  `;

  connection.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // If no employee found
    if (results.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Employee found, return employee details
    const employeeData = results[0];
    res.json(employeeData);
  });
});


app.get('/skills/:departmentId', (req, res) => {
  const departmentId = req.params.departmentId;
  const query = `
  SELECT s.skillId, s.skillName ,s.departmentIdGivingTraining, s.skillDescription ,d.departmentName
  FROM skill s
  INNER JOIN department d ON d.departmentId = s.departmentIdGivingTraining 
  WHERE s.departmentId = ? AND skillActivityStatus = 1;
  `
  connection.query(query, [departmentId], (err, result) => {
    if (err) throw err;
    res.send(result);
    console.log(result);
  });
});


app.get('/get-all-skills', (req, res) => {
  const query = `
    SELECT skillId, skillName 
    FROM skill
    WHERE skillActivityStatus = 1`; // Ensuring we get only active skills

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching all skills:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    // Return skills in the desired format
    const skills = results.map(skill => ({
      id: skill.skillId,
      label: skill.skillName, // Adjust based on what your frontend expects
    }));

    res.json({ skills }); // Return all skills in a consistent format
  });
});


app.put('/skills/:skillId/deactivate', (req, res) => {
  const skillId = req.params.skillId;
  const sql = 'UPDATE skill SET skillActivityStatus = 0 WHERE skillId = ?';

  connection.query(sql, [skillId], (err, result) => {
    if (err) {
      console.error('Error deactivating skill:', err);
      return res.status(500).send('Failed to deactivate skill.');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Skill not found.');
    }

    res.send('Skill deactivated successfully.');
  });
});


app.get('/departments', (req, res) => {
  connection.query('SELECT departmentId, departmentName FROM department', (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});


app.get('/skills/:departmentId', (req, res) => {
  const departmentId = req.params.departmentId;
  connection.query('SELECT skillId, skillName ,departmentIdGivingTraining, skillDescription FROM skill WHERE departmentId = ? AND skillActivityStatus = 1', [departmentId], (err, result) => {
    if (err) throw err;
    res.send(result);
    console.log(result);
  });
});


app.get('/skills', (req, res) => {
  connection.query('SELECT * FROM skill WHERE skillActivityStatus = ?', [true], (err, result) => {
    if (err) throw err;
    res.json(result);
    console.log(result);
  });
});

// app.get('/get-skills-by-department/:departmentId', (req, res) => {
//   const departmentId = req.params.departmentId;

//   const query = `
//     SELECT skillId, skillName 
//     FROM skill 
//     WHERE departmentId = ?`;
  
//   connection.query(query, [departmentId], (err, results) => {
//     if (err) {
//       console.error('Error fetching skills:', err);
//       return res.status(500).json({ error: 'Server error' });
//     }

//     // Return skills in the desired format, ensuring it has skillName
//     const skills = results.map(skill => ({
//       id: skill.skillId,
//       label: skill.skillName, // If your autocomplete expects a 'label' property
//     }));

//     res.json({ skills }); // Ensure the response is an object with 'skills' property
//   });
// });

// app.get('/api/skills', async (req, res) => {
//   try {
//     const { departmentId } = req.query;

//     let query = 'SELECT * FROM skills';
//     let values = [];

//     if (departmentId) {
//       query += ' WHERE departmentId = $1 OR departmentName = $2';
//       values = [departmentId, 'Common'];
//     }

//     const result = await pool.query(query, values);

//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching skills:', error);
//     res.status(500).json({ error: 'An error occurred while fetching skills' });
//   }
// });

app.post('/fetch-data', (req, res) => {
  const { skillIds } = req.body;
  const placeholders = skillIds.map(() => '?').join(',');
  const query = 
  `SELECT e.employeeId, e.employeeName, es.skillId, es.grade, s.skillName
   FROM employee e JOIN employeeSkill es 
   ON e.employeeId = es.employeeId
   JOIN skill s ON es.skillId = s.skillId
   WHERE s.skillId IN (${placeholders})`;
  connection.query(query, skillIds, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});


app.get('/check-grade', (req, res) => {
  const { employeeId, skillId } = req.query;  // Use req.query for GET request parameters
  const query = 'SELECT COUNT(*) AS count FROM employeeSkill WHERE employeeId = ? AND skillId = ?';

  connection.query(query, [employeeId, skillId], (err, results) => {
    if (err) {
      console.error('Error checking grade:', err);  // Log the error
      return res.status(500).json({ error: 'Error checking grade.' });
    }
    res.json({ exists: results[0].count > 0 });
  });
});


app.post('/update-grade', (req, res) => {
  const { employeeId, skillId, grade } = req.body;

  const query = 
    `UPDATE employeeSkill 
     SET grade = ? 
     WHERE employeeId = ? AND skillId = ?`;

  connection.query(query, [grade, employeeId, skillId], (err, result) => {
    if (err) {
      console.error('Error updating grade:', err);
      return res.status(500).send('Failed to update grade');
    }
    res.send({ message: 'Grade updated successfully' });
  });
});


app.post('/add-grade', (req, res) => {
  const { employeeId, skillId, grade } = req.body;
  const query = 'INSERT INTO employeeSkill (employeeId, skillId, grade) VALUES (?, ?, ?)';
  connection.query(query, [employeeId, skillId, grade], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error adding grade.' });
    }
    res.status(201).json({ success: true });
  });
});


//fetch employees
// Add a route to fetch employees
app.get('/api/employees', (req, res) => {
  const query = `
    SELECT DISTINCT
      e.employeeId, 
      e.employeeName 
    FROM 
      employee e
    INNER JOIN 
      employeeSkill es ON e.employeeId = es.employeeId
    WHERE 
      es.grade = 4;
  `;

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).json({ error: 'Failed to fetch employees' });
    }

    res.json(result);
  });
});


//add training
app.post('/add-training', (req, res) => {
  const { trainingTitle, startTrainingDate, endTrainingDate, trainerId, skills } = req.body;

  const query = 'INSERT INTO training (trainingTitle, startTrainingDate, endTrainingDate, trainerId) VALUES (?, ?, ?, ?)';
  connection.query(query, [trainingTitle, startTrainingDate, endTrainingDate, trainerId], (err, result) => {
    if (err) {
      console.error('Error inserting training:', err);
      return res.status(500).send('Failed to insert training');
    }
    const trainingId = result.insertId;
    
    if (skills && skills.length > 0) {
      const skillQueries = skills.map(skill => {
        return new Promise((resolve, reject) => {
          const skillQuery = 'INSERT INTO trainingSkills (trainingId, skillId) VALUES (?, ?)';
          connection.query(skillQuery, [trainingId, skill.id], (err) => {  // Changed skill.id to skill
            if (err) {
              console.error('Error inserting skill:', err);
              reject(err);
            } else {
              resolve();
            }
            console.log(skill);  // Log skill instead of skill.id
          });
        });
      });
    }
  })})


app.get('/all-training', (req, res) => {
  const query = `
    SELECT t.trainingId, t.trainingTitle, t.startTrainingDate, t.endTrainingDate, e.employeeName AS trainerName, 
           GROUP_CONCAT(s.skillName SEPARATOR ', ') AS skills
    FROM training t
    LEFT JOIN employee e ON t.trainerId = e.employeeId
    LEFT JOIN trainingSkills ts ON t.trainingId = ts.trainingId
    LEFT JOIN skill s ON ts.skillId = s.skillId
    GROUP BY t.trainingId, t.trainingTitle, t.startTrainingDate, t.endTrainingDate, e.employeeName
  `;

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching training data:', err);
      res.status(500).json({ error: 'Failed to fetch training data' });
    } else {
      res.json(result);
    }
  });
});


app.put('/update-training/:trainingId', (req, res) => {
  const trainingId = req.params.trainingId;
  const { trainingTitle, trainerId, startTrainingDate, endTrainingDate, skills } = req.body;

  if (!trainingTitle || !trainerId || !startTrainingDate || !endTrainingDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const updateTrainingQuery = `
    UPDATE training
    SET trainingTitle = ?, trainerId = ?, startTrainingDate = ?, endTrainingDate = ?
    WHERE trainingId = ?;
  `;

  connection.query(
    updateTrainingQuery,
    [trainingTitle, trainerId, startTrainingDate, endTrainingDate, trainingId],
    (err, result) => {
      if (err) {
        console.error('Error updating training:', err);
        return res.status(500).json({ message: 'Error updating training details.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Training not found.' });
      }

      if (skills && skills.length > 0) {
        const deleteSkillsQuery = 'DELETE FROM trainingSkills WHERE trainingId = ?';
        connection.query(deleteSkillsQuery, [trainingId], (err) => {
          if (err) {
            console.error('Error deleting training skills:', err);
            return res.status(500).json({ message: 'Error updating training skills.' });
          }
          const insertSkillsQuery = `
            INSERT INTO trainingSkills (trainingId, skillId) VALUES ?`;

          const skillValues = skills.map(skill => [trainingId, skill.id]); // Fix applied here

          connection.query(insertSkillsQuery, [skillValues], (err) => {
            if (err) {
              console.error('Error inserting training skills:', err);
              return res.status(500).json({ message: 'Error updating training skills.' });
            }

            res.status(200).json({ message: 'Training and skills updated successfully.' });
          });
        });
      } else {
        res.status(200).json({ message: 'Training updated successfully, no skills provided.' });
      }
    }
  );
});


app.get('/search-training', (req, res) => {
  const searchTerm = req.query.q || '';
  console.log('Search Term:', searchTerm);

  const query = `
    SELECT t.trainingId, t.trainingTitle, t.startTrainingDate, t.endTrainingDate, e.employeeName AS trainerName, 
           GROUP_CONCAT(s.skillName SEPARATOR ', ') AS skills
    FROM training t
    LEFT JOIN trainingSkills ts ON t.trainingId = ts.trainingId
    LEFT JOIN skill s ON ts.skillId = s.skillId
    LEFT JOIN employee e ON e.employeeId = t.trainerId
    WHERE t.trainingTitle LIKE ? OR e.employeeName LIKE ?
    GROUP BY t.trainingId, t.trainingTitle, t.startTrainingDate, t.endTrainingDate, e.employeeName
  `;

  const searchPattern = `%${searchTerm}%`;

  connection.query(query, [searchPattern, searchPattern], (err, result) => {
    if (err) {
      console.error('Error searching training data:', err);
      return res.status(500).json({ error: 'Failed to search training data' });
    }

    res.json(result);
  });
});


app.delete('/delete-training/:trainingId', (req, res) => {
  const trainingId = req.params.trainingId;

  const deleteSkillsQuery = 'DELETE FROM trainingskills WHERE trainingId = ?';
  
  connection.query(deleteSkillsQuery, [trainingId], (err, skillResult) => {
    if (err) {
      console.error('Error deleting associated skills:', err);
      return res.status(500).send('Failed to delete associated skills');
    }

    const deleteSessionsQuery = 'DELETE FROM sessions WHERE trainingId = ?';

    connection.query(deleteSessionsQuery, [trainingId], (err, sessionResult) => {
      if (err) {
        console.error('Error deleting associated sessions:', err);
        return res.status(500).send('Failed to delete associated sessions');
      }

      const deleteTrainingQuery = 'DELETE FROM training WHERE trainingId = ?';
      connection.query(deleteTrainingQuery, [trainingId], (err, trainingResult) => {
        if (err) {
          console.error('Error deleting training:', err);
          return res.status(500).send('Failed to delete training');
        }

        res.send({ message: 'Training and associated sessions and skills deleted successfully' });
      });
    });
  });
});


// check box and grade
app.get('/get-assign-data', (req, res) => {
  const query = 'SELECT employeeId, skillId FROM selectedAssignTraining';
  
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error getting assignment data:', err);
      return res.status(500).json({ message: 'Error retrieving data', error: err });
    }
    res.send(result);
  });
});


app.post('/assign-training' , (req,res)=>{
  const {employeeId, employeeName, skillName, skillId, grade} = req.body;
  const query =  
  `INSERT INTO assignTraining (employeeId, employeeName, skillName, skillId, grade) VALUES (?, ?, ?, ?, ?)`;

  connection.query(query, [employeeId, employeeName, skillName, skillId, grade], (err, result) => {
    if (err) {
      console.error('Error assigning training:', err);
      return res.status(500).send('Failed to assign training');
    }
    res.send({message: 'Data inserted into assign_training successfully'});
  });
});


app.post("/deassign-training", (req, res) => {
  const { employeeId, skillId } = req.body;
  const query =
  `DELETE FROM assignTraining WHERE employeeId = ? AND skillId = ?`;

  connection.query(query, [employeeId, skillId], (err, result) => {
    if (err) {
      console.error('Error deassigning training:', err);
      return res.status(500).send('Failed to deassign training');
    }
    res.send({message: 'Data deleted from assign_training successfully'});
  });
});


app.post("/check-assign_training", (req, res) => {
  const { employeeId, skillId } = req.body;
  const query = `
    SELECT 1 
    FROM assignTraining 
    WHERE employeeId = ? AND skillId = ? 
    LIMIT 1`;

  connection.query(query, [employeeId, skillId], (err, result) => {
    if (err) {
      console.error('Error checking training status:', err);
      return res.status(500).send('Failed to check training status');
    }
    if (result.length > 0) {
      res.send({ exists: true });
    } else {
      res.send({ exists: false });
    }
  });
});


// Endpoint to handle bulk updates and deletions
app.post('/update-bulk', (req, res) => {
  const { newSelectedEmp, removeEmp, grades } = req.body;
  console.log(newSelectedEmp, removeEmp, grades)

  if (!Array.isArray(newSelectedEmp) || !Array.isArray(removeEmp) || !Array.isArray(grades)) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  // Begin transaction
  connection.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ message: 'Transaction error', error: err });
    }

    // Handle deletions
    if (removeEmp.length > 0) {
      const deleteQuery = 'DELETE FROM selectedAssignTraining WHERE employeeId = ? AND skillId = ?';
      removeEmp.forEach(item => {
        connection.query(deleteQuery, [item.employeeId, item.skillId], (err) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ message: 'Delete error', error: err });
            });
          }
        });
      });
    }

    // Handle new assignments
    if (newSelectedEmp.length > 0) {
      const insertQuery = 'INSERT INTO selectedAssignTraining (employeeId, skillId) VALUES (?, ?)';
      newSelectedEmp.forEach(item => {
        connection.query(insertQuery, [item.employeeId, item.skillId], (err) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ message: 'Insert error', error: err });
            });
          }
        });
      });
    }

    // Handle grade updates
    if (grades.length > 0) {
      const updateQuery = `
        INSERT INTO employeeSkill (employeeId, skillId, grade) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE grade = VALUES(grade)
      `;
      grades.forEach(({ employeeId, skillId, grade }) => {
        connection.query(updateQuery, [employeeId, skillId, grade], (err) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ message: 'Grade update error', error: err });
            });
          }
        });
      });
    }

    // Commit transaction
    connection.commit(err => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).json({ message: 'Commit error', error: err });
        });
      }
      res.status(200).json({ message: 'Bulk update successful' });
    });
  });
});


//start Session //
app.get('/training/sessions/:trainingId', (req, res) => {
  const trainingId = req.params.trainingId;
  const trainingQuery = `
  SELECT t.trainingTitle, empTrainer.employeeName AS trainerName, t.startTrainingDate, t.endTrainingDate FROM training t 
  LEFT JOIN employee empTrainer ON t.trainerId = empTrainer.employeeId
  WHERE t.trainingId = ?;`;

  const skillsQuery = `
    SELECT GROUP_CONCAT(skill.skillName SEPARATOR ', ') AS skills 
    FROM trainingSkills 
    JOIN skill ON trainingSkills.skillId = skill.skillId 
    WHERE trainingSkills.trainingId = ?`;

  connection.query(trainingQuery, [trainingId], (err, trainingResult) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (trainingResult.length === 0) {
      return res.status(404).send('Training session not found');
    }

    connection.query(skillsQuery, [trainingId], (err, skillsResult) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal Server Error');
      }

      const response = {
        ...trainingResult[0],
        skills: skillsResult[0].skills || '' 
      };
      res.send(response);
    });
  });
});


app.post('/api/sessions', (req, res) => {
  const { sessionName, sessionDate, sessionStartTime, sessionEndTime, trainingId } = req.body;
  const formattedDate = sessionDate;
  const query = 'INSERT INTO sessions (sessionName, sessionDate, sessionStartTime, sessionEndTime, trainingId) VALUES (?, ?, ?, ?, ?)';

  connection.query(query, [sessionName, formattedDate, sessionStartTime, sessionEndTime, trainingId], (err, results) => {
    if (err) {
      console.error('Error inserting session:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      sessionId: results.insertId,
      sessionName,
      sessionDate: formattedDate,
      sessionStartTime,
      sessionEndTime,
      trainingId,
    });
  });
});


app.delete('/api/sessions/:id', (req, res) => {
  const sessionId = req.params.id;
  const sql = 'DELETE FROM sessions WHERE sessionId = ?';

  connection.query(sql, [sessionId], (err, result) => {
    if (err) {
      console.error("Error deleting session:", err);
      return res.status(500).send('Server error');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Session not found');
    }
    res.send('Session deleted successfully');
  });
});


app.get('/training/all_sessions/:trainingId', (req, res) => {
  const trainingId = req.params.trainingId;
  const query = 'SELECT sessionId, sessionName, sessionDate, sessionStartTime, sessionEndTime FROM sessions WHERE trainingId = ?';
  
  connection.query(query, [trainingId], (err, result) => {
    if (err) {
      console.error('Error fetching session data:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result); 
  });
});


//give training
app.post('/skills/:departmentId', (req, res) => {
  const { skillName, skillDescription, departmentIdGivingTraining } = req.body;
  const deptId = req.params.departmentId;
  const query1 = `
    INSERT INTO skill (skillName, departmentId, skillDescription, departmentIdGivingTraining)
    VALUES (?, ?, ?, ?)`;

  connection.query(query1, [skillName, deptId, skillDescription, departmentIdGivingTraining], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error adding skill.' });
    }

    const skillId = results.insertId;
    const query2 = `
      INSERT INTO employeeSkill (employeeId, skillId, grade)
      SELECT employeeId, ?, 0
      FROM employeeDesignation
      WHERE departmentId = ?`;

    connection.query(query2, [skillId, deptId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error assigning skill to employees.' });
      }

      res.status(201).json({
        skillId,
        deptId,
        skillName,
        skillDescription,
        message: 'Skill added and assigned to employees successfully.'
      });
    });
  });
});


app.put('/skills/:currentSkill', (req, res) => {
  const { skillName, skillDescription, departmentIdGivingTraining } = req.body;
  const skillId = req.params.currentSkill;
  const query = 'UPDATE skill SET skillName = ?, skillDescription = ?, departmentIdGivingTraining = ? WHERE skillId = ?';
  
  connection.query(query, [skillName, skillDescription, departmentIdGivingTraining, skillId], (err, results) => {
    if (err) {
      console.error('Error updating skill:', err); 
      res.json({ skillId: skillId, skillName, skillDescription , departmentIdGivingTraining });
      return res.status(500).json({ error: 'Error updating skill.', details: err.message });
    }
    res.json({ skillId: skillId, skillName, skillDescription, departmentIdGivingTraining });
  });
});


app.put('/skills/:skillId/delete', (req, res) => {
  const skillId = req.params.skillId;
  connection.query('UPDATE skill SET skillActivityStatus = ? WHERE skillId = ?', [false, skillId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error deactivating skill.' });
    }
    res.status(204).end(); 
  });
});


// Auto-fetching emp data
app.get('/alreadyAssignedEmp',(req,res)=>{
  const query = `
  select e.employeeId,e.employeeName,st.skillId,s.skillName,es.grade
  from  selectedAssignTraining st 
  join employee e on st.employeeId = e.employeeId
  join skill s on st.skillId = s.skillId
  join employeeSkill es on st.employeeId = es.employeeId and st.skillId = es.skillId;`;
  
  connection.query(query,(err,result)=>{
    if(err){
      return res.status(500).json({error:'Errors fetching aleardy assigned training emp'});
    }
    res.send(result);
  })
})


app.get('/DeptGiveTraining',(req,res)=>{
  const query = 'SELECT * FROM selectedAssignTraining';
  connection.query(query,(err,result)=>{
    if(err){
      return res.status(500).json({error:'Errors fetching aleardy assigned training emp'});
    }
    res.send(result);
  })
})


//Give Training
app.get(`/GetDeptGiveTrainData/:dept_id`,(req,res) =>{
  const deptId = req.params.dept_id;
  const query = `SELECT at.employeeId, e.employeeName, s.skillName, es.skillId, es.grade 
    FROM selectedAssignTraining at
    JOIN employeeSkill es ON es.employeeId = at.employeeId AND es.skillId = at.skillId
    JOIN skill s ON at.skillId = s.skillId
    JOIN employee e ON e.employeeId = at.employeeId
    WHERE s.departmentIdGivingTraining = ?`;

    connection.query(query, [deptId], (err, result) => {
      if (err) {
        console.error('Error in fetching Department Giving Training', err);
        return res.status(500).json({ error: 'Error fetching data' });
      }
      console.log("Fetching department giving training", result);
      res.json(result);
    });
});


// department Giving Training 
app.get(`/GetDeptGiveTrainData/:dept_id/:skill_id?`, (req, res) => {
  const deptId = req.params.dept_id;
  const skillId = req.params.skill_id;
  const query = `SELECT at.employeeId, e.employeeName, s.skillName, es.skillId, es.grade 
  FROM selectedAssignTraining at
  JOIN employeeSkill es ON es.employeeId = at.employeeId AND es.skillId = at.skillId
  JOIN skill s ON at.skillId = s.skillId
  JOIN employee e ON e.employeeId = at.employeeId
  WHERE s.departmentIdGivingTraining = ? AND es.skillId = ?`;

  connection.query(query, [deptId, skillId], (err, result) => {
    if (err) {
      console.error('Error in fetching Department Giving Training by Skill', err);
      return res.status(500).json({ error: 'Error fetching data' });
    }
    console.log("Fetching department giving training by skill", result);
    res.json(result);
  });
  } 
);


// Getting skill names which give training by particular department
app.get(`/DepartmentGiveTskills/:dept_id`,(req,res)=>{
  const deptId = req.params.dept_id;
  const query = `SELECT * FROM skill where  departmentIdGivingTraining = ?`
  connection.query(query,[deptId],(err,result)=>{
    if(err){
      console.error('Error in fetching Skill Training by Departmment', err);
        return res.status(500).json({ error: 'Error fetching data' });
    }
    res.json(result);
    console.log('DepartmentGiveTskills',result);
  })
})


app.get(`/GetEmpFormRegister`,(req,res) =>{
  connection.query(`select * from trainingRegistration`,(err,result)=>{
    if(err){
      console.error("Geting error from emp register ",err)
      return res.status(500).json({ error: 'Error fetching data from registration' });
    }
    res.json(result);
    console.log('Emp from Registration .',result);
  })
})


// Endpoint to fetch employee's training details
app.get('/employee/:employeeId', (req, res) => {
  const employeeId = req.params.employeeId;
  const query = `SELECT t.trainingTitle, t.trainingId, e.employeeName, t.startTrainingDate, t.endTrainingDate, empTrainer.employeeName AS trainerName
    FROM training t
    JOIN trainingRegistration tr ON t.trainingId = tr.trainingId
    JOIN employee e ON tr.employeeId = e.employeeId
    LEFT JOIN employee empTrainer ON t.trainerId = empTrainer.employeeId
    WHERE tr.employeeId = ?;`;

  connection.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error("Error fetching employee's training details: ", err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});


//attendence display in ManegerPOV
app.get('/api/sessions/attendance/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  const sql = `SELECT e.employeeName, IF(a.attendanceStatus IS NULL, 0, a.attendanceStatus) as attendanceStatus
    FROM trainingRegistration tr
    JOIN sessions s ON tr.trainingId = s.trainingId
    LEFT JOIN attendance a ON tr.employeeId = a.employeeId AND a.sessionId = ?
    JOIN employee e ON tr.employeeId = e.employeeId
    WHERE s.sessionId = ?`;

  connection.query(sql, [sessionId, sessionId], (err, results) => {
    if (err) {
      console.error('Error fetching attendance:', err.message);
      return res.status(500).json({ error: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this session.' });
    }

    res.json(results); 
  });
});


// Api for fetching Attendence data in EmployeePOV
app.get('/api/attendance', (req, res) => {
  const { employeeId, sessionId } = req.query;

  connection.query('SELECT attendanceStatus FROM attendance WHERE employeeId = ? AND sessionId = ?', [employeeId, sessionId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      res.json({ attendanceStatus: results[0].attendanceStatus });
    } else {
      res.json({ attendanceStatus: null }); // Return null if no record found
    }
  });
});


app.post('/send-multiple-emps-to-trainings', (req, res) => {
  const { trainingId, selectedEmployees } = req.body;
  if (!trainingId || !selectedEmployees || !selectedEmployees.length) {
    return res.status(400).json({ error: 'Missing trainingId or selectedEmployees' });
  }

  const values = selectedEmployees.map(employeeId => [employeeId, trainingId]);
  const query = 'INSERT INTO trainingRegistration (employeeId, trainingId) VALUES ?';

  connection.query(query, [values], (err, results) => {
    if (err) {
      console.error('Error inserting employees into trainings:', err);
      return res.status(500).json({ error: 'Database insertion failed' });
    }
    console.log('Inserted employees into trainings:', results);
    res.status(200).json({ message: 'Employees added to trainings successfully' });
  });
});


//Trainer
// Endpoint to fetch trainer's training details
app.get('/TrainerPov/:employeeId', (req, res) => {
  const trainerId = req.params.employeeId;
  const query = `SELECT t.trainingId, t.trainingTitle, t.startTrainingDate, t.endTrainingDate, empTrainer.employeeName AS trainerName
    FROM training t
    LEFT JOIN employee empTrainer ON t.trainerId = empTrainer.employeeId
    WHERE t.trainerId = ?;`;

  connection.query(query, [trainerId], (err, results) => {
      if (err) {
          console.error(err);
          res.status(500).send("Database query error");
      } else if (results.length === 0) {
          res.status(404).send("No trainings found for the given trainer");
      } else {
          res.json(results);
      }
  });
});


// Endpoint to fetch employees enrolled in a specific training
app.get('/employeesEnrolled/:trainingId', (req, res) => {
  const trainingId = req.params.trainingId;
  const query = `SELECT e.employeeId, e.employeeName, d.departmentName, tr.trainerFeedback 
    FROM trainingRegistration tr
    INNER JOIN employee e ON tr.employeeId = e.employeeId
    LEFT JOIN employeeDesignation ed ON e.employeeId = ed.employeeId
    LEFT JOIN department d ON ed.departmentId = d.departmentId
    WHERE tr.trainingId = ?;`;

  connection.query(query, [trainingId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send("Database query error");
    } else if (results.length === 0) {
      res.status(404).send("No employees found for the given training");
    } else {
      res.json(results);
    }
  });
});


app.post('/saveAttendance', (req, res) => {
  const attendanceData = req.body; 
  if (!attendanceData || attendanceData.length === 0) {
    return res.status(400).send('No attendance data provided.');
  }
  const { sessionId } = attendanceData[0]; 

  const values = attendanceData
    .map(entry => `(${entry.employeeId}, ${sessionId}, ${entry.attendanceStatus})`) // Add parentheses around each set of values
    .join(',');

  const sqlQuery = `
    INSERT INTO attendance (employeeId, sessionId, attendanceStatus)
    VALUES ${values}
    ON DUPLICATE KEY UPDATE attendanceStatus = VALUES(attendanceStatus);`;

  connection.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error inserting attendance:', err);
      return res.status(500).send('Error saving attendance.');
    }
    res.send('Attendance saved successfully.');
  });
});


// API to fetch attendance data for a specific sessionId
app.get('/viewAttendance/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const query = `SELECT a.employeeId, e.employeeName, d.departmentName, a.attendanceStatus
    FROM attendance a
    INNER JOIN employee e ON a.employeeId = e.employeeId
    LEFT JOIN employeeDesignation ed ON e.employeeId = ed.employeeId
    LEFT JOIN department d ON ed.departmentId = d.departmentId
    WHERE a.sessionId = ?;`;

  connection.query(query, [sessionId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error.');
    }

    if (results.length === 0) {
      // No attendance records found
      return res.status(404).send('No attendance record found.');
    }

    res.json(results);
  });
});


app.get('/departments-with-employees', (req, res) => {
  const query = `SELECT d.departmentName, e.employeeId, e.employeeName, s.skillName, es.grade
    FROM department d
    INNER JOIN  employeeDesignation ed ON d.departmentId = ed.departmentId
    INNER JOIN employee e ON ed.employeeId = e.employeeId
    INNER JOIN selectedAssignTraining sa ON e.employeeId = sa.employeeId
    INNER JOIN  skill s ON sa.skillId = s.skillId
    INNER JOIN  employeeSkill es ON sa.employeeId = es.employeeId AND sa.skillId = es.skillId
    ORDER BY  d.departmentId, e.employeeId;`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      return res.status(500).json({ message: 'Error retrieving data', error: err });
    }
    // Group results by department name
    const response = {};
    results.forEach(row => {
      if (!response[row.departmentName]) {
        response[row.departmentName] = [];
      }
      // Add employee data to the department
      response[row.departmentName].push({
        employeeId: row.employeeId,
        employeeName: row.employeeName,
        skillName: row.skillName,
        grade: row.grade
      });
    });
    res.json(response);
  });
});


app.get('/get-distinct-department-employess-skill-to-train/:departmentId',(req,res)=>{
  const a = req.params.departmentId;
  const query = `
    select sa.employeeId , sa.skillId , e.employeeName , d.departmentName ,d.departmentId, s.skillName from selectedAssigntraining sa 
    inner join employee e on sa.employeeId = e.employeeId
    inner join employeeDesignation ed on e.employeeId = ed.employeeId
    inner join department d on d.departmentId = ed.departmentId
    inner join skill s on sa.skillId = s.skillId
    where sa.skillId in (select skillId from skill where departmentIdGivingTraining = ?);`

  connection.query(query,[a],(err,result) =>{
    if(err){
      console.log("Fetching data from data base for seperating departments",err);
      return res.status(500).json({ error: 'Database insertion failed' });
    }
    const response = {};
    result.forEach(row =>{
      if(!response[row.departmentName]){
        response[row.departmentName]=[];
      }
      response[row.departmentName].push({
        employeeId: row.employeeId,
        employeeName: row.employeeName,
        skillName: row.skillName,
        skillId : row.skillId,
        departmentId : row.departmentId
        //grade: row.grade
      })
    })
    return res.json(response)
  });
})


// Select employess from selected assign table who are elidgible for that training
app.get('/eligible-employee-to-send-to-training/:trainingId', (req, res) => {
  const trainingId = req.params.trainingId;
  if (!trainingId) {
    return res.status(400).json({ error: 'Training ID is required' });
  }
  const query = `SELECT sa.employeeId, sa.skillId,s.skillName
  FROM training t
  INNER JOIN trainingSkills ts ON t.trainingId = ts.trainingId
  INNER JOIN selectedAssigntraining sa ON sa.skillId = ts.skillId
  INNER JOIN skill s ON sa.skillId = s.skillId
  WHERE t.trainingId = ?;`;

  connection.query(query, [trainingId], (err, result) => {
    if (err) {
      console.error("Error fetching eligible employees:", err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    return res.json(result);
  });
});


// Trainings where we can send an employees
app.get('/department-eligible-for-training/:departmentId',(req,res)=>{
  const departmentID = req.params.departmentId;
  const query = `SELECT t.trainingId, t.trainingTitle, t.startTrainingDate, t.endTrainingDate, 
    GROUP_CONCAT(s.skillName SEPARATOR ', ') AS skills, e.employeeName as trainerName
    FROM training t
    INNER JOIN trainingSkills ts ON ts.trainingId = t.trainingId
    INNER JOIN employee e on e.employeeId = t.trainerId
    INNER JOIN skill s ON s.skillId = ts.skillId
    WHERE s.departmentId = ?
    GROUP BY t.trainingId, t.trainingTitle, t.startTrainingDate, t.endTrainingDate;`
    
  connection.query(query,[departmentID],(err,result)=>{
    if(err){
      console.error("Failed to fetch eligible department training")
      return res.status(500).json({ error: 'Database query failed' });
    }
    return res.json(result);
  })
});


// Endpoint to save feedback
app.post('/saveFeedback', (req, res) => {
  const feedbackArray = req.body;
  const query = `UPDATE trainingRegistration SET trainerFeedback = ? 
    WHERE employeeId = ? AND trainingId = ?`;

  feedbackArray.forEach((feedback) => {
    const { employeeId, trainingId, trainerFeedback } = feedback;

    connection.query(query, [trainerFeedback, employeeId, trainingId], (err, result) => {
      if (err) {
        console.error('Error executing query for employeeId:', employeeId, err);
        return res.status(500).json({ message: 'Error saving feedback' });
      }
    });
  });
  res.status(200).json({ message: 'Feedback saved successfully' });
});


export default app;