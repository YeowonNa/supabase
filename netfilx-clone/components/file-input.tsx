"use client";

import { Spinner } from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import { upLoadFile } from "actions/storageAction";
import { queryClient } from "config/ReactQueryClientProvider";
import { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";

export default function FileInput() {
  const fileRef = useRef(null);

  // 드래그 앤 드롭 함수
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const formData = new FormData();

      acceptedFiles.forEach((file) => {
        formData.append(file.name, file);
      });
      const result = await uploadImageMutation.mutate(formData);
      console.log(result);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

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
    <div
      {...getRootProps()}
      //   onSubmit={fileSubmitHandler}
      className="w-full py-20 border-4 border-dotted border-indigo-700 flex flex-col items-center justify-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {uploadImageMutation.isPending ? (
        <Spinner />
      ) : isDragActive ? (
        <p>파일을 놓아주세요.</p>
      ) : (
        <p>파일을 끌어다 놓거나 클릭하여 업로드 하세요.</p>
      )}
    </div>
  );
}
