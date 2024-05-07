const followBtn = document.querySelectorAll('.follow-following-btn');

followBtn.forEach((element) => {
    element.addEventListener('click', (event) => {
        followBtnClicked(event);
    });
});
    

async function followBtnClicked(event){
    console.log(`event.target.innerhtml: ${event.target.innerHTML}`);
    let btnText = event.target.innerHTML;

    if( btnText == 'Follow'){
        event.target.innerHTML = 'Unfollow';
        event.target.id = 'following-btn'
        followUser(event.target);

    } else if (btnText == 'Unfollow'){
        event.target.innerHTML = 'Follow';
        event.target.id = null;
        unfollowUser(event.target);
    }
}

async function followUser(target){
    console.log('following user');
    console.log(window.location.href.split('/')[4]);
    const endpoint = '/user/follow'
    console.log(endpoint);
    let userToFollowVal;
    if (window.location.href.includes('/profile/following')){
        let anchorElem = target.parentNode.querySelector('.left-list-item a');
        userToFollowVal = anchorElem.getAttribute("href");
        userToFollowVal = JSON.stringify({ userToFollow: userToFollowVal.split('/')[2]});
        console.log(`userToFollow ${userToFollowVal}`);
    } else {
        userToFollowVal = JSON.stringify({ userToFollow: window.location.href.split('/')[4]});
    }

    try{
        let patchRes = await fetch (endpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: userToFollowVal
        });
    } catch (err){
         console.error(err);
    }
}

async function unfollowUser(target){
    console.log('unfollowing user');
    let endpoint = '/user/unfollow'
    let userToUnfollowVal;
    if (window.location.href.includes('/profile/following')){
        let anchorElem = target.parentNode.querySelector('.left-list-item a');
        userToUnfollowVal = anchorElem.getAttribute("href");
        userToUnfollowVal = JSON.stringify({ userToUnfollow: userToUnfollowVal.split('/')[2]});
        console.log(`userToFollow ${userToUnfollowVal}`);
    } else {
        console.log(`current window: ${window.location.href}`);
        userToUnfollowVal = JSON.stringify({ userToUnfollow: window.location.href.split('/')[4]});
        console.log(`else userToUnfollowVal: ${userToUnfollowVal}`)
    }


    try{
        let patchRes = await fetch (endpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: userToUnfollowVal
        });
    } catch (err){
        console.error(err);
    }
}