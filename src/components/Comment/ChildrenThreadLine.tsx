import React from "react";

function ChildrenThreadLine({
  parentIsComment,
  isLastChildren,
}: {
  parentIsComment: boolean;
  isLastChildren: boolean;
}) {
  return (
    <>
      {parentIsComment ? (
        <div
          className={`threadline flex justify-end align-start relative pointer-events-none ${
            isLastChildren ? "bg-surface-primary" : ""
          }`}
        >
          <div
            className={`box-border h-4 border-1 border-border-tertiary border-solid border-b-[1px] w-[calc(50%+0.5px)] rounded-bl-[12px] ${
              isLastChildren ? "border-l-[1px]" : ""
            }`}
          />
        </div>
      ) : (
        <div />
      )}
    </>
  );
}

export default ChildrenThreadLine;
