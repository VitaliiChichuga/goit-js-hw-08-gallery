import galleryItems from './app.js';

const refs = {
    galery: document.querySelector('.js-gallery'),
    modalCloseBtn: document.querySelector('[data-action="close-lightbox"]'),
    modal: document.querySelector('.js-lightbox'),
    overlay: document.querySelector('.lightbox__overlay'),
    modalImage: document.querySelector('.lightbox__image'),
};

const images = galleryItems.reduce(
    (str, { preview, original, description }) =>
        str +
        `<li class="gallery__item">
  <a
    class="gallery__link"
    href=${original}
  >
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>
`,
    ''
);

refs.galery.insertAdjacentHTML('afterbegin', images);
refs.galery.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;

    if (event.target.nodeName !== 'IMG') {
        return;
    }

    onModalOpen(target);
});

function onModalOpen(target) {
    refs.modal.classList.add('is-open');
    refs.overlay.addEventListener('click', onModalClose);
    window.addEventListener('keydown', onModalPress);
    refs.modalCloseBtn.addEventListener('click', onModalClose);

    galleryItems.forEach(({ preview, original, description }) => {
        if (target.src === preview) {
            refs.modalImage.src = `${original}`;
            refs.modalImage.alt = `${description}`;
        }
    });
}

function onModalClose() {
    refs.modal.classList.remove('is-open');
    refs.modalImage.src = '';
    refs.modalImage.alt = '';
    window.removeEventListener('keydown', onModalPress);
    refs.modalCloseBtn.removeEventListener('click', onModalClose);
    refs.overlay.removeEventListener('click', onModalClose);
}

function onModalPress(event) {
    const target = event;
    if (event.key === 'Escape') {
        onModalClose();
    }

    onChangeSlide(target);
}

function onChangeSlide(event) {
    if (event.key === 'ArrowLeft') {
        const newPath = galleryItems.reduce(
            (acc, { original }, index, array) => {
                if (refs.modalImage.src === original) {
                    return index > 0
                        ? [
                              ...acc,
                              array[index - 1].original,
                              array[index - 1].description,
                          ]
                        : [
                              ...acc,
                              array[array.length - 1].original,
                              array[array.length - 1].description,
                          ];
                }
                return [...acc];
            },
            []
        );

        refs.modalImage.src = newPath[0];
        refs.modalImage.alt = newPath[1];
    }

    if (event.key === 'ArrowRight') {
        const newPath = galleryItems.reduce(
            (acc, { original }, index, array) => {
                if (refs.modalImage.src === original) {
                    return index < array.length - 1
                        ? [
                              ...acc,
                              array[index + 1].original,
                              array[index + 1].description,
                          ]
                        : [...acc, array[0].original, array[0].description];
                }
                return [...acc];
            },
            []
        );

        refs.modalImage.src = newPath[0];
        refs.modalImage.alt = newPath[1];
    }
}
