// At the top of your component or hook file
const fetchCallWrapper = async (url, options, parseResponseJSON = true) => {
  try {
    let response = await fetch(url, { ...options, credentials: "include" });

    if (response.status === 401 && url.includes('/auth')) {
      const refreshResponse = await fetch("http://localhost:3000/auth/refresh-access-token", {
        credentials: "include"
      });
      if (refreshResponse.status === 401) {
        // window.location.href = "/";
        throw new Error(`Session expired. Redirecting to home.`);
      }

      // Retry the original request after successfully refreshing the token
      response = await fetch(url, { ...options, credentials: "include" });
    }

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        errorResponse.message || `HTTP error! Status: ${response.status}`
      );
    }

    if (!parseResponseJSON) {
      return response;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Request to ${url} failed:`, error.message);
    throw error;
  }
};

export default fetchCallWrapper;
