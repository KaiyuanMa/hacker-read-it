export interface BaseItem {
  id: number;
  type: ItemType;
  deleted?: boolean;
  by?: string;
  time?: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
}

export interface CommentItem extends BaseItem {
  type: "comment";
  by: string;
  id: number;
  kids?: number[];
  parent: number;
  text: string;
  time: number;
}

export interface StoryItem extends BaseItem {
  type: "story";
  by: string;
  id: number;
  descendants?: number;
  kids?: number[];
  score: number;
  time: number;
  title: string;
  url?: string;
  text?: string;
}

export interface JobItem extends BaseItem {
  type: "job";
  by: string;
  id: number;
  score?: number;
  time: number;
  title: string;
  url?: string;
  text?: string;
}

export interface PollItem extends BaseItem {
  type: "poll";
  by: string;
  id: number;
  parts?: number[];
  descendants?: number;
  score: number;
  time: number;
  title: string;
  text?: string;
}

export interface PollOptItem extends BaseItem {
  type: "pollopt";
  by: string;
  id: number;
  poll: number;
  score?: number;
  text?: string;
  time: number;
}

export type ItemType = "job" | "story" | "comment" | "poll" | "pollopt";
