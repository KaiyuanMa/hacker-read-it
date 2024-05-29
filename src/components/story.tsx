"use client";
import { timeAgo } from "@/lib/utils";
import Up from "../../public/up.svg";
import Comment from "../../public/comment.svg";

type StoryProps = {
  id: number;
  by: string;
  title: string;
  time: number;
  url?: string;
  text?: string;
  score?: number;
  descendants: number;
};

export default function Story(props: StoryProps) {
  return (
    <div className="flex flex-col w-full gap-2 border-b py-4 border-border-primary">
      <div>
        <div className="flex items-center gap-2 text-text-tertiary text-sm">
          <div className="font-semibold">{props.by}</div>
          <div className="font-light">{timeAgo(props.time)}</div>
        </div>
        <h2 className="font-semibold text-lg">{props.title}</h2>
      </div>
      {props.text !== undefined ? (
        <div
          className="story-text | text-sm text-text-secondary"
          dangerouslySetInnerHTML={{ __html: props.text }}
        />
      ) : (
        ""
      )}
      <div className="truncate text-sm">
        <a
          className="text-text-brand hover:underline"
          href={props.url}
          target="_blank"
        >
          {props.url}
        </a>
      </div>
      <div className="flex gap-4">
        <div className="flex gap-2 items-center">
          <div className="text-text-secondary fill-current text-sm w-4">
            <Up />
          </div>
          <span className="text-sm">{props.score}</span>
        </div>
        <div className="flex gap-2 items-center">
          <div className="text-text-secondary fill-current text-sm w-[1.1rem]">
            <Comment />
          </div>
          <span className="text-sm">{props.descendants}</span>
        </div>
      </div>
    </div>
  );
}
