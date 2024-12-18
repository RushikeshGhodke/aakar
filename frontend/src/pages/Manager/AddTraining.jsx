import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Textfield from '../Components/Textfield';
import CustomDatePicker from '../Components/CustomDatePicker';
import { toast } from 'react-toastify'; 
import './AddTraining.css';
import dayjs from 'dayjs';
import GeneralSearchBar from '../Components/GenralSearchBar';

const AddTraining = ({ onTrainingAdded = () => { 
  console.log('Local callback');
}, editTrainingData, isEditing, setIsEditing, departmentId = 1, modifyTable }) => {
  const [newTraining, setNewTraining] = useState({
    trainingTitle: "",
    trainerId: "",
    trainerName: "",
    startTrainingDate: dayjs(), 
    endTrainingDate: dayjs(),   
    skills: [],
  });

  const [skillOptions, setSkillOptions] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTrainerIds, setSelectedTrainerIds] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [searchedEmp,setSearchedEmp] = useState("")

  // Fetch all skills
  useEffect(() => {
    if (departmentId) {
      axios.get(`http://localhost:8081/get-all-skills`)
        .then(response => {
          const skills = response.data.skills;
          if (Array.isArray(skills)) {
            setSkillOptions(skills.map(skill => ({
              id: skill.id,
              label: skill.label, 
            })));
          } else {
            toast.error('Unexpected skills data received from the server!');
          }
        })
        .catch(error => {
          console.error('Error fetching skills:', error);
        });
    }
  }, [departmentId]);  

  //fetch employees
  useEffect(() => {
    axios.get('http://localhost:8081/api/employees')
      .then(response => {
        console.log('Fetched employees:', response.data); 
        setEmployeeOptions(response.data.map(emp => ({
          id: emp.employeeId,
          label: emp.employeeName,
        })));
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  }, []);
  
    const handleSelectEmployee = ((employeeInfo) =>{
      setSearchedEmp(employeeInfo);
      if (employeeInfo) {
            setNewTraining(prevState => ({
              ...prevState,
              trainerId: employeeInfo.id,
              trainerName: employeeInfo.label,
            }));
          }
          console.log("After selecting trainer : " , newTraining)
    })

  //edit training
  useEffect(() => {
    if (isEditing && editTrainingData) {
      console.log("Edit data:", editTrainingData);

      const formattedStartDate = editTrainingData.startTrainingDate
        ? dayjs(editTrainingData.startTrainingDate).format("YYYY-MM-DD")
        : "";
      const formattedEndDate = editTrainingData.endTrainingDate
        ? dayjs(editTrainingData.endTrainingDate).format("YYYY-MM-DD")
        : "";
      
      
      const skillsArray = Array.isArray(editTrainingData.skills)
            ? editTrainingData.skills.map((skill) => {
                  if (typeof skill === "object" && skill.id && skill.label) {
                      // Skill already has id and label, ensure it matches with skillOptions
                      const matchedSkill = skillOptions.find(
                          (option) => option.id === skill.id && option.label === skill.label
                      );
                      return matchedSkill || { id: skill.id, label: skill.label };
                  } else if (typeof skill === "string") {
                      // Skill is a string, find matching skillOption
                      const matchedSkill = skillOptions.find(
                          (option) => option.label === skill.trim()
                      );
                      return matchedSkill || { id: null, label: skill.trim() };
                  }
                  return null; // Handle unexpected cases gracefully
              }).filter(Boolean) // Remove any null values
            : typeof editTrainingData.skills === "string"
            ? editTrainingData.skills.split(",").map((skill) => {
                  const matchedSkill = skillOptions.find(
                      (option) => option.label === skill.trim()
                  );
                  return matchedSkill || { id: null, label: skill.trim() };
              })
            : [];
      
      console.log("Haritaaaaaaaa:", skillOptions);
      // const skillIds = skillOptions
      // .filter((option) => skillsArray.includes(option.label))
      // .map((option) => option.id);
  
      console.log("Parsed Skills Array:", skillsArray); 

      const trainer = employeeOptions.find(emp => emp.label === editTrainingData.trainerName);
      const trainerId = trainer ? trainer.id : "";

      console.log("Trainer id fetched:", trainerId);
      setNewTraining({
        trainingTitle: editTrainingData.trainingTitle || "",
        trainerId: trainerId,
        trainerName: editTrainingData.trainerName || "",
        startTrainingDate: formattedStartDate, 
        endTrainingDate: formattedEndDate,
        skills: skillOptions || [],
      });
      // setNewTraining((prev) => ({
      //   ...prev,
      //   skills: skillIds, 
      // }));
      console.log("Edited data:", newTraining);
      //console.log("Skill description:", skillIds)
      setSelectedSkills(skillsArray);
    }
  }, [isEditing, editTrainingData, skillOptions]);
   

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTraining(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setNewTraining(prevState => ({
      ...prevState,
      [name]: dayjs(date), 
    }));
  };

  const handleSelectSkill = (values) => {
    console.log("Set selected skill", values);
    
    setSelectedSkills(values); 
    setNewTraining((prevState) => ({
      ...prevState,
      skills: values.map((value) => ({
          id: value.id, 
          label: value.label,
      })),
  }));
  };  

  const handleSaveTraining = async () => {
    console.log("New training:",newTraining);
    if (!newTraining.trainingTitle || !newTraining.trainerId) {
      toast.error('Please fill in all required fields!');
      return;
    }
    const startDate = dayjs(newTraining.startTrainingDate).format("YYYY-MM-DD");
    const endDate = dayjs(newTraining.endTrainingDate).format("YYYY-MM-DD");
    const today = dayjs(new Date()).format("YYYY-MM-DD");

    if(startDate >= today && endDate >= startDate){
      try {
        const formattedTraining = {
          ...newTraining,
          trainerId: parseInt(newTraining.trainerId, 10),
          startTrainingDate: dayjs(newTraining.startTrainingDate).format("YYYY-MM-DD"),
          endTrainingDate: dayjs(newTraining.endTrainingDate).format("YYYY-MM-DD"),
          skills: selectedSkills,
        };
        console.log("Initial data:", newTraining);
        console.log("After formatting:", formattedTraining);
  
        console.log("Start:", startDate);
        console.log("End:", endDate);
        if (isEditing) {
          const confirmUpdate = window.confirm("Do you want to update the training details?");
          if (!confirmUpdate) return;
    
          await axios.put(`http://localhost:8081/update-training/${editTrainingData.trainingId}`, formattedTraining);
          console.log("After updating or  editing:", formattedTraining);
          toast.success('Training updated successfully!');
          setIsEditing(false);
        } else {
          onTrainingAdded();
          await axios.post('http://localhost:8081/add-training', formattedTraining);
          console.log("After formatting adding:", formattedTraining);
          resetForm();
          toast.success('Training added successfully!');
        }
    
        resetForm();
        onTrainingAdded(); 
      } catch (error) {
        console.error('Error saving training:', error);
        toast.error('Failed to save the training!');
      }
    }
    else{
      toast.error("Select dates properly!");
    }
    
  }; 
  

  const resetForm = () => {
    setNewTraining({
      trainingTitle: '',
      trainerId: '',
      startTrainingDate: dayjs(),
      endTrainingDate: dayjs(),
      skills: [],
    });
    setSelectedSkills([]);
    setSelectedTrainerIds([]);
  };

  return (
    <div className="add-training-form">
      <Textfield
        label="Training Name"
        name="trainingTitle"
        value={newTraining.trainingTitle}
        onChange={handleInputChange}
        isRequired={true}
      />
      <GeneralSearchBar
        options={employeeOptions}
        label='Search Trainer'
        displayKey='label'
        isMultiSelect={false}
        selectedValues={{
          id: newTraining.trainerId,  
          label: newTraining.trainerName,  
        }}
        setSelectedValues={handleSelectEmployee}
        includeSelectAll={false}
      />
      <CustomDatePicker
        label="Start Training Date"
        selected={newTraining.startTrainingDate} 
        onChange={(newDate) => handleDateChange("startTrainingDate", newDate)}
      />
      <CustomDatePicker
        label="End Training Date"
        selected={newTraining.endTrainingDate} 
        onChange={(newDate) => handleDateChange("endTrainingDate", newDate)}
      />
      <GeneralSearchBar
        options={skillOptions} 
        label="Skills"
        displayKey="label" 
        isMultiSelect={true} 
        selectedValues={selectedSkills} 
        setSelectedValues={handleSelectSkill} 
        includeSelectAll={true}
      />
      <button onClick={handleSaveTraining} className="save-training-btn">
        {isEditing ? 'Update' : 'Save'}
      </button>
    </div>
  );
};

export default AddTraining;
