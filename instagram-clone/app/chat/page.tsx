import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllUserTable } from "actions/chatAction";
import ChatDomain from "components/domain/ChatDomain";

export default async function ChatPate() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const users = await getAllUserTable();
      return users;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full h-full flex">
        <ChatDomain />
      </div>
    </HydrationBoundary>
  );
}
