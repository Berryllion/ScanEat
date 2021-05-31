const headers = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      authorization: token
    }
  }
};

export default headers;