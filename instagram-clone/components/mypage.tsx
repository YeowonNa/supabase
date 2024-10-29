"use client";

import { useMutation } from "@tanstack/react-query";
import { deleteFiles, upLoadFile } from "actions/storageAction";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { profileImgState } from "utils/supabase/recoil/atoms";
import getImageUrl from "utils/supabase/storage";
import { getUserInfo, updateUserProfile } from "actions/userInfoAction";
import { queryClient } from "config/ReactQueryClientProvider";
import { Button } from "@material-tailwind/react";

export default function Mypage({ userInfo, isKakao }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profileImg, setProfileImg] = useRecoilState(profileImgState);
  const [userName, setUserName] = useState("");
  const [stateMessage, setStateMessage] = useState("");
  console.log(userInfo);

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
      await updateUserProfile({
        id: userInfo.id,
        imgurl: publicUrl,
      });

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

      await updateUserProfile({
        id: userInfo.id,
        imgurl: null,
      });
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

  const renderIcon = (profileImg: string) => {
    if (profileImg === "/images/defaultProfile.png") {
      return (
        <div className="absolute top-0 right-0 rounded-full border border-solid border-gray-100 bg-gray-100 w-7 h-7 flex items-center justify-center cursor-pointer">
          <i className="fas fa-camera" />
        </div>
      );
    } else {
      const fileName = userInfo?.imgurl?.split("/").pop() || "";
      return (
        <div
          className="absolute top-0 right-0 rounded-full border border-solid border-gray-100 bg-gray-100 w-7 h-7 flex items-center justify-center cursor-pointer"
          onClick={() => deleteFileMutation.mutate(fileName)}
        >
          <i className="fas fa-trash text-red-600" />
        </div>
      );
    }
  };

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleStateMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateMessage(e.target.value);
  };

  const handleUpdateMutation = useMutation({
    mutationFn: async () => {
      const updatedUserProfile = {
        id: userInfo?.id,
        username: userName,
        statemessage: stateMessage,
      };
      await updateUserProfile(updatedUserProfile);

      // 업데이트된 프로필 정보를 다시 가져옴
      const updatedUserInfo = await getUserInfo(userInfo.id);
      return updatedUserInfo;
    },
    onSuccess: (updatedUserInfo) => {
      setUserName(updatedUserInfo.username);
      setStateMessage(updatedUserInfo.statemessage);
    },
    onError: () => {
      alert("프로필 업데이트에 실패했습니다.");
    },
  });

  const handleUpdate = () => {
    if (userName.trim() !== "" || stateMessage.trim() !== "") {
      handleUpdateMutation.mutate();
    }
  };

  return (
    <div className="w-full h-screen bg-blue-gray-50 flex px-10 py-8 items-center justify-center">
      <div className="w-1/3 h-60 flex flex-col">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
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
              className={`w-24 h-24 rounded-full bg-center bg-no-repeat bg-cover ${
                isKakao ? "cursor-default" : "cursor-pointer"
              }`}
              style={{
                backgroundImage: `url(${profileImg})`,
              }}
            />

            {!isKakao && renderIcon(profileImg)}
          </div>
          <p className="text-xs">{userInfo?.email}</p>
        </div>
        <div className="flex flex-col items-center mt-3 gap-2">
          <input
            type="text"
            value={userName}
            onChange={handleUserNameChange}
            placeholder={userInfo?.username ? userInfo.username : "이름"}
            className="border-b-gray-300 border-b text-center"
          />
          <input
            type="text"
            value={stateMessage}
            onChange={handleStateMessageChange}
            placeholder={
              userInfo?.statemessage ? userInfo?.statemessage : "상태메시지"
            }
            className="border-b-gray-300 border-b text-center"
          />
        </div>
        <Button
          className="mt-3 flex items-center justify-center"
          onClick={handleUpdate}
          loading={handleUpdateMutation.isPending}
          disabled={handleUpdateMutation.isPending}
        >
          저장
        </Button>
      </div>
    </div>
  );
}
