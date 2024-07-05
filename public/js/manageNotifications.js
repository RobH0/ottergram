const notificationBtns = document.querySelectorAll('.notification-btn');
const notificationsDropDown = document.querySelectorAll('.notifications-drop-down');

/*notificationBtns.addEventListener('click', (event) => {
    manageDropDown(event.target);
})*/

notificationBtns.forEach((element) => element.addEventListener('click', (event) => { manageDropDown(event.target) }));

try{
    document.addEventListener('click', function(e){
        let target;
        let isNotificationDropDown = false;
        let isBlock = false;
        notificationsDropDown.forEach((element) => {
            if (element.contains(e.target)){
                console.log(e.target);
                console.log('in if element contains');
                isNotificationDropDown = true;
                console.log(`1 ${isNotificationDropDown}`);
                console.log(`element.style.display ${element.style.display}`);
                
            }
            if (element.style.display == 'block'){
                isBlock = true;
            }
        });

        let isNotificationBtn = false;
        notificationBtns.forEach((element) => {
            if (element.contains(e.target)){
                isNotificationBtn = true;
            }
        });
        
        console.log(`isNotifiactionDropdown ${isNotificationDropDown}`)
        console.log(`isBlock ${isBlock}`)
        if (isNotificationDropDown == false && isBlock && isNotificationBtn == false){
            console.log(`in second if`);
            manageDropDown();
        }  
    })
} catch(err){
    console.error(err);
}



function manageDropDown(){
    console.log('in manageDropDown')
    console.log(`notificationsDropDown ${JSON.stringify(notificationsDropDown)}`);
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