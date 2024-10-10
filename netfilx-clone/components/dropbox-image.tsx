"use client";

import { IconButton, Spinner } from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import { deleteFiles } from "actions/storageAction";
import { queryClient } from "config/ReactQueryClientProvider";
import getImageUrl from "utils/supabase/storage";

export default function DropboxImage({ image }) {
  const deleteFileMutation = useMutation({
    mutationFn: deleteFiles,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["images"],
      });
    },
  });

  return (
    <div className="relative w-full flex flex-col gap-2 p-4 border border-gray-100 rounded-2xl shadow-md">
      {/* image */}
      <div>
        <img
          src={getImageUrl(image.name)}
          alt="img"
          className="w-full aspect-square rounded-2xl"
        />
      </div>

      {/* fileName */}
      <div>{image.name}</div>

      {/* delete button */}
      <div className="absolute top-4 right-4">
        <IconButton
          color="red"
          onClick={() => {
            deleteFileMutation.mutate(image.name);
          }}
        >
          {deleteFileMutation.isPending ? (
            <Spinner />
          ) : (
            <i className="fas fa-trash" />
          )}
        </IconButton>
      </div>
    </div>
  );
}
