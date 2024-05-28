type StoryProps = {
  id: string;
  by: string;
  title: string;
  time: number;
  url?: string;
  text?: string;
  descendants: number;
};

export default function Story(props: StoryProps) {}
