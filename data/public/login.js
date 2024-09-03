document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.querySelector('.img__btn');
  const container = document.querySelector('.cont');
  const textUp = document.querySelector('.img__text.m--up');
  const textIn = document.querySelector('.img__text.m--in');

  toggleButton.addEventListener('click', () => {
    container.classList.toggle('s--signup');

    // Toggle the visibility of the texts
    if (container.classList.contains('s--signup')) {
      textUp.style.opacity = '0';
      textIn.style.opacity = '1';
    } else {
      textUp.style.opacity = '1';
      textIn.style.opacity = '0';
    }

  });
});