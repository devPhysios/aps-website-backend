const Student = require("../models/Student");
const Alumnus = require("../models/Alumnus");



const updateExecutives = async (req, res) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    // try {
    //   const { oldMatricNumber, newMatricNumber, previousSession, newSession, title } = req.body;
    //   // Find the old executive in both Student and Alumnus collections
    //   const oldStudentExec = await Student.findOne({ matricNumber: oldMatricNumber }).session(session);
    //   const oldAlumnusExec = await Alumnus.findOne({ matricNumber: oldMatricNumber }).session(session);
    //   let oldExec = oldStudentExec || oldAlumnusExec;
    //   if (!oldExec) {
    //     throw new Error("Old executive not found in either Student or Alumnus collection");
    //   }
    //   // Check if the old executive held the specified title in the previous session
    //   const hasTitle = oldExec.post ?
    //     oldExec.post.some(p => p.title.toLowerCase() === title.toLowerCase() && p.academicSession === previousSession) :
    //     oldExec.postHeld.some(p => p.title.toLowerCase() === title.toLowerCase() && p.academicSession === previousSession);
    //   if (!hasTitle) {
    //     throw new Error(`Old executive did not hold the title "${title}" in the session ${previousSession}`);
    //   }
    //   // Update old executive (if student)
    //   if (oldStudentExec) {
    //     oldStudentExec.isExecutive = false;
    //     await oldStudentExec.save({ session });
    //   }
    //   // Find and update the new executive
    //   const newExec = await Student.findOne({ matricNumber: newMatricNumber }).session(session);
    //   if (!newExec) {
    //     throw new Error("New executive not found in Student collection");
    //   }
    //   // Check if the new executive already holds the position
    //   const alreadyHoldsPosition = newExec.post.some(p =>
    //     p.title.toLowerCase() === title.toLowerCase() && p.academicSession === newSession
    //   );
    //   if (!alreadyHoldsPosition) {
    //     newExec.post.push({ title, academicSession: newSession });
    //   }
    //   newExec.isExecutive = true;
    //   await newExec.save({ session });
    //   await session.commitTransaction();
    //   session.endSession();
    //   res.status(200).json({
    //     message: "Executive updated successfully",
    //     oldExecutive: {
    //       name: `${oldExec.firstName} ${oldExec.lastName}`,
    //       matricNumber: oldExec.matricNumber,
    //       type: oldStudentExec ? "Student" : "Alumnus"
    //     },
    //     newExecutive: {
    //       name: `${newExec.firstName} ${newExec.lastName}`,
    //       matricNumber: newExec.matricNumber
    //     },
    //     title,
    //     previousSession,
    //     newSession
    //   });
    // } catch (error) {
    //   await session.abortTransaction();
    //   session.endSession();
    //   res.status(400).json({ message: error.message });
    // }
  };
  
  const updateSenators = async (req, res) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    // try {
    //   const { newMatricNumber, previousSession, newSession, title } = req.body;
    //   // Find the new senator
    //   const newSenator = await Student.findOne({ matricNumber: newMatricNumber }).session(session);
    //   if (!newSenator) {
    //     throw new Error("New senator not found in Student collection");
    //   }
    //   const level = newSenator.level;
    //   const principalOfficerTitles = ["Senate President", "Deputy Senate President", "Senate Clerk", "Senate Chief Whip"];
    //   const isPrincipalOfficer = principalOfficerTitles.includes(title);
    //   // Count total senators for this level (including principal officers)
    //   const currentSenatorCount = await Student.countDocuments({
    //     level,
    //     isSenator: true,
    //     $or: [
    //       { post: { $elemMatch: { title: "Senator", academicSession: newSession } } },
    //       { post: { $elemMatch: { title: { $in: principalOfficerTitles }, academicSession: newSession } } }
    //     ]
    //   }).session(session);
    //   if (currentSenatorCount >= 3 && !newSenator.isSenator) {
    //     throw new Error(`Maximum number of senators (3) already reached for level ${level}`);
    //   }
    //   if (isPrincipalOfficer) {
    //     // Handle principal officer update
    //     // Find old principal officer
    //     const oldOfficer = await Student.findOne({
    //       post: { $elemMatch: { title, academicSession: previousSession } }
    //     }).session(session);
    //     if (oldOfficer && oldOfficer.matricNumber !== newMatricNumber) {
    //       // Remove the principal officer title from the old officer, but keep them as a senator
    //       await Student.updateOne(
    //         { _id: oldOfficer._id },
    //         { $pull: { post: { title, academicSession: previousSession } } },
    //         { session }
    //       );
    //     }
    //   } else {
    //     // Handle regular senator update
    //     // Remove old regular senators for this level
    //     await Student.updateMany(
    //       {
    //         level,
    //         isSenator: true,
    //         post: { $elemMatch: { title: "Senator", academicSession: previousSession } }
    //       },
    //       { $pull: { post: { title: "Senator", academicSession: previousSession } } },
    //       { session }
    //     );
    //   }
    //   // Update new senator
    //   if (!newSenator.isSenator) {
    //     newSenator.isSenator = true;
    //   }
    //   // Check if the position already exists for the new session
    //   const existingPosition = newSenator.post.find(p =>
    //     p.title === title && p.academicSession === newSession
    //   );
    //   if (!existingPosition) {
    //     newSenator.post.push({ title, academicSession: newSession });
    //   }
    //   await newSenator.save({ session });
    //   await session.commitTransaction();
    //   session.endSession();
    //   res.status(200).json({
    //     message: `${isPrincipalOfficer ? "Principal officer" : "Senator"} updated successfully`,
    //     newSenator: {
    //       name: `${newSenator.firstName} ${newSenator.lastName}`,
    //       matricNumber: newSenator.matricNumber,
    //       level
    //     },
    //     title,
    //     previousSession,
    //     newSession,
    //     senatorsInLevel: currentSenatorCount + (newSenator.isSenator ? 0 : 1)
    //   });
    // } catch (error) {
    //   await session.abortTransaction();
    //   session.endSession();
    //   res.status(400).json({ message: error.message });
    // }
  };
  
  const fetchOfficers = async (req, res) => {
    const { academicSession, type } = req.body;
  
    if (!academicSession) {
      return res.status(400).json({ message: "Academic session is required" });
    }
  
    const executiveTitles = [
      "President", "Vice President", "General Secretary", "Assistant General Secretary",
      "Public Relations Officer", "Treasurer", "Financial Secretary", "Sports Secretary",
      "Social Director", "Special Duties Officer"
    ];
  
    const senatorTitles = [
      "Senator", "Senate President", "Deputy Senate President", "Senate Clerk", "Senate Chief Whip"
    ];
  
    try {
      const studentQuery = { post: { $elemMatch: { academicSession } } };
      const alumnusQuery = { postHeld: { $elemMatch: { academicSession } } };
  
      const students = await Student.find(studentQuery);
      const alumni = await Alumnus.find(alumnusQuery);
  
      const formatName = (firstName, lastName, middleName) => {
        const names = [firstName, middleName, lastName].filter(Boolean);
        return names.map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join(' ');
      };
  
      const formatOfficer = (person, isAlumnus = false) => {
        const posts = isAlumnus ? person.postHeld : person.post;
        const relevantPosts = posts.filter(p => p.academicSession === academicSession);
        if (relevantPosts.length === 0) return null;
  
        return relevantPosts.map(post => ({
          fullName: formatName(person.firstName, person.lastName, person.middleName),
          matricNumber: person.matricNumber,
          office: post.title,
          level: person.level || "Alumnus",
          academicSession: academicSession,
          profilePicture: person.profilePicture,
          hobbies: person.hobbies,
          skills: person.skills,
          phoneNumber: person.phoneNumber
        }));
      };
  
      const allOfficers = [...students, ...alumni]
        .flatMap(person => formatOfficer(person, !person.level))
        .filter(officer => officer !== null);
  
      const executives = allOfficers.filter(officer => 
        executiveTitles.some(title => officer.office.toLowerCase() === title.toLowerCase())
      );
      const senators = allOfficers.filter(officer => 
        senatorTitles.some(title => officer.office.toLowerCase() === title.toLowerCase())
      );
  
      executives.sort((a, b) => a.office.localeCompare(b.office));
      senators.sort((a, b) => a.office.localeCompare(b.office));
  
      let response = {
        message: `Officers fetched successfully for ${academicSession}`,
        academicSession
      };
  
      if (!type || type.toLowerCase() === "executives") {
        response.executives = executives;
      }
  
      if (!type || type.toLowerCase() === "senators") {
        response.senators = senators;
      }
  
      res.status(200).json(response);
  
    } catch (error) {
      console.error("Error fetching officers:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  module.exports = {
    fetchOfficers, updateExecutives, updateSenators
  }