import React, { useState, useEffect } from "react";
import AccordionItem from "./AccordionItem";

export default function Accordion({
  assessments,
  setAssessments,
  originalAssignments,
  editable,
}) {
  const [assignments, setAssignments] = useState([...assessments]);
  const updateAssignments = (assignment) => {
    setAssignments(assignment);
  };

  useEffect(() => {
    setAssessments(assignments);
  }, [assignments]);
  let accordion = [];

  for (let i = 0; i < assessments.length; i++) {
    accordion.push(
      <AccordionItem
        data={assessments[i]}
        assignments={assessments}
        assignmentsSetter={updateAssignments}
        originalAssignment={originalAssignments[i]}
        editable={editable}
        key={assessments[i].title + String(i)}
      />
    );
  }
  return <>{accordion}</>;
}
