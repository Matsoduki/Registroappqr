export class Post {
  
  id = 0;
  title = '';
  body = '';
  author = '';
  date = '';
  authorImage ='';

  constructor() { }

  public static getNewPost(
    id: number,
    title: string,
    body: string,
    author: string,
    date: string,
    authorImage: string
  ) {
    const post = new Post()
    post.id = id;
    post.title = title;
    post.body = body;
    post.author = author;
    post.date = date;
    post.authorImage = authorImage;
    return post;
  }
}