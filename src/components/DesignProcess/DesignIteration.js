import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logDesignActivity, saveDesignProgress } from '../../utils/designUtils';
import { Button } from '@mui/material';

const DesignIteration = ({ currentDesign }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [iterationCount, setIterationCount] = useState(0);
  const [phaseComplete, setPhaseComplete] = useState(false);
  const navigate = useNavigate();

  const handleContinueIteration = () => {
    const confirmContinue = window.confirm("Would you like to continue iterating on this design?");
    
    if (confirmContinue) {
      // Reset necessary state variables for a new iteration
      setCurrentStep(1); // Reset to the first step of the iteration process
      setFeedback('');
      setIterationCount(prevCount => prevCount + 1);
      
      // Log the new iteration
      logDesignActivity({
        action: 'start_new_iteration',
        designId: currentDesign.id,
        iterationNumber: iterationCount + 1,
        timestamp: new Date()
      });
    } else {
      // Move to the next phase of the design process
      setPhaseComplete(true);
      
      // Log completion of the iteration phase
      logDesignActivity({
        action: 'complete_iteration_phase',
        designId: currentDesign.id,
        totalIterations: iterationCount,
        timestamp: new Date()
      });
      
      // Navigate to the next phase or show completion dialog
      handleNextPhase();
    }
  };

  // Function to handle moving to the next phase
  const handleNextPhase = () => {
    // Save all design data before proceeding
    saveDesignProgress();
    
    // Navigate to the next phase based on your application flow
    // This could be implementation, testing, or finalization
    navigate('/design-process/implementation', { 
      state: { 
        designId: currentDesign.id,
        iterationCount,
        designData: currentDesign 
      } 
    });
  };

  return (
    <div className="design-iteration-container">
      <h2>Design Iteration</h2>
      {/* Existing iteration UI components */}
      
      {/* Add this section where appropriate in your UI */}
      <div className="iteration-controls">
        <h3>Iteration {iterationCount} Complete</h3>
        <p>You've completed this iteration of the design process.</p>
        
        <div className="button-group">
          <Button 
            variant="outlined" 
            color="primary"
            onClick={handleContinueIteration}
          >
            Continue to iterate?
          </Button>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => handleContinueIteration()}
            sx={{ ml: 2 }}
          >
            Proceed to Next Phase
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesignIteration;