"use client";

import { Dialog } from "@headlessui/react";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import { useState } from "react";

dayjs.extend(relativeTime);

interface CardData {
  id: string;
  title: string;
  dump: string;
  updated_at: string;
}

export default function Card({ data }: { data: CardData }) {
  const supabase = createClientComponentClient();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(data.title ?? "");
  const [dump, setDump] = useState(data.dump ?? "");
  const [editing, isEditing] = useState(false);
  const router = useRouter();

  function handleDiscard() {
    isEditing(false);
    setTitle(data.title);
    setDump(data.dump);
  }

  async function handleClose() {
    setIsOpen(false);

    if (!(data.title === title && data.dump === dump)) {
      try {
        const { error } = await supabase
          .from("braindumps")
          .update({
            title: title ?? data.title,
            dump: dump ?? data.dump,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.id);

        if (error) alert(error.details);
      } finally {
        router.refresh();
      }
    }
  }

  return (
    <>
      <article
        className="flex flex-col gap-4 rounded-md bg-black p-4 text-white hover:cursor-pointer hover:bg-black/90 active:bg-black/80"
        onClick={() => setIsOpen(true)}
      >
        <div>
          <h1 className="text-lg font-semibold">{data.title}</h1>
          <p className="line-clamp-4 text-base">{data.dump}</p>
        </div>
        <small className="text-xs font-extralight">
          Last updated {dayjs(data.updated_at).fromNow()}
        </small>
      </article>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="flex h-full w-full max-w-screen-sm flex-col gap-4 rounded-md bg-white p-8">
            <div className="flex flex-col gap-1">
              <Dialog.Title className="flex items-center justify-between gap-2">
                <input
                  name="title"
                  value={title}
                  onChange={(e) => {
                    e.preventDefault();
                    setTitle(e.target.value);
                  }}
                  className="w-full text-2xl font-semibold focus:outline-none"
                  readOnly={!editing}
                />

                <div className="flex gap-2">
                  {!editing ? (
                    <>
                      <button
                        type="button"
                        className="inline-flex rounded-full p-2 hover:bg-black/10 active:bg-black/20"
                        onClick={() => isEditing(true)}
                      >
                        <PencilIcon className="h-5 w-5 text-black" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex rounded-full bg-black p-2 hover:bg-black/90 active:bg-black/80"
                        onClick={handleClose}
                      >
                        <XMarkIcon className="h-5 w-5 text-white" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="rounded-full px-4 py-2 text-sm text-black hover:bg-red-500 hover:text-white active:bg-red-600 active:text-white"
                        onClick={handleDiscard}
                      >
                        Discard
                      </button>
                      <button
                        type="button"
                        className="rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-black/90 active:bg-black/80"
                        onClick={() => isEditing(false)}
                      >
                        Save
                      </button>
                    </>
                  )}
                </div>
              </Dialog.Title>
              <small className="text-xs font-extralight">
                Last updated {dayjs(data.updated_at).fromNow()}
              </small>
            </div>

            <Dialog.Description className="h-full">
              <textarea
                name="dump"
                value={dump}
                placeholder="Start dumping your brain..."
                onChange={(e) => {
                  e.preventDefault();
                  setDump(e.target.value);
                }}
                className="h-full w-full resize-none focus:outline-none"
                readOnly={!editing}
              />
            </Dialog.Description>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
