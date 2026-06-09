export async function fetchGet(endpoint) {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_BASE_URL}${endpoint}`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(response.status);
  }

  return await response.json();
}

export async function fetchPost(endpoint, body) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_BASE_URL}${endpoint}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function fetchPut(endpoint, body) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_BASE_URL}${endpoint}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function fetchDelete(endpoint) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_BASE_URL}${endpoint}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
