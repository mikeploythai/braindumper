import { Session, SupabaseClient } from "@supabase/supabase-js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type UserContentProps = {
  supabase: SupabaseClient<any, "public", any>;
  session: Session | null;
};

export default async function UserContent({
  supabase,
  session,
}: UserContentProps) {
  const user = session?.user;
  const { data: userData } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user?.id)
    .single();
  const { data: brainDumps } = await supabase
    .from("braindumps")
    .select("id, updated_at, title, dump")
    .eq("owner_id", user?.id);

  return (
    <>
      <h1>{userData?.full_name}</h1>
      {brainDumps?.map(({ id, updated_at, title, dump }) => {
        return (
          <article key={id}>
            <h1>{title}</h1>
            <p className="line-clamp-4">{dump}</p>
            <small>Last updated {dayjs(updated_at).fromNow()}</small>
          </article>
        );
      })}
    </>
  );
}
