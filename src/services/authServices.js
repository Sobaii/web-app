import fetchCallWrapper from "./fetchCallWrapper";

const baseUrl = `${import.meta.env.VITE_SERVER_URL}/auth`;

export const signUpUserWithGoogle = async () => {
  const options = { 
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return await fetchCallWrapper(`${baseUrl}/google`, options);
};

export const getUserGoogleInfo = async () => {
  const options = {
    method: "GET",
  };

  return await fetchCallWrapper(`${baseUrl}/google/userinfo`, options);
};
