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

