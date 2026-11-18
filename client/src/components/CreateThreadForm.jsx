
import { useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createThread } from "../services/threads.service";

export default function CreateThreadForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createThread,

    onSuccess: () => {
      // Refresh the thread list automatically
      queryClient.invalidateQueries({
        queryKey: ["threads"],
      });

      // Clear the form
      setTitle("");
      setBody("");
    },

    onError: (error) => {
      console.error("Thread creation failed:", error);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();

    mutation.mutate({
      title,
      body,
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What's on your mind?"
      />

      <button
        type="submit"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Posting…" : "Post thread"}
      </button>

      {mutation.isError && (
        <p className="err" role="alert">
          {mutation.error?.response?.data?.error ||
            mutation.error?.message ||
            "Something went wrong. Please try again."}
        </p>
      )}
    </form>
  );
}
