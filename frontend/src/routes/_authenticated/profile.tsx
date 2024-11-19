import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/api";
import { User, Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>User not logged in</div>;

  const { given_name, family_name, email, picture } = data?.user || {};

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar>
          {picture ? (
            <AvatarImage src={picture} alt={`${given_name} ${family_name}`} />
          ) : (
            <AvatarFallback>
              <User />
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="text-2xl font-semibold">
            {given_name} {family_name}
          </p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>
      <div>
        <a
          href="/api/logout"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          <Camera />
          <span>Logout</span>
        </a>
      </div>
    </div>
  );
}
