import { refs } from './js/refs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Debounce from 'lodash.debounce';

import { PixabayAPI } from './js/PixabayAPI';

const DEBOUNCE_DELAY = 300;

const pixabay = new PixabayAPI();
const lightbox = new SimpleLightbox('.gallery a');

refs.input.addEventListener('input', Debounce(onInput, DEBOUNCE_DELAY));
refs.loadMoreBtn.addEventListener('click', loadMore);

async function onInput(event) {
  pixabay.itemToFind = event.target.value.trim().toLowerCase();
  if (!pixabay.itemToFind) {
    clearPage();
    return;
  }
  pixabay.resetCurrPage();
  refs.loadMoreBtn.classList.add('is-hidden');

  const serverData = await pixabay.getImages();
  if (pixabay.totalItems === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  Notiflix.Notify.success(`Hooray! We found ${pixabay.totalItems} images !`);

  clearPage();

  insertMarkup(serverData);

  lightbox.refresh();

  if (pixabay.canLoadMore) {
    refs.loadMoreBtn.classList.remove('is-hidden');
  }

  scroll();
}

function scroll() {
  const headerHeight = refs.forScrollElem.scrollHeight;

  window.scrollBy({
    top: headerHeight,
    behavior: 'smooth',
  });
}

function clearPage() {
  refs.galleryBlock.innerHTML = '';
}

async function loadMore() {
  refs.loadMoreBtn.classList.add('is-hidden');

  pixabay.increaseCurrPage();

  const serverData = await pixabay.getImages();

  insertMarkup(serverData);

  lightbox.refresh();

  if (pixabay.canLoadMore) {
    refs.loadMoreBtn.classList.remove('is-hidden');
  }
}

function insertMarkup(picturesArray) {
  const galleryMarkup = picturesArray.hits
    .map(({ webformatURL, largeImageURL, tags, views, downloads, likes, comments }) => {
      return `<div class="photo-card">
                <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" class="photo-img" loading="lazy" /></a>
                <div class="info">
                  <p class="info-item">
                    <b>Likes</b>${likes}
                  </p>
                  <p class="info-item">
                    <b>Views</b>${views}
                  </p>
                  <p class="info-item">
                    <b>Comments</b>${comments}
                  </p>
                  <p class="info-item">
                    <b>Downloads</b>${downloads}
                  </p>
                </div>
              </div>`;
    })
    .join('');

  refs.galleryBlock.insertAdjacentHTML('beforeend', galleryMarkup);
}
