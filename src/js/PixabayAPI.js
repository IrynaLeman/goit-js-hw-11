import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com';

export class PixabayAPI {
  currPage = 1;
  totalPages;
  totalItems;
  itemToFind;
  canLoadMore;
  requestAdditionalOptions = '&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';
  AUTH_TOKEN = '31402040-631f3b22a192d4a5ae2a7d994';

  async getImages() {
    const { status, data } = await axios.get(
      `/api/?key=${this.AUTH_TOKEN}&q=${this.itemToFind}&${this.requestAdditionalOptions}&page=${this.currPage}`
    );

    this.totalItems = data.totalHits;

    if (!status === 200) {
      throw new Error();
    }

    this.totalPages = Math.ceil(data.totalHits / 40);

    this.canLoadMore = this.currPage < this.totalPages;

    return data;
  }

  increaseCurrPage() {
    this.currPage += 1;
  }

  resetCurrPage() {
    this.currPage = 1;
  }
}
