const deleteCommentBtns = document.querySelectorAll('.delete-comment-btn');

deleteCommentBtns.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
        event.stopPropagation();
        event.preventDefault();
        deleteComment(event.currentTarget.id);
    });
});

// Fix duplicate calling of HTTP delete request
async function deleteComment(commentId){
    let splitUrl = window.location.href.split('/');
    let postId = splitUrl[splitUrl.length - 1];
    const endpoint = `/post/${postId}/delete-comment`;
    const response = await fetch(`/post/${postId}/delete-comment`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({commentId})
    })

    console.log(`resposne: ${JSON.stringify(response.status)}`);
    if (response.status == 200){
        location.reload();
    }else{
        alert('Comment deletion failed.');
    }

}