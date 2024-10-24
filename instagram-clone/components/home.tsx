"use client";

import { useMutation } from "@tanstack/react-query";
import { upLoadFile, uploadToTable } from "actions/storageAction";
import { queryClient } from "config/ReactQueryClientProvider";
import { useRef } from "react";
import getImageUrl from "utils/supabase/storage";

export default function Mypage({ userInfo }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = async (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleChange = async (e) => {
    e.preventDefault();
    const file = e.target.files?.[0]; // 선택한 파일을 가져옴
    console.log(file);

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      // 업로드 mutation 실행
      const result = await uploadImageMutation.mutateAsync(formData);

      // 파일 url 가져오기
      if (result) {
        const publicUrl = getImageUrl(file.name);

        // userProfile 테이블에 imgurl 업데이트
        await uploadToTable(publicUrl, userInfo.id);
      }
    }
  };

  const uploadImageMutation = useMutation({
    mutationFn: upLoadFile, // 파일 업로드 함수
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["images"], // 업로드 성공 시 캐시 무효화
      });
    },
  });

  return (
    <div className="w-full h-screen bg-blue-gray-50 flex px-10 py-8">
      <div className="w-1/4 h-60 bg-red-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
            className="hidden"
          />
          <button
            onClick={handleClick}
            type="button"
            className="w-24 h-24 rounded-full bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: `url(${userInfo.imgurl})` }}
          />
          <p className="text-xs">{userInfo.email}</p>
        </div>
      </div>
      <div className="w-full h-60 bg-white"></div>
    </div>
  );
}
