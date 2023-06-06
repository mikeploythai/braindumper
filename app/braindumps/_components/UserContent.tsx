import { SupabaseClient, User } from "@supabase/supabase-js";
import Dump from "./Dump";

type UserContentProps = {
  supabase: SupabaseClient<any, "public", any>;
  user: User;
};

export default async function UserContent({
  supabase,
  user,
}: UserContentProps) {
  const { data, error } = await supabase
    .from("braindumps")
    .select("id, updated_at, title, dump")
    .eq("owner_id", user.id);

  if (error) {
    return (
      <div className="flex flex-col gap-2 rounded-md border-2 border-dashed border-red-500 bg-red-100 p-4">
        <code className="font-semibold">{`Error code: ${error?.code}`}</code>
        <code>{error?.message}</code>
        <hr className="border-t-2 border-dashed border-red-500" />
        <code className="text-sm">Please share this with an engineer!</code>
      </div>
    );
  }

  if (!data?.length) {
    return <p>You have no braindumps! 👎</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {data.reverse().map((data) => {
        return <Dump key={data.id} data={data} />;
      })}
    </div>
  );
}
