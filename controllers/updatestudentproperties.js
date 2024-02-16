const Student = require('../models/Student'); 

const updateAcademicCommitteeStatus = async (req, res) => {
  const { matricNumber } = req.body; 
  
  try {
    // Find the student by matricNumber
    const student = await Student.findOne({ matricNumber });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update the isAcademicCommittee field
    student.isAcademicCommittee = true;

    // Save the updated student object
    await student.updateOne(student);

    // Return the name of the student along with success message
    return res.status(200).json({ message: 'Academic committee status updated successfully', name: `${student.firstName} ${student.lastName}` });
  } catch (error) {
    console.error('Error updating academic committee status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { updateAcademicCommitteeStatus };
