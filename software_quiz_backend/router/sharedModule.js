let currentCandidateEmail = '';

// Arrow functions are a concise way to write anonymous functions
const setCurrentCandidateEmail = (email) => {
  currentCandidateEmail = email;
};

const getCurrentCandidateEmail = () => {
  return currentCandidateEmail;
};

export default {
  setCurrentCandidateEmail,
  getCurrentCandidateEmail,
};





