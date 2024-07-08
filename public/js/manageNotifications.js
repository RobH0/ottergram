const notificationBtns = document.querySelectorAll('.notification-btn');
const notificationsDropDown = document.querySelectorAll('.notifications-drop-down');
const notificationContainers = document.querySelectorAll('.notification-container');
const closeNotifBtn = document.querySelectorAll('.close-notifications-btn');

/*notificationBtns.addEventListener('click', (event) => {
    manageDropDown(event.target);
})*/

notificationBtns.forEach((element) => element.addEventListener('click', (event) => { manageDropDown(event.target) }));

console.log(closeNotifBtn);
closeNotifBtn.forEach((element) => element.addEventListener('click', manageDropDown));

try{
    document.addEventListener('click', function(e){
        let target;
        let isNotificationDropDown = false;
        let isBlock = false;
        notificationsDropDown.forEach((element) => {
            if (element.contains(e.target)){
                isNotificationDropDown = true;
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

        notificationContainers.forEach((element) => {
            if (element.contains(e.target)){
                let notificationIdStr = element.classList[1];
                markRead(notificationIdStr);
            }
        });
        
        if (isNotificationDropDown == false && isBlock && isNotificationBtn == false){
            manageDropDown();
        } 
    })
} catch(err){
    console.error(err);
}

async function markRead(notificationIdStr){
    let endpoint = '/notification-read';
    let requestOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({idString: notificationIdStr})
    }
    let result = await fetch (endpoint, requestOptions);
    result = result.json();
    console.log(JSON.stringify(result.message));
}

function manageDropDown(){
    console.log('manageDropDown');
    notificationsDropDown.forEach((element) => {
        if (element.style.display == '' || element.style.display == 'none'){
            element.style.display = 'block';   
        } else if (element.style.display == 'block'){
            element.style.display = 'none';
        }
    })
}