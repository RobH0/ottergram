const notificationBtns = document.querySelectorAll('.notification-btn');
const notificationsDropDown = document.querySelectorAll('.notifications-drop-down');

/*notificationBtns.addEventListener('click', (event) => {
    manageDropDown(event.target);
})*/

notificationBtns.forEach((element) => element.addEventListener('click', (event) => { manageDropDown(event.target) }));

function manageDropDown(target){
    console.log('in manageDropDown')
    console.log(`notificationsDropDown ${notificationsDropDown}`);
    notificationsDropDown.forEach((element) => {
        if (element.style.display == '' || element.style.display == 'none'){
            console.log('in if');
            element.style.display = 'block';   
        } else if (element.style.display == 'block'){
            console.log('else if');
            element.style.display = 'none';
        }
    })
    /*if (notificationsDropDown.style.display == '' || notificationsDropDown.style.display == 'none'){
        console.log('in if');
        notificationsDropDown.style.display = 'block';   
    } else if (notificationsDropDown.style.display == 'block'){
        console.log('else if');
        notificationsDropDown.style.display = 'none';
    }*/
}