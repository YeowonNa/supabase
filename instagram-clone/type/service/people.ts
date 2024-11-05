import { User } from "type";
import Response from "type/Response";

export interface PeopleSvcParamType {
  allPeopleListFallbackData?: Response<User> | null;
}
