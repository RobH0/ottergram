const openMobileNavBtn = document.querySelector('.open-mobile-menu-btn');
const closeMobileNavBtn = document.querySelector('.close-mobile-menu-btn');
const openedMobileNav = document.querySelector('.opened-mobile-right-nav');

openMobileNavBtn.addEventListener('click', openMobileNav);
closeMobileNavBtn.addEventListener('click', closeMobileNav);

let clickCount = 1;

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

try{
    // Allows a user to close the mobile navigation/menu when clicking on other parts of the screen. 
    document.addEventListener('click', function(e){
        if (!document.querySelector('.opened-mobile-right-nav').contains(e.target) && openedMobileNav.classList.contains('active') && clickCount > 1){
            closeMobileNav();
            clickCount = 1;
        } else if (openedMobileNav.classList.contains('inactive')){
            clickCount = 1;
        }else{
            clickCount+= 1;
        }
    })
} catch(err){
    console.error(err);
}