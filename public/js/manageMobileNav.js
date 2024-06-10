const openMobileNavBtn = document.querySelector('.open-mobile-menu-btn');
const closeMobileNavBtn = document.querySelector('.close-mobile-menu-btn');
const openedMobileNav = document.querySelector('.opened-mobile-right-nav');

openMobileNavBtn.addEventListener('click', openMobileNav);
closeMobileNavBtn.addEventListener('click', closeMobileNav);

function openMobileNav(){
    console.log('Opening mobile nav');
    openMobileNavBtn.classList.add('inactive');
    openMobileNavBtn.classList.remove('active');

    openedMobileNav.classList.add('active');
    openedMobileNav.classList.remove('inactive');
}

function closeMobileNav(){
    console.log('Closing mobile nav');
    openedMobileNav.classList.add('inactive');
    openedMobileNav.classList.remove('active');

    openMobileNavBtn.classList.add('active');
    openMobileNavBtn.classList.remove('inactive');
}