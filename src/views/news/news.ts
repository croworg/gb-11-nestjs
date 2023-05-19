import { News } from '../../news/news.service';
import { Comment } from '../../news/comments/comments.service';

export function renderNews(news: News, comments: Comment[]) {
  let commentsListHtml = '';
  if (comments === null) {
    commentsListHtml = `
      <div class="d-flex flex-row comment-row m-t-0 mb-2">
        <div class="comment-text w-100 mb-3">
          <h6 class="font-medium text-center">No comments yet!</h6>
        </div>
      </div>
    `;
  } else {
    for (const commentsItem of comments) {
      commentsListHtml += renderCommentsBlock(commentsItem);
    }
  }
  return renderNewsBlock(news, commentsListHtml);
}

export function renderNewsBlock(news, comments) {
  return `
  <div class="row d-flex justify-content-center mt-3 mb-3">
        <div class="col-lg-6">
            <div class="card">
                <div class="card-body text-center">
                    <h1 class="card-title">${news.title}</h1>
                    <img class="card-img text-center mb-3" src="${news.cover}" alt="${news.title}">
                    <p class="text-muted text-left">${news.author}</p>
                    <p class="card-text">${news.description}</p>
                </div>
                <div class="card-body text-center">
                    <h4 class="h4 mb-0">Latest Comments</h4>
                </div>
                <div class="comment-widgets px-3">
                    ${comments}
                </div>
            </div>
        </div>
    </div>
  `;
}

export function renderCommentsBlock(comment: Comment) {
  return `
      <div class="d-flex flex-row comment-row m-t-0 mb-4">
          <div class="p-2"><img src="https://i.imgur.com/Ur43esv.jpg" alt="user" width="50" class="rounded-circle"></div>
          <div class="comment-text w-100">
              <h6 class="font-medium">${comment.author}</h6>
              <span class="mb-2 d-block">This is awesome website. I would love to come back again. </span>
              <div class="comment-footer">
                  <button type="button" class="btn btn-cyan btn-sm">Edit</button>
                  <button type="button" class="btn btn-danger btn-sm">Delete</button>
              </div>
          </div>
      </div>
  `;
}
