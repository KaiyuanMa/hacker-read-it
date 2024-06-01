import axios from "axios";
import { BaseItem, ItemType } from "./types";

const scheme = process.env.NEXT_PUBLIC_HACKER_NEWS_API_SCHEME;
const host = process.env.NEXT_PUBLIC_HACKER_NEWS_API_HOST;
const version = process.env.NEXT_PUBLIC_HACKER_NEWS_API_VERSION;

export const getItem = async (itemId: string | number): Promise<BaseItem> => {
  const response = await axios.get(
    `${scheme}://${host}/${version}/item/${itemId}.json?print=pretty`
  );
  return response.data;
};

export const getItems = async (itemIds: number[]): Promise<BaseItem[]> => {
  const output = [];
  for (let id of itemIds) {
    const item = await getItem(id);
    output.push(item);
  }
  return output;
};

export const getBestStories = async (): Promise<number[]> => {
  const response = await axios.get(
    `${scheme}://${host}/${version}/beststories.json?print=pretty`
  );
  return response.data;
};

export const getTopStories = async (): Promise<number[]> => {
  const response = await axios.get(
    `${scheme}://${host}/${version}/topstories.json?print=pretty`
  );
  return response.data;
};

export const getNewStories = async (): Promise<number[]> => {
  const response = await axios.get(
    `${scheme}://${host}/${version}/newstories.json?print=pretty`
  );
  return response.data;
};

export const getAsks = async (): Promise<number[]> => {
  const response = await axios.get(
    `${scheme}://${host}/${version}/askstories.json?print=pretty`
  );
  return response.data;
};

export const getShows = async (): Promise<number[]> => {
  const response = await axios.get(
    `${scheme}://${host}/${version}/showstories.json?print=pretty`
  );
  return response.data;
};

export const getJobs = async (): Promise<number[]> => {
  const response = await axios.get(
    `${scheme}://${host}/${version}/showstories.json?print=pretty`
  );
  return response.data;
};
