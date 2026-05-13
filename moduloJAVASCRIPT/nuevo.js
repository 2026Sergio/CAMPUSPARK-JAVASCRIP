const btnMenu = document.getElementById('btn-menu');
const menu = document.getElementById('menu-lateral');
const overlay = document.getElementById('overlay');

const toggleMenu = () => {
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
};

btnMenu.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);