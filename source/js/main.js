const overlay = document.querySelector('.overlay');

const openOverlay = () => {
  overlay.classList.remove('hide-block');
}

const closeOverlay = () => {
  overlay.classList.add('hide-block');
}

// открытие/закрытие главного меню

const mainNav = document.querySelector('.main-nav');
mainNav.classList.remove('main-nav--noJS');

const mainNavToggle = document.querySelector('.main-nav__toggle');
const isEscapeKey = (evt) => evt.key === 'Escape';

const onMainNavEscKeydown = (evt) => {
  if(isEscapeKey(evt)){
    evt.preventDefault();
    closeMainNav();
  }
};

const openMainNav = () => {
  mainNav.classList.remove('main-nav--closed');
  document.addEventListener('keydown', onMainNavEscKeydown);
  overlay.addEventListener('click', () => {
    closeMainNav();
    closeOverlay();
  });
}

const closeMainNav = () => {
  mainNav.classList.add('main-nav--closed');
  document.removeEventListener('keydown', onMainNavEscKeydown);
};

mainNavToggle.addEventListener('click', () => {
  if(mainNav.classList.contains('main-nav--closed')){
    openMainNav();
    openOverlay();
  } else {
    closeMainNav();
  }
});


// купить тур сейчас - обработка клика по кнопке

const buyTourButtons = document.querySelectorAll('.buy-tour');
const modalBuyTour = document.querySelector('.modal');
const modalCloseButton = document.querySelector('.modal__close-button');

const onModalBuyTourEscKeydown = (evt) => {
  if(isEscapeKey(evt)){
    evt.preventDefault();
    closeModalBuyTour();
  }
};

const openModalBuyTour = () => {
  modalBuyTour.classList.remove('hide-block');
  document.addEventListener('keydown', onModalBuyTourEscKeydown);
  modalCloseButton.addEventListener('click', closeModalBuyTour);
  overlay.addEventListener('click', () => {
    closeModalBuyTour();
    closeOverlay();
    modalCloseButton.removeEventListener('click', onModalBuyTourEscKeydown);
  });

}

const closeModalBuyTour = () => {
  modalBuyTour.classList.add('hide-block');
  document.removeEventListener('keydown', onModalBuyTourEscKeydown);
}

buyTourButtons.forEach((elem) => {
  elem.addEventListener('click', () => {
    openModalBuyTour();
    openOverlay();
  })
});

// отправка формы

const successModal = document.querySelector('.success-modal');
const form = document.querySelectorAll('form');

const closeSuccessModal = () => {
  successModal.classList.add('hide-block');
}

const openSuccessModal = () => {
  successModal.classList.remove('hide-block');
  overlay.addEventListener('click', () => {
    closeSuccessModal();
    closeOverlay();
  })
  document.addEventListener('keydown', onModalBuyTourEscKeydown);
}

const onModalSuccessEscKeydown = (evt) => {
  if(isEscapeKey(evt)){
    evt.preventDefault();
    closeSuccessModal();
  }
};

form.forEach((elem) => {
  elem.addEventListener('submit', (evt) => {
    evt.preventDefault();
    console.log('SUBMITED');
    openSuccessModal();
    openOverlay();
    if(!modalBuyTour.classList.contains('remove')){
      closeModalBuyTour();
    }
  });
});



