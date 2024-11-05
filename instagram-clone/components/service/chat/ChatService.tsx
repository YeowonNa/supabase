import { User } from "type";
import ChatImpl from "../impl/ChatImpl";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { SetterOrUpdater, useRecoilState, useRecoilValue } from "recoil";
import {
  presenceState,
  selectedUserIdState,
  userState,
} from "utils/supabase/recoil/atoms";
import { useRouter } from "next/navigation";
import ChatScreenImpl from "../impl/ChatScreenImpl";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import {
  Dispatch,
  KeyboardEvent,
  MutableRefObject,
  SetStateAction,
} from "react";

export interface ChatItemProps {
  user: User | undefined;
  router: AppRouterInstance;
  selectedUserId: string | null;
  presence: string;
  setSelectedUserId: SetterOrUpdater<any>;
  setPresence: SetterOrUpdater<any>;
  fetchChatList: (params: ChatItemProps) => {
    chatUsersError: any;
    filteredUsers: User[] | null;
    onClickHandler: (userId: string) => void;
  };
  fetchChatScreen: (params: ChatItemProps) => {
    selectedUserQuery: UseQueryResult<any, Error>;
    chatContainerRef: MutableRefObject<any>;
    getAllMessagesQuery: UseQueryResult<any[], Error>;
    message: string;
    setMessage: Dispatch<SetStateAction<string>>;
    handleClick: () => void;
    sendMessageMutation: UseMutationResult<null, Error, void, unknown>;
    handleKeyDown: (e: KeyboardEvent) => void;
  };
}

export default function ChatService() {
  const user = useRecoilValue(userState);
  const router = useRouter();
  const fetchChatList = (param: ChatItemProps) => ChatImpl(param);
  const fetchChatScreen = (param: ChatItemProps) => ChatScreenImpl(param);

  const [selectedUserId, setSelectedUserId] =
    useRecoilState(selectedUserIdState);
  const [presence, setPresence] = useRecoilState(presenceState);

  return {
    user,
    router,
    selectedUserId,
    presence,
    setSelectedUserId,
    setPresence,
    fetchChatList,
    fetchChatScreen,
  };
}
