
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

const countriesNames = ['Греция', 'Албания', 'Македония', 'Черногория', 'Хорватия'];

const descriptions = ['На севере Греции находится один из крупнейших комплексов монастырей, расположенных на вершинах скал. Название его «Метеора» буквально переводится как «висящие в воздухе». Этот монастырь основная цель нашего путешествия в Греции. После покарения скал из песчанника и обломочной горной породы, достигающих в высоту 600 метров, наградой будет неописуемая красота природы и атмосфера, царящая в монастырях Метеоры.',
  'В Албании мы посетим Курорт Ксамиль. Этот курорт поразит вас чистейшей водой и удивительным пляжем. Вначале кажется, что на пляже вас встречает обычный, правда невероятно белоснежный и слишком крупный песок. Однако, присмотревшись, можно понять, что это не песок, а камни, перетёртые до такого мелкого состояния.',
  'В Македонии нашей целью будет посетить Палаошник, который расположился в удивительно красивой лесистой местности возле Охридского озера и Самуиловой твердыни. А также мы заберемся на вершину горы Татичев Камен где находится  археологический памятник Кокино в длину около 100 метров.',
  'Черногория удивит нас самым большим в Европе каньоном реки Тара, который в некоторых местах высотой берегов доходит до 1300 метров, а шириной не превышает трех. При этом длина каньона составляет 80 км. ',
  'В Хорватии мы посетим необычайную пещеру названную Бередине. Ее подземный мир увлечет вас на 80-ти метровую глубину через 5 освещенных залов, украшенных удивительными нерукотворными скульптурами —  сталактитами и сталагмитами —  формировавшимися тысячи и тысячи лет.'
];

const reviews = ['Метеоры в Греции можно сравнить разве что с Монсерратт в Испании. Такие же высоченные скалы. Но здесь потрясает масштаб. Огромная территория, высоко в горах. Ощущение такое, как будто стоишь на краю света!',
  'Замечательный курорт, обязательно стоит посетить. В следующий раз возьму с собой сестру, чтобы тоже смогла вкусить все красоты природы :)',
  'Я бы сказал необычное старое здание. В архитектуре я не разбираюсь, но подъем в гору был очень веселым так как люди оказались легкими и заводными. Красота природы впечатлила, особенно после долгого пути в гору.',
  'Неописуемой красоты каньон! Ничего прекраснее в жизни не видела, разве что в фильмах :) Всем советую',
  'Мы поехали всей семьей, я, моя жена и родители. Пещера просто незабываема! А то, что все это формировалось тысячелетиями, мега необычно. Первоначально даже не верилось, но натур ни с чем не спутать по итогу :)'
];

const authorNames = ['Влада Голицина', 'Маришка', 'Михаил Кузьмин', 'Анастасия Мей', 'Владимир Мулицин'];


const tabsHeader = document.querySelector('.tabs__description-header');
const tabsDescription = document.querySelector('.tabs__description-text');

const reviewsBlock = document.querySelector('.reviews');
const review = document.querySelector('.reviews__description');
const authorName = document.querySelector('.reviews__author-name');
const authorAvatar = document.querySelector('.reviews__author-avatar');

const tabsList = document.querySelector('.tabs__list');
const tabsItems = document.querySelectorAll('.tabs__item');

const clearClass = (elemList, classToRemove) => {
  elemList.forEach((elem) => {
    elem.classList.remove(classToRemove);
  })
}

const changeCard = (currentItemID) => {
  tabsHeader.textContent = countriesNames[currentItemID - 1 ];
  tabsDescription.textContent = descriptions[currentItemID - 1];
  review.textContent = reviews[currentItemID - 1];
  let url = '../img/tabs-desktop-' + currentItemID + '.webp';


  if(window.innerWidth === 1920) {
    reviewsBlock.style.backgroundImage = "url(" + url + ")";
  }

  authorName.textContent = authorNames[currentItemID - 1];
  authorAvatar.src = '../img/author-avatar-' + currentItemID + '.png';
  authorAvatar.srcset = '../img/author-avatar-' + currentItemID + '@2x.png';

  clearClass(tabsItems, 'tabs__item--active');
  tabsItems[currentItemID - 1].classList.add('tabs__item--active')
}

const catalogList = document.querySelector('.catalog__cards');
let currentListItemID = parseInt(document.querySelector('.tabs__item--active').getAttribute('data-country-id-item'), 10);

const setTabsListShift = () => {

   if(window.innerWidth < tabsList.clientWidth + 25) {
    tabsList.style.left = -1 * (currentListItemID - 1 ) * (tabsList.clientWidth / tabsItems.length) + 'px';
  }

}

catalogList.addEventListener('click', (evt) => {
  if(evt.target.closest('.card')) {
    let currentCountry = evt.target.closest('.card');
    currentListItemID = currentCountry.getAttribute('data-country-id');
    changeCard(currentListItemID);
  }
  setTabsListShift();
})

tabsList.addEventListener('click', (evt) => {
  if(evt.target.closest('.tabs__item')) {
    let currentItem = evt.target.closest('.tabs__item');
    currentListItemID = currentItem.getAttribute('data-country-id-item');
    changeCard(currentListItemID);
  }
  setTabsListShift();
})

// Swipe

const tabsWrapper = document.querySelector('.tabs__wrapper');

let x1 = null;
let x2 = null;

tabsWrapper.addEventListener('touchstart', (evt) => {
  x1 = evt.touches[0].clientX;
});

tabsWrapper.addEventListener('touchmove', (evt) => {
  x2 = evt.touches[0].clientX;
});

function swipeTabs() {
  if(!x1 || !x2) {
    return false;
  }

  if(x1 - x2 > 0) {
    currentListItemID = parseInt(currentListItemID, 10) + 1;
    if(currentListItemID > tabsItems.length) {
      currentListItemID = tabsItems.length
    }
    changeCard(currentListItemID);
    setTabsListShift();

  }

  if(x1 - x2 < 0) {
    currentListItemID = currentListItemID - 1;
    if(currentListItemID < 1) {
      currentListItemID = 1
    }
    changeCard(currentListItemID);
    setTabsListShift();

  }
}

tabsWrapper.addEventListener('touchend', swipeTabs)





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
