"use client";

import { useRouter } from "next/navigation";
import { createNewSession } from "@/utils/api_utils";
import { toast } from "sonner";
import { Button } from "./ui/button";

const HomeComponent = () => {
  const router = useRouter();

  const createSessionHandler = async () => {
    try {
      const sessionId = await createNewSession();
      if (sessionId) {
        toast.success("Session created successfully");
        router.push(`/${sessionId}`);
      } else {
        toast.warning("Please try again");
      }
    } catch (error) {
      console.error("Error creating new session:", error);
      toast.error("Uh oh! Something went wrong");
    }
  };

  return (
    <div>
      <Button variant="outline" onClick={createSessionHandler}>
        Create New Session
      </Button>
    </div>
  );
};

export default HomeComponent;
