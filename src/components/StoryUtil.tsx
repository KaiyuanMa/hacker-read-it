import Up from "../../public/up.svg";
import Comment from "../../public/comment.svg";

type StoryUtilProps = {
  url?: string;
  score: number;
  descendants: number;
};

export default function StoryUtil(props: StoryUtilProps) {
  return (
    <>
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
    </>
  );
}
