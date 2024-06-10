const openMobileNavBtn = document.querySelector('.open-mobile-menu-btn');
const closeMobileNavBtn = document.querySelector('.close-mobile-menu-btn');

openMobileNavBtn.addEventListener('click', openMobileNav);
closeMobileNavBtn.addEventListener('click', closeMobileNav);

function openMobileNav(){
    console.log('Opening mobile nav');
    openMobileNavBtn.classList.add('inactive');
    openMobileNavBtn.classList.remove('active');

    closeMobileNavBtn.classList.add('active');
    closeMobileNavBtn.classList.remove('inactive');
}

function closeMobileNav(){
    console.log('Closing mobile nav');
    closeMobileNavBtn.classList.add('inactive');
    closeMobileNavBtn.classList.remove('active');

    openMobileNavBtn.classList.add('active');
    openMobileNavBtn.classList.remove('inactive');
}