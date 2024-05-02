const followBtn = document.querySelector('.follow-following-btn');

followBtn.addEventListener('click', (event) => {
    followBtnClicked(event);
});

async function followBtnClicked(event){
    console.log(`event.target.innerhtml: ${event.target.innerHTML}`);
    let btnText = event.target.innerHTML;

    if( btnText == 'Follow'){
        followBtn.innerHTML = 'Unfollow';
        followBtn.id = 'following-btn'
        followUser();

    } else if (btnText == 'Unfollow'){
        followBtn.innerHTML = 'Follow';
        followBtn.id = null;
        unfollowUser();
    }
}

async function followUser(){
    console.log('following user');
    console.log(window.location.href.split('/')[4]);
    const endpoint = '/user/follow'
    console.log(endpoint);

    try{
        let patchRes = await fetch (endpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userToFollow: window.location.href.split('/')[4]})
        });
    } catch (err){
         console.error(err);
    }
}

async function unfollowUser(){
    console.log('unfollowing user');
    let endpoint = '/user/unfollow'
    try{
        let patchRes = await fetch (endpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userToUnfollow: window.location.href.split('/')[4]})
        });
    } catch (err){
        console.error(err);
    }
}