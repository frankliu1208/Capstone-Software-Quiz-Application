let currentCandidateEmail = '';

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
