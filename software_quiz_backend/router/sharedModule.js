



let currentCandidateEmail = '';

// Arrow functions are a concise way to write anonymous functions
const setCurrentCandidateEmail = (email) => {
  currentCandidateEmail = email;
};

const getCurrentCandidateEmail = () => {
  return currentCandidateEmail;
};

// will be used in route.js
export default {
  setCurrentCandidateEmail,
  getCurrentCandidateEmail,
};





