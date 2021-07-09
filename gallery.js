import galleryItems from './app.js';

const galleryListEl = document.querySelector('.js-gallery');
const backdropEl = document.querySelector('.js-lightbox');
const backdropImgEl = document.querySelector('.lightbox__image');

galleryListEl.addEventListener('click', onOpenModal);
backdropEl.addEventListener('click', onBackdropClick);

galleryListEl.insertAdjacentHTML('beforeend', makeGalleryMarkup(galleryItems));

function makeGalleryMarkup(images) {
  return images
    .map(({ preview, original, description }) => {
      return `<li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>`;
    })
    .join('');
}

function onOpenModal(evt) {
  if (!evt.target.classList.contains('gallery__image')) {
    return;
  }
  evt.preventDefault();
  backdropEl.classList.add('is-open');
  window.addEventListener('keydown', onOpenModalKeyPress);
  backdropImgEl.setAttribute('src', `${evt.target.dataset.source}`);
  backdropImgEl.setAttribute('alt', `${evt.target.getAttribute('alt')}`);
}

function onCloseModal() {
  backdropEl.classList.remove('is-open');
  window.removeEventListener('keydown', onOpenModalKeyPress);
  backdropImgEl.removeAttribute('src');
  backdropImgEl.removeAttribute('alt');
}

function onBackdropClick({ target: { classList } }) {
  if (
    !classList.contains('lightbox__overlay') &&
    !classList.contains('lightbox__button')
  ) {
    return;
  }
  onCloseModal();
}

function onOpenModalKeyPress({ code }) {
  switch (code) {
    case 'Escape':
      onCloseModal();
      return;
    case 'ArrowRight':
      onArrowRightKeyPress();
      return;
    case 'ArrowLeft':
      onArrowLeftKeyPress();
      return;
  }
}

function onArrowRightKeyPress() {
  const currentIndex = getIndexCurrentImg();
  const firstImg = 0;
  const lastImg = galleryListEl.children.length - 1;
  const index = currentIndex === lastImg ? firstImg : currentIndex + 1;
  setModalImg(index);
}

function onArrowLeftKeyPress() {
  const currentIndex = getIndexCurrentImg();
  const firstImg = 0;
  const lastImg = galleryListEl.children.length - 1;
  const index = currentIndex === firstImg ? lastImg : currentIndex - 1;
  setModalImg(index);
}

function getIndexCurrentImg() {
  return [...galleryListEl.children].findIndex(
    el =>
      el.firstElementChild.getAttribute('href') ===
      backdropImgEl.getAttribute('src'),
  );
}

function setModalImg(index) {
  backdropImgEl.setAttribute(
    'src',
    `${galleryListEl.children[index].firstElementChild.getAttribute('href')}`,
  );
  backdropImgEl.setAttribute(
    'alt',
    `${galleryListEl.children[
      index
    ].firstElementChild.firstElementChild.getAttribute('alt')}`,
  );
}
