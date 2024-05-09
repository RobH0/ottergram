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
    console.log(likeBtn);
    // implement increment to like count when like request is successful
    console.log(`classList: ${likeBtn.classList.value}`);
    if (likeBtn.classList.value != 'liked'){
        console.log('in if')
        const likeCount = likeBtn.parentNode.parentNode.querySelector('span');
        console.log(likeCount);
        likeBtn.src = '/imgs/icons/like-red-black-outline.svg';
        likeBtn.class = 'liked';
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
            likeBtn.class = null;
            console.error(err);
        }
    }
    
    
}
async function requestUnlikePost(likeBtn){
    console.log(likeBtn);
    likeBtn.src = '/imgs/icons/like-heart-white.svg';
    likeBtn.class = null;
    const likeCount = likeBtn.parentNode.parentNode.querySelector('span');
    likeCount.innerHTML = Number(likeCount.innerHTML) - 1;
    const endpoint = '/post/' + likeBtn.id + '/unlike';
    //implement fetch
    try{
        let result = await fetch(endpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.error(err);
    }

    //implement decrement to likes count on post.
}





