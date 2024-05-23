let postImg = document.querySelector('.post-pic img');

console.log(postImg);


postImg.addEventListener('load', (event) => { matchedHeights()});

let heightChanged = false;

while (heightChanged == false){
    try{
        if (postImg.complete){
            console.log('MatchedHeights called')
            let postContainer = document.querySelector('.post-section');
            console.log(postContainer.clientHeight);
            let commentsSection = document.querySelector('.comments-section');
            let newHeight = postContainer.clientHeight;
            newHeight = newHeight + 'px';
            console.log(`newHeight: ${newHeight}`);
            commentsSection.style.height = newHeight;
            heightChanged = true;
        }
    } catch (err){
        console.error(err);
    }
}


function matchedHeights() {
    console.log('MatchedHeights called')
    let postContainer = document.querySelector('.post-section');
    let commentsSection = document.querySelector('.comments-section');
    let newHeight = postContainer.style.height;
    console.log(`newHeight: ${newHeight}`);
    commentsSection.style.height = newHeight;


}




