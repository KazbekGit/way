
const overlay = document.querySelector('.overlay');

const openOverlay = () => {
  overlay.classList.remove('hide-block');
}

const closeOverlay = () => {
  overlay.classList.add('hide-block');
}

// открытие/закрытие главного меню

const pageHeader = document.querySelector('.page-header');
pageHeader.classList.remove('page-header--noJS');
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
  bodyFixed();
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
  bodyStatic();
  document.removeEventListener('keydown', onModalBuyTourEscKeydown);
}

buyTourButtons.forEach((elem) => {
  elem.addEventListener('click', () => {
    openModalBuyTour();
    openOverlay();
  })
});

// переключение табов




// отправка формы

const successModal = document.querySelector('.success-modal');
const successModalCloseButton = document.querySelector('.success-modal__close-button');
const errorModal = document.querySelector('.error-modal');
const errorModalCloseButton = document.querySelector('.error-modal__close-button');
const form = document.querySelectorAll('form');

const body = document.querySelector('body');

const bodyFixed = () => {
  body.classList.add('page-body--modal-open');
}

const bodyStatic = () => {
  body.classList.remove('page-body--modal-open');
}

const closeSuccessModal = () => {
  successModal.classList.add('hide-block');
  bodyStatic();
  document.removeEventListener('keydown', onSuccessModalEscKeydown);
}

const onSuccessModalEscKeydown = (evt) => {
  if(isEscapeKey(evt)){
    evt.preventDefault();
    closeSuccessModal();
  }
}

const openSuccessModal = () => {
  successModal.classList.remove('hide-block');
  bodyFixed();
  successModalCloseButton.addEventListener('click', () => {
    closeSuccessModal();
  });
  overlay.addEventListener('click', () => {
    closeSuccessModal();
    closeOverlay();
  });
  document.addEventListener('keydown', onSuccessModalEscKeydown);
}

const onErrorModalEscKeydown = (evt) => {
  if(isEscapeKey(evt)){
    evt.preventDefault();
    closeErrorModal();
  }
}
const closeErrorModal = () => {
  errorModal.classList.add('hide-block');
  document.removeEventListener('keydown', onErrorModalEscKeydown);
}

const openErrorModal = (err) => {
  errorModal.classList.remove('hide-block');
  bodyFixed();
  errorModal.insertAdjacentHTML('beforeend', err.name + ' / ' + err.message);
  errorModalCloseButton.addEventListener('click', () => {
    closeErrorModal();
  });
  overlay.addEventListener('click', () => {
    closeErrorModal();
    closeOverlay();
  });
  document.addEventListener('keydown', onErrorModalEscKeydown);
}

form.forEach((elem) => {
  elem.addEventListener('submit', (evt) => {
    evt.preventDefault();
    openOverlay();
    const formData = new FormData(evt.target);
    const src = 'https://webhook.site/fee3bf41-1370-48c3-818b-7bdfd12d7c5d'; // Тестовый сервер для отправки на него запросов
    fetch(
      src,
      {
        method: 'POST',
        body: formData,
      },
    )
      .then((response) => {
        if(!response.ok) {
          openErrorModal();
          throw new Error ('Ошибка соединения с сервером');
        }
        closeModalBuyTour();
        openSuccessModal();
      })
      .catch((err) => {
        closeModalBuyTour();
        openErrorModal(err);
      });
  });
});
