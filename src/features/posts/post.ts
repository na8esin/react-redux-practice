export type Post = {
  id: string;
  title: string;
  content: string;
  date: string;
  user: string;
  reactions: {
    [key: string]: number
  }
}
