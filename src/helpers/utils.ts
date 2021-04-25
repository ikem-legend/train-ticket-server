export const generateUserId = () => {
  const randomId = Math.ceil(Math.random() * Math.random() * 1000000000);
  if (String(randomId).length < 8) {
    generateUserId();
  } else {
    return randomId;
  }
};
