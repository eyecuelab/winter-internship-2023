export const API_ENDPOINT = "https://superpacart.fly.dev";

const BASE_HEADERS = {
  headers: {
    "Content-Type": "application/json",
  },
};

const handleResponse = async (response: Response) => {
  if (response.status === 204) {
  } else {
    const json = await response.json();
    return json;
  }
};

export const getData = async (endpoint: string | null) => {
  const url = `${API_ENDPOINT}${endpoint}`;
  const response = await fetch(url, { ...BASE_HEADERS, method: "GET" });
  return handleResponse(response);
};

export const postData = async (endpoint: string, payload: unknown) => {
  const url = `${API_ENDPOINT}${endpoint}`;
  const response = await fetch(url, {
    ...BASE_HEADERS,
    method: "POST",
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const deleteData = async (endpoint: string) => {
  const url = `${API_ENDPOINT}${endpoint}`;
  const response = await fetch(url, {
    ...BASE_HEADERS,
    method: "DELETE",
  });
  return handleResponse(response);
};

export const putData = async (endpoint: string, payload?: unknown) => {
  const url = `${API_ENDPOINT}${endpoint}`;
  const response = await fetch(url, {
    ...BASE_HEADERS,
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};
