const notificationBtn = document.querySelector('.notification-btn');
const notificationsDropDown = document.querySelector('.notifications-drop-down');

notificationBtn.addEventListener('click', (event) => {
    manageDropDown(event.target);
})

function manageDropDown(target){
    console.log('in manageDropDown')
    console.log(`notificationsDropDown.style.display: ${notificationsDropDown.style.display}`);
    if (notificationsDropDown.style.display == '' || notificationsDropDown.style.display == 'none'){
        console.log('in if');
        notificationsDropDown.style.display = 'block';   
    } else if (notificationsDropDown.style.display == 'block'){
        console.log('else if');
        notificationsDropDown.style.display = 'none';
    }
}