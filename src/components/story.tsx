"use client";
import { timeAgo } from "@/lib/utils";
import StoryUtil from "@/components/StoryUtil";

type StoryProps = {
  id: number;
  by: string;
  title: string;
  time: number;
  url?: string;
  text?: string;
  score: number;
  descendants: number;
};

export default function Story(props: StoryProps) {
  return (
    <>
      <a href={`/item/${props.id}`} className="absolute w-full h-full" />
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
        <StoryUtil
          url={props.url}
          score={props.score}
          descendants={props.descendants}
        />
      </div>
    </>
  );
}
