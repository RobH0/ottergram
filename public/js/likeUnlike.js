let likeBtns = document.querySelectorAll(".like-button");

console.log('likeUnlike.js script loaded');

try{
    likeBtns.forEach((button) => {
        button.addEventListener('click', (event) => {
            changeLikeStatus(event);
        });
    })
}catch (err){
    console.error(err);
}

async function changeLikeStatus(event){
    console.log(`event.target.id: ${event.target.id}`);
    if (event.target.classList.value == 'liked'){
        console.log(`if`);
        requestUnlikePost(event.target);
    } else {
        console.log('else');
        requestLikePost(event.target);
    }
}

async function requestLikePost(likeBtn){

    if (likeBtn.classList.value != 'liked'){
        console.log('in if')
        let location = window.location.href;
        console.log(`location: ${location}`);
        const likeCount = likeBtn.parentNode.parentNode.querySelector('span');
        console.log(likeCount);
        if (location.includes('profile') || location.includes('user')){
            likeBtn.src = '/imgs/icons/like-white.svg';
        } else{
            likeBtn.src = '/imgs/icons/like-red-black-outline.svg';
        }
        
        likeBtn.classList.value = 'liked';
        console.log(`likeBtn.id: ${likeBtn.id}`);
        likeCount.innerHTML = Number(likeCount.innerHTML) + 1;
        const endpoint = '/post/' + likeBtn.id + '/like';
        console.log(`endpoint: ${endpoint}`);
        try{
            let result = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(result.message);
        } catch (err) {
            likeBtn.src = '/imgs/icons/like-heart-white.svg';
            likeBtn.classList.value = null;
            console.error(err);
        }
    }
}

async function requestUnlikePost(likeBtn){

    if (likeBtn.classList.value == 'liked'){
        let location = window.location.href;
        console.log(`location: ${location}`);
        if (location.includes('profile') || location.includes('user')){
            likeBtn.src = '/imgs/icons/like-white-outline.svg';
        } else{
            likeBtn.src = '/imgs/icons/like-heart-white.svg';
        }
        
        likeBtn.classList.value = null;
        const likeCount = likeBtn.parentNode.parentNode.querySelector('span');
        likeCount.innerHTML = Number(likeCount.innerHTML) - 1;
        const endpoint = '/post/' + likeBtn.id + '/unlike';
        
        try{
            let result = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (err) {
            console.error(err);
            likeCount.innerHTML = Number(likeCount.innerHTML) + 1;
            likeBtn.src = '/imgs/icons/like-red-black-outline.svg';
            likeBtn.classList.value = 'liked';
        }
    }
}





