import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllUserTable } from "actions/chatAction";
import PeopleDomain from "components/domain/PeopleDomain";

export const metadata = {
  title: "Instagram",
  description: "instagram clone",
};

export default async function PeoplePage() {
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
      <main className="w-full h-full flex flex-col items-center">
        <PeopleDomain />
      </main>
    </HydrationBoundary>
  );
}
