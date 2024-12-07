import axios from "axios";
import { CREATE_NEW_SESSION } from "@/constants";

export const createNewSession = async () => {
  try {
    const response = await axios.post(CREATE_NEW_SESSION);
    const { sessionId } = response.data;
    return sessionId;
  } catch (error) {
    console.error("Error creating new session:", error);
    return null;
  }
};
