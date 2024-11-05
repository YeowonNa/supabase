export interface User {
  id: string;
  created_at: string;
  username: string;
  email: string;
  statemessage: string;
  imgurl: string;
}

export interface Message {
  id: string;
  message: string;
  sender: string;
  receiver: string;
  is_deleted?: boolean;
  created_at: string;
}
