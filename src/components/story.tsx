"use client";
import { timeAgo } from "@/lib/utils";
import StoryUtil from "@/components/StoryUtil";
import { ItemType } from "@/lib/types";

type StoryProps = {
  id: number;
  by: string;
  title: string;
  time: number;
  url?: string;
  text?: string;
  score: number;
  descendants: number;
  type: ItemType;
};

export default function Story(props: StoryProps) {
  return (
    <div className="flex flex-col w-full gap-2 py-4 h-fit relative p-1">
      {props.type === "job" ? (
        <a href={props.url} className="absolute inset-0" target="_blank" />
      ) : (
        <a href={`/item/${props.id}`} className="absolute inset-0" />
      )}
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
      {props.type === "job" ? (
        ""
      ) : (
        <StoryUtil
          url={props.url}
          score={props.score}
          descendants={props.descendants}
        />
      )}
    </div>
  );
}
