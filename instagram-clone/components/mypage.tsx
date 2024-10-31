"use client";

import { useMutation } from "@tanstack/react-query";
import { deleteFiles, upLoadFile } from "actions/storageAction";
import React, { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "utils/supabase/recoil/atoms";
import getImageUrl from "utils/supabase/storage";
import { getUserInfo, updateUserProfile } from "actions/userInfoAction";
import { queryClient } from "config/ReactQueryClientProvider";
import { Button } from "@material-tailwind/react";

export default function Mypage({ userInfo, isKakao }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [user, setUser] = useRecoilState(userState);
  const [userName, setUserName] = useState(user?.username || "");
  const [stateMessage, setStateMessage] = useState(user?.statemessage || "");
  const [profileImg, setProfileImg] = useState(
    user?.imgurl ||
      userInfo?.user_metadata?.avatar_url ||
      "/images/defaultProfile.png"
  );
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

      setProfileImg(publicUrl);
    },
  });

  // 파일 삭제
  const deleteFileMutation = useMutation({
    mutationFn: deleteFiles,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["images"],
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

  const handleStateMessageChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setStateMessage(e.target.value);
  };

  const handleUpdateMutation = useMutation({
    mutationFn: async () => {
      const updatedUserProfile = {
        id: user?.id,
        username: userName,
        statemessage: stateMessage,
      };
      await updateUserProfile(updatedUserProfile);

      // 업데이트된 프로필 정보를 다시 가져옴
      const updatedUserInfo = await getUserInfo(user.id);
      return updatedUserInfo;
    },
    onSuccess: (updatedUserInfo) => {
      setUser(updatedUserInfo);
    },
    onError: () => {
      alert("프로필 업데이트에 실패했습니다.");
    },
  });

  const handleUpdate = async () => {
    if ((!isKakao && userName.trim() !== "") || stateMessage.trim() !== "") {
      try {
        let finalImageUrl = profileImg;
        if (profileImg === "/images/defaultProfile.png") {
          finalImageUrl = null;
        }

        // DB 업데이트
        await updateUserProfile({
          id: user?.id,
          imgurl: finalImageUrl,
          username: userName,
          statemessage: stateMessage,
        });

        // 최신 정보 가져오기
        const updatedUserInfo = await getUserInfo(user?.id);

        if (updatedUserInfo) {
          // Recoil 상태 업데이트
          setUser(updatedUserInfo);

          // 로컬 상태 업데이트
          const newImageUrl =
            updatedUserInfo.imgurl === null
              ? "/images/defaultProfile.png"
              : updatedUserInfo.imgurl;

          setProfileImg(newImageUrl);
          setUserName(updatedUserInfo.username || "");
          setStateMessage(updatedUserInfo.statemessage || "");
        }

        alert("프로필이 성공적으로 업데이트되었습니다.");
      } catch (error) {
        console.error("프로필 업데이트 중 에러 발생:", error);
        alert("프로필 업데이트에 실패했습니다.");
      }
    } else if (isKakao) {
      alert("카카오톡 내에서 변경해주세요.");
    }
  };

  return (
    <div className="w-full h-full bg-blue-gray-50 flex px-10 py-8 items-center justify-center">
      <div className="w-fit flex flex-col border border-solid border-gray-300 bg-white p-8 rounded-md shadow-md">
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
          <p className="text-xs h-4">{user?.email}</p>
        </div>
        <div className="flex flex-col items-center mt-3 gap-2">
          <input
            type="text"
            value={userName}
            onChange={handleUserNameChange}
            placeholder={user?.username || "이름"}
            className="w-56 border border-solid border-gray-400 text-center text-sm py-1 rounded-lg"
          />
          <textarea
            value={stateMessage}
            onChange={handleStateMessageChange}
            maxLength={20}
            placeholder={user?.statemessage || "상태메시지"}
            className="w-56 border border-solid border-gray-400 text-center text-sm py-1 px-1 resize-none rounded-lg"
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
