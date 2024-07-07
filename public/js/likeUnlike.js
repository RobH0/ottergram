let likeBtns = document.querySelectorAll(".like-button");

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
    if (event.target.classList.value == 'liked'){
        requestUnlikePost(event.target);
    } else {
        requestLikePost(event.target);
    }
}

async function requestLikePost(likeBtn){

    if (likeBtn.classList.value != 'liked'){
        let location = window.location.href;
        const likeCount = likeBtn.parentNode.parentNode.querySelector('span');

        if (location.includes('profile') || location.includes('user')){
            likeBtn.src = '/imgs/icons/like-white.svg';
        } else{
            likeBtn.src = '/imgs/icons/like-red-black-outline.svg';
        }
        
        likeBtn.classList.value = 'liked';
        likeCount.innerHTML = Number(likeCount.innerHTML) + 1;
        const endpoint = '/post/' + likeBtn.id + '/like';

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





