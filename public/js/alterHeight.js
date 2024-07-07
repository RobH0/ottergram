let postImg = document.querySelector('.post-pic img');

let heightChanged = false;
function matchHeights(heightChanged){
    if (window.innerWidth > 931){
        while (heightChanged == false){
            try{
                if (postImg.complete){
                    let postContainer = document.querySelector('.post-section');
                    let commentsSection = document.querySelector('.comments-section');
                    let newHeight = postContainer.clientHeight;
                    newHeight = newHeight + 'px';
                    commentsSection.style.height = newHeight;
                    heightChanged = true;
                }
            } catch (err){
                console.error(err);
            }
        }
    }
    
}

window.addEventListener('resize', () => { matchHeights(false)});

matchHeights(heightChanged);