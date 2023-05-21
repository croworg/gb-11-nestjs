import { News } from '../../news/news.service';

export function renderNewsAll(news: News[]) {
  let newsListHtml = '';
  for (const newsItem of news) {
    newsListHtml += renderNewsBlock(newsItem);
  }
  return `
  <div class="container p-3">
    <h1 class="text-center mb-3">Список новостей</h1>
    <div class="row">${newsListHtml}</div>
  </div>
`;
}

function renderNewsBlock(news: News) {
  return `
  <div class="col-lg-4 mb-3">
    <div class="card" style="width: 100%;">
      <div class="card-header h5">${news.title}</div>
      ${
        news.cover &&
        `<img class="card-img-top" style="height: 300px; object-fit: cover" src="${news.cover}" alt="Card image cap">`
      }
      <div class="card-body">
        <h6 class="card-title text-muted">Author: ${news.author}</h6>
        <p class="card-text">${news.description}</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div>
  `;
}
