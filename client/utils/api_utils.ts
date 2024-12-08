import axios from "axios";
import {
  CREATE_NEW_SESSION,
  DELETE_EMPTY_SESSION,
  GET_EXISTING_CODE,
} from "@/constants";

export const createNewSession = async () => {
  try {
    const response = await axios.post(CREATE_NEW_SESSION);
    const { sessionId } = response.data;
    return sessionId;
  } catch (error) {
    console.error("Error creating new session:", error);
    throw new Error("Error creating new session");
  }
};

export const getCode = async (sessionId: string) => {
  try {
    const response = await axios.get(`${GET_EXISTING_CODE}/${sessionId}`);
    const { code } = response.data;
    return code;
  } catch (error) {
    console.error("Error fetching code:", error);
    throw new Error("Error fetching code");
  }
};

export const deleteEmptyCode = async () => {
  try {
    const response = await axios.delete(DELETE_EMPTY_SESSION);
    return response.data;
  } catch (error) {
    console.error("Error deleting empty code:", error);
    throw new Error("Error deleting empty code");
  }
};
