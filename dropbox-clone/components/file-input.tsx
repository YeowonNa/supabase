"use client";

import { Button } from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import { upLoadFile } from "actions/storageAction";
import { queryClient } from "config/ReactQueryClientProvider";
import { useRef } from "react";

export default function FileInput() {
  const fileRef = useRef(null);
  const uploadImageMutation = useMutation({
    mutationFn: upLoadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["images"],
      });
    },
  });

  const fileSubmitHandler = async (e) => {
    e.preventDefault();
    const file = fileRef.current.files?.[0];
    console.log(file);

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImageMutation.mutate(formData);
      console.log(result);
    }
  };

  return (
    <form
      onSubmit={fileSubmitHandler}
      className="w-full py-20 border-4 border-dotted border-indigo-700 flex flex-col items-center justify-center"
    >
      <input ref={fileRef} type="file" className="" />
      <p>파일을 끌어다 놓거나 클릭하여 업로드 하세요.</p>

      <Button loading={uploadImageMutation.isPending} type="submit">
        file upload
      </Button>
    </form>
  );
}
