export interface ITwitterData {
    country: string,
    hashtags: string[],
    id: string,
    poi_name: string,
    score: number,
    sentiment: number,
    top_neg_reply: string,
    top_pos_reply: string,
    topics: string,
    tweet_date: Date,
    tweet_text: string,
    link: string
  }