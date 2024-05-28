import axios from "axios";

const scheme = process.env.HACKER_NEWS_API_SCHEME;
const host = process.env.HACKER_NEWS_API_HOST;
const version = process.env.HACKER_NEWS_API_VERSION;

export const getItems = async (itemId: string) => {
  const response = await axios.get(
    `${scheme}://${host}/${version}/item/${itemId}.json?print=pretty`
  );
  return response.data;
};

export const getBestStories = async (): Promise<number[]> => {
  const response = await axios.get(
    `${scheme}://${host}/${version}/item/beststories.json?print=pretty`
  );
  return response.data;
};

export const getTopStories = async (): Promise<number[]> => {
  const response = await axios.get(
    `${scheme}://${host}/${version}/item/topstories.json?print=pretty`
  );
  return response.data;
};

export const getNewStories = async (): Promise<number[]> => {
  const response = await axios.get(
    `${scheme}://${host}/${version}/item/newstories.json?print=pretty`
  );
  return response.data;
};

export const getAskes = async (): Promise<number[]> => {
  const response = await axios.get(
    `${scheme}://${host}/${version}/item/askstories.json?print=pretty`
  );
  return response.data;
};

export const getShows = async (): Promise<number[]> => {
  const response = await axios.get(
    `${scheme}://${host}/${version}/item/showstories.json?print=pretty`
  );
  return response.data;
};

export const getJobs = async (): Promise<number[]> => {
  const response = await axios.get(
    `${scheme}://${host}/${version}/item/showstories.json?print=pretty`
  );
  return response.data;
};
