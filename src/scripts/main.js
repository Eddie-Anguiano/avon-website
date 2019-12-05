let console;
let document;

const navSlider = () => {
  const burger = document.querySelector('.menu');
  const nav = document.querySelector('.nav');
  const links = document.querySelectorAll('.nav__li-item');
  const body = document.querySelector('body');

  burger.addEventListener('click', () => {
    // animation for menu slide in/out and dark overlay
    nav.classList.toggle('nav--active');
    body.classList.toggle('--blackout');

    // links fade in animation
    links.forEach((item, index) => {
      const link = item;
      if (link.style.animation) {
        link.style.animation = '';
      } else {
        link.style.animation = `navLink .4s ease forwards ${index / 7 + 0.1}s`;
      }
    });

    // burger menu animation
    burger.classList.toggle('toggle');
  });
};

navSlider();
const ble = 'im here';
console.log(ble);
