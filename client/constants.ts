const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const CREATE_NEW_SESSION = `${API_BASE_URL}/api/sessions/create`;
export const GET_EXISTING_CODE = `${API_BASE_URL}/api/sessions/code`;
