"use client";

import { useMutation } from "@tanstack/react-query";
import { deleteFiles, upLoadFile, uploadToTable } from "actions/storageAction";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { profileImgState } from "utils/supabase/recoil/atoms";
import getImageUrl from "utils/supabase/storage";
import { getUserInfo } from "actions/userInfoAction";
import { queryClient } from "config/ReactQueryClientProvider";

export default function Mypage({ userInfo, isKakao }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profileImg, setProfileImg] = useRecoilState(profileImgState);

  useEffect(() => {
    const initialImg =
      isKakao && userInfo?.user_metadata?.avatar_url
        ? userInfo?.user_metadata?.avatar_url
        : userInfo?.imgurl
        ? userInfo?.imgurl
        : "/images/defaultProfile.png";

    setProfileImg(initialImg); // 초기 프로필 이미지 설정
  }, [isKakao, userInfo, setProfileImg]);

  const handleClick = async (e) => {
    e.preventDefault();
    if (!isKakao) {
      fileInputRef.current.click();
    }
  };

  const uploadImageMutation = useMutation({
    mutationFn: upLoadFile, // 파일 업로드 함수
    onSuccess: async (data, variables) => {
      // 업로드 성공 후 파일 이름을 기반으로 URL을 가져옴
      const file = variables.get("file") as File;
      const publicUrl = getImageUrl(file.name);

      // userProfile 테이블에 imgurl 업데이트
      await uploadToTable(publicUrl, userInfo.id);

      // 상태 업데이트로 이미지 변경
      const updatedUserInfo = await getUserInfo(userInfo.id);
      setProfileImg(updatedUserInfo.imgurl);
    },
  });

  // 파일 삭제
  const deleteFileMutation = useMutation({
    mutationFn: deleteFiles,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["images"],
      });

      await uploadToTable(null, userInfo.id);
      setProfileImg("/images/defaultProfile.png");
    },
  });

  const handleChange = async (e) => {
    e.preventDefault();
    const file = e.target.files?.[0]; // 선택한 파일을 가져옴

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      // 업로드 mutation 실행
      uploadImageMutation.mutate(formData);
    }
  };

  return (
    <div className="w-full h-screen bg-blue-gray-50 flex px-10 py-8">
      <div className="w-1/3 h-60 bg-red-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 relative">
          {!isKakao && (
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleChange}
              className="hidden"
            />
          )}

          <button
            onClick={handleClick}
            type="button"
            className="w-24 h-24 rounded-full bg-center bg-no-repeat bg-cover"
            style={{
              backgroundImage: `url(${profileImg})`,
            }}
          />

          {profileImg !== "/images/defaultProfile.png" && !isKakao && (
            <div
              className="absolute right-4 rounded-full border border-solid border-gray-100 w-7 h-7 flex items-center justify-center cursor-pointer"
              onClick={() => {
                const fileName = userInfo.imgurl.split("/").pop() || "";
                deleteFileMutation.mutate(fileName);
              }}
            >
              <i className="fas fa-trash text-red-600" />
            </div>
          )}
          <p className="text-xs">{userInfo?.email}</p>
        </div>
      </div>
      <div className="w-full h-60 bg-white">
        <div className="m-5">
          <h1 className="text-xl font-bold pb-2">상태메시지</h1>
          <input
            className="w-full h-10 border border-solid border-gray-200"
            placeholder="상태메시지를 입력해주세요."
            type="text"
          />
        </div>
      </div>
    </div>
  );
}
