import { News } from '../../news/news.service';

export function renderNewsAll(news: News[]) {
  let newsListHtml = '';
  for (const newsItem of news) {
    newsListHtml += renderNewsBlock(newsItem);
  }
  return `<h1>Список новостей</h1>
<div class="row">${newsListHtml}</div>
`;
}

export function renderNewsBlock(news: News) {
  return `
  <div class="col-lg-4 mb-3">
    <div class="card" style="width: 100%;">
      ${
        news.cover &&
        `<img class="card-img-top" style="height: 300px; object-fit: cover" src="${news.cover}" alt="Card image cap">`
      }
      <div class="card-body">
        <h5 class="card-title">${news.title}</h5>
        <h6 class="card-title">${news.author}</h6>
        <p class="card-text">${news.description}</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div>
  `;
}
