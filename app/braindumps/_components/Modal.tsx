import { DumpData } from "@/lib/types";
import { Dialog } from "@headlessui/react";
import {
  ArrowUpOnSquareIcon,
  CheckIcon,
  PencilIcon,
  TagIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import { useState } from "react";

dayjs.extend(relativeTime);

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  data?: DumpData;
  id?: string;
};

export default function Modal({ isOpen, setIsOpen, data, id }: ModalProps) {
  const date = new Date();
  const currDate = `${date.getFullYear()}-${String(date.getMonth()).padStart(
    2,
    "0"
  )}-${String(date.getDay()).padStart(2, "0")}`;

  const supabase = createClientComponentClient();
  const [title, setTitle] = useState(data?.title ?? currDate);
  const [dump, setDump] = useState(data?.dump ?? "");
  const [isEditing, setIsEditing] = useState(data ? false : true);
  const [isDisabled, setIsDisabled] = useState(true);
  const router = useRouter();

  function handleDiscard() {
    if (data) {
      setIsEditing(false);
      setTitle(data?.title ?? "");
      setDump(data?.dump ?? "");
    } else {
      setIsOpen(false);
    }
  }

  async function handleClose() {
    setIsOpen(false);
    setIsDisabled(true);

    if (data) {
      await handleUpdate();
    } else {
      await handleNewCard();
    }
  }

  async function handleUpdate() {
    if (!(data?.title === title && data?.dump === dump)) {
      try {
        const { error } = await supabase
          .from("braindumps")
          .update({
            title: title ?? data?.title,
            dump: dump ?? data?.dump,
            updated_at: date.toISOString(),
          })
          .eq("id", data?.id);

        if (error) alert(error.details);
      } finally {
        router.refresh();
      }
    }
  }

  async function handleNewCard() {
    setIsEditing(true);

    if (dump.length) {
      try {
        const { error } = await supabase.from("braindumps").insert({
          owner_id: id,
          title: title,
          dump: dump,
        });

        if (error) alert(error.details);
      } finally {
        setTitle("");
        setDump("");
        router.refresh();
      }
    }
  }

  async function handleDelete() {
    setIsOpen(false);

    try {
      const { error } = await supabase
        .from("braindumps")
        .delete()
        .eq("id", data?.id);

      if (error) alert(error.details);
    } finally {
      router.refresh();
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div
        className="fixed inset-0 hidden bg-slate-900/50 md:block"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center md:p-4">
        <Dialog.Panel className="flex h-full w-full flex-col gap-4 rounded-md bg-slate-100 p-4 md:max-w-screen-sm md:p-8">
          <div className="flex flex-col gap-1">
            <Dialog.Title className="flex items-center justify-between gap-2">
              <input
                name="title"
                value={title}
                placeholder="Title"
                onChange={(e) => {
                  e.preventDefault();
                  setTitle(e.target.value);

                  if (e.target.value === data?.title) {
                    setIsDisabled(true);
                  } else {
                    setIsDisabled(false);
                  }
                }}
                className="w-full bg-slate-100 text-2xl font-semibold read-only:cursor-default focus:outline-none"
                readOnly={!isEditing}
              />

              <div className="flex gap-2">
                {!isEditing && (
                  <>
                    <button
                      type="button"
                      className="inline-flex rounded-full bg-slate-900 px-2 py-2 text-sm text-slate-100 hover:bg-slate-900/90 active:bg-slate-900/80 md:px-4"
                      onClick={handleClose}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </Dialog.Title>
            {data?.updated_at && (
              <small className="text-xs font-extralight">
                Last updated {dayjs(data.updated_at).fromNow()}
              </small>
            )}
          </div>

          <Dialog.Description className="h-full">
            <textarea
              name="dump"
              value={dump}
              placeholder="Start dumping your brain..."
              onChange={(e) => {
                e.preventDefault();
                setDump(e.target.value);

                if (e.target.value === data?.dump) {
                  setIsDisabled(true);
                } else {
                  setIsDisabled(false);
                }
              }}
              className="h-full w-full resize-none bg-slate-100 read-only:cursor-default focus:outline-none"
              readOnly={!isEditing}
            />
          </Dialog.Description>

          <div className="flex gap-2 border-t-2 pt-2.5">
            {!isEditing ? (
              <>
                <button
                  type="button"
                  className="inline-flex rounded-full px-2 py-2 text-sm text-slate-900 hover:bg-slate-900/10 active:bg-slate-900/20 md:px-4"
                  onClick={() => setIsEditing(true)}
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="inline-flex rounded-full px-2 py-2 text-sm text-slate-900 hover:bg-slate-900/10 active:bg-slate-900/20 aria-disabled:opacity-50 md:px-4"
                  aria-disabled
                >
                  <TagIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="inline-flex rounded-full px-2 py-2 text-sm text-slate-900 hover:bg-slate-900/10 active:bg-slate-900/20 aria-disabled:opacity-50 md:px-4"
                  aria-disabled
                >
                  <ArrowUpOnSquareIcon className="h-5 w-5" />
                </button>

                {data && (
                  <button
                    type="button"
                    className="inline-flex rounded-full px-2 py-2 text-sm text-slate-900 hover:bg-red-500 hover:text-slate-100 active:bg-red-600 active:text-slate-100 md:px-4"
                    onClick={handleDelete}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  aria-disabled={isDisabled}
                  className="rounded-full bg-slate-900 px-2 py-2 text-sm text-slate-100 hover:bg-slate-900/90 active:bg-slate-900/80 aria-disabled:opacity-50 md:px-4"
                  onClick={() => !isDisabled && setIsEditing(false)}
                >
                  <CheckIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="rounded-full px-2 py-2 text-sm text-slate-900 hover:bg-red-500 hover:text-slate-100 active:bg-red-600 active:text-slate-100 md:px-4"
                  onClick={handleDiscard}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
