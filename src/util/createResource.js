const createResource = (promise) => {
  let status = "pending";
  let result;

  const suspender = promise.then(
    (res) => {
      status = "success";
      result = res;
    },
    (err) => {
      status = "error";
      result = err;
    }
  );

  return {
    read() {
      if (status === "pending") throw suspender; // Throw the promise for Suspense
      if (status === "error") throw result; // Throw the error
      if (status === "success") return result; // Return the resolved value
    },
  };
};

export default createResource;
