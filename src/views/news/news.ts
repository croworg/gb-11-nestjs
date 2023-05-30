import { News } from '../../news/news.service';
import { Comment } from '../../news/comments/comments.service';

export function renderNews(news: News, comments: Comment[] | null) {
  return `
  <div class="wrapper p-3">
    <div class="row d-flex justify-content-center">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body text-center">
            <h1 class="card-title">${news.title}</h1>
            <img class="card-img text-center mb-3" src="${news.cover}"
             alt="${news.title}">
            <p class="text-muted text-left">Author: ${news.author}</p>
            <p class="card-text">${news.description}</p>
          </div>
          <div class="card-body text-center">
            <h4 class="h4 mb-0">Latest Comments</h4>
          </div>
          <div class="comment-widgets px-3">
            ${
              comments
                ? renderCommentsBlock(comments)
                : '<div class="comment-text w-100 mb-3 text-center"><h6>No comments yet!</h6></div>'
            }
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

export function renderCommentsBlock(comments: Comment[]): string {
  let commentsListHtml = ``;
  for (const comment of comments) {
    commentsListHtml += `
      <div class="d-flex flex-row comment-row m-t-0 mb-4">
        <div class="px-3"><img class="rounded-circle shadow-1-strong mb-4" src="${
          (comment?.avatar && comment.avatar) ||
          'https://i.imgur.com/Ur43esv.jpg'
        }" style="width: 100px; height: 100px; object-fit: cover" alt="Avatar" /></div>
        <div class="comment-text w-100">
          <h6 class="font-medium">${comment.author}</h6>
          <span class="mb-2 d-block">${comment.message}</span>
          <div class="comment-footer">
            <button type="button" class="btn btn-cyan btn-sm">Edit</button>
            <button type="button" class="btn btn-danger btn-sm">Delete</button>
          </div>
        </div>
      </div>
    `;
  }
  return commentsListHtml;
}
