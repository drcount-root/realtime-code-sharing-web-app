"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createNewSession, deleteEmptyCode } from "@/utils/api_utils";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const HomeComponent = () => {
  const [isLoading, setIsLoading] = useState({
    createSession: false,
    deleteEmptyCode: false,
  });
  const router = useRouter();

  const createSessionHandler = async () => {
    try {
      setIsLoading({
        ...isLoading,
        createSession: true,
      });
      const sessionId = await createNewSession();
      if (sessionId) {
        setIsLoading({
          ...isLoading,
          createSession: false,
        });
        toast.success("Session created successfully");
        router.push(`/${sessionId}`);
      } else {
        setIsLoading({
          ...isLoading,
          createSession: false,
        });
        toast.warning("Please try again");
      }
    } catch (error) {
      setIsLoading({
        ...isLoading,
        createSession: false,
      });
      console.error("Error creating new session:", error);
      toast.error("Uh oh! Something went wrong");
    }
  };

  const deleteEmptyCodeHandler = () => {
    if (confirm("Are you sure you want to delete all empty sessions?")) {
      setIsLoading({
        ...isLoading,
        deleteEmptyCode: true,
      });
      deleteEmptyCode()
        .then(() => {
          setIsLoading({
            ...isLoading,
            deleteEmptyCode: false,
          });
          toast.success("Deleted all empty sessions");
        })
        .catch((error) => {
          setIsLoading({
            ...isLoading,
            deleteEmptyCode: false,
          });
          console.error("Error deleting empty sessions:", error);
          toast.error("Uh oh! Something went wrong");
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 h-screen">
      <Button
        onClick={createSessionHandler}
        className="w-[280px] bg-green-600 hover:bg-green-500"
      >
        {isLoading?.createSession ? (
          <>
            <Loader2 className="animate-spin" />
            Please wait
          </>
        ) : (
          <>Create New Session</>
        )}
      </Button>

      <Button
        variant="destructive"
        onClick={deleteEmptyCodeHandler}
        className="w-[280px]"
      >
        {isLoading?.deleteEmptyCode ? (
          <>
            <Loader2 className="animate-spin" />
            Please wait
          </>
        ) : (
          <>Delete Empty Sessions</>
        )}
      </Button>
    </div>
  );
};

export default HomeComponent;
