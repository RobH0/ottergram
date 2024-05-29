const uploadFile = document.querySelector('.choose-file');
const previewImg = document.querySelector('.post-pic-img');
const previewPostContainer = document.querySelector('.feed-post-container');
const postNowBtn = document.querySelector('.post-now-btn');
const fileUploadForm = document.querySelector('.file-upload-form');
const profilePic = document.querySelector('.settings-options-sec .large-profile-pic')
const mngPhotosBtn = document.querySelector('#manage-photos-btn');
const deleteCancelPhotosSection = document.querySelector('.cancel-delete-posts-section');
const cancelPhotosBtn = document.querySelector('.cancel-btn');
const deletePhotosBtn = document.querySelector('.delete-btn');
const selectForDelDiv = document.querySelectorAll('.select-for-del-section');
const postOverlayDiv = document.querySelectorAll('.post-preview-overlay');
const postPageLinks = document.querySelectorAll('.post-preview > a')
const deletionSummarySpan = document.querySelector('.cancel-delete-posts-section span');
let alreadyClicked = false;
let postsToDelete = [];
let toDeleteCount = 0;


const fileReader = new FileReader();
var mostRecentFile;

try{
    fileUploadForm.addEventListener('submit', postPhoto);
}catch{
    console.log("Not on /create-post");
}

try{
    mngPhotosBtn.addEventListener('click', displayManagePhotoUI);
    cancelPhotosBtn.addEventListener('click', removeManagePhotoUI);
    deletePhotosBtn.addEventListener('click', requestDeletePhotos);
}catch (err){
    console.log(err);
}

async function requestDeletePhotos(){
    if (postsToDelete.length != 0){
        try{
            console.log('deleting selected posts');
            const deleteRequestOptions = {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ photoURLs: postsToDelete})
            };

            const delResponse = await fetch('/profile/delete-posts', deleteRequestOptions);

            console.log(`delResponse: ${delResponse.status}`);
            console.log(`delResponse.ok: ${delResponse.ok}`);
            if (delResponse.ok){
                location.reload();
            }else{
                alert('Invalid post deletion request.');
            }

        }catch (err){
            console.error(err);
        }
    }else{
        alert('No posts selected for deletion');
    }
}

function displayManagePhotoUI(){
    if (alreadyClicked == false){
        alreadyClicked = true;
        console.log('Display UI to manage photo');
        deleteCancelPhotosSection.style.display = 'flex';
        selectForDelDiv.forEach((checkBox) => {
            checkBox.style.display = 'block';
        });
        postOverlayDiv.forEach((overlayDiv) => {
            overlayDiv.style.display = 'flex';
        });
        postPageLinks.forEach((postLink) => {
            let postDiv = postLink.parentNode;
            let postImg = postLink.querySelector('img').cloneNode(true);
            postImg.style.filter = 'none';
            postImg.classList.add('cloned-post-img');
            postDiv.insertBefore(postImg, postDiv.firstChild);
            postLink.style.display = 'none';
        });

        let clonedImgs = document.querySelectorAll('.cloned-post-img');
        clonedImgs.forEach((img) => {
            img.addEventListener('click', (event) => {
                selectImgForDeletion(event);
            });
        });

        let checkBoxes = document.querySelectorAll('.checkbox-del');
        checkBoxes.forEach((checkBox) => {
            checkBox.addEventListener('click', (event) => {
                selectImgForDeletion(event);
            });
        })
    }
}

function incrementToDelete(){
    toDeleteCount += 1;
    console.log(toDeleteCount);
    console.log(toDeleteCount.toString());
    let newString = 'You have selected ' + toDeleteCount.toString() + ' posts for deletion: ' ;
    
    deletionSummarySpan.innerHTML = newString;
}

function decrementToDelete(){
    toDeleteCount -= 1;
    let newString = 'You have selected ' + toDeleteCount.toString() + ' posts for deletion: ' ;
    deletionSummarySpan.innerHTML = newString;
}

function removeManagePhotoUI(){
    deleteCancelPhotosSection.style.display = 'none';
    selectForDelDiv.forEach((checkBox) => {
        checkBox.style.display = 'none';
    });
    let clonedImgs = document.querySelectorAll('.cloned-post-img');
    clonedImgs.forEach((img) => {img.remove();});
    postPageLinks.forEach((postLink) => {postLink.style.display = 'flex'});
    postOverlayDiv.forEach((overlayDiv) => {
        overlayDiv.style.display = 'absolute';
    });
    alreadyClicked = false;
    postsToDelete = [];
    document.querySelectorAll('.checkbox-del').forEach((checkbox) => {checkbox.src = "/imgs/icons/black-empty-tick-box.svg"});
    toDeleteCount = 0;
    deletionSummarySpan.innerHTML = 'You have selected 0 posts for deletion: ';
}

function selectImgForDeletion(event){
    let imgToDelete;
    let checkboxElem;
    if (event.target.src.includes('box.svg')){
        imgToDelete = event.target.parentNode.parentNode.querySelector('.post-img').src;
        checkboxElem = event.target;
    } else {
        imgToDelete = event.target.src;
        checkboxElem = event.target.parentNode.querySelector('.checkbox-del');
    }

    if (!postsToDelete.includes(imgToDelete)){
        postsToDelete.push(imgToDelete);
        console.log(postsToDelete);
        checkboxElem.src = '/imgs/icons/black-tick-box.svg';
        incrementToDelete();
    } else {
        console.log('in deletion else');
        let index = postsToDelete.indexOf(imgToDelete);
        postsToDelete.splice(index, 1);
        console.log(postsToDelete);
        checkboxElem.src = '/imgs/icons/black-empty-tick-box.svg';
        decrementToDelete();
    }
}

async function postPhoto(event){
    event.preventDefault();
    
    try{
        if (mostRecentFile != null){
            let url = '/new-post'
            let formData = new FormData();
            console.log(`uploading ${mostRecentFile.name}`);
            formData.append('file', mostRecentFile);
            formData.append('filename', mostRecentFile.name);

            
            let result = await fetch(url, {
                method: 'POST',
                body: formData
            });
            result = await result.json();
            if (result.success){
                console.log('in success');
                window.location.href = "/profile";
            }
        }else{
            console.log('No image/gif file to post.');
        }
        
        
    }catch (err){
        console.error(err);
    }

}

function previewProfilePic(event){
    console.log(`event.target.value: ${event.target.value}`);
    let img = event.target.files[0];
    console.log(img.type);
    if (img.type.includes('image/')){
        console.log('in if');
        fileReader.readAsDataURL(img);
        fileReader.addEventListener("load", function (){
            profilePic.src = this.result;
        });

    }
}


function fileChosen(){
    if (uploadFile.value != ""){
        console.log(uploadFile.value);
        let file = uploadFile.files[0];
        mostRecentFile = file;
        previewImgNow(file);       
    } else {
        console.log('no file');
    }
}

function fileDropped(event){
    console.log("file dropped");
    event.preventDefault();
    let droppedFiles = [...event.dataTransfer.files]
    if (droppedFiles.length <= 1){
        let file = droppedFiles[0]
        console.log(`dropped file ${file.name}`);
        mostRecentFile = file;
        console.log(mostRecentFile.name)
        previewImgNow(file);
    }

}

function fileDraggedOver(event){
    event.preventDefault();    
}


// on false return from checkFileType() don't preview file and notify user of incorrect file type.
function previewImgNow(file){
    console.log(file.type);
    if (file.type.includes('image/')){
        fileReader.readAsDataURL(file);
        fileReader.addEventListener("load", function (){
            console.log(`\n\n ${this.result} \n\n`);
            previewPostContainer.style.width = "1000px";
            previewImg.src=this.result;
            let currentImgPreview = document.querySelector('.post-pic-img');
            //previewImg.style.maxHeight = "35vh";
            let newWidth = currentImgPreview.clientWidth;
            console.log(newWidth);
            let newWidthStr = newWidth.toString();
            console.log(newWidthStr)
            console.log(newWidthStr + "px");
            previewPostContainer.style.width = newWidthStr + "px";
            previewPostContainer.style.maxWidth = "100%";
        });
    } else {
        alert(`${file.type} files aren't accepted.`);
        mostRecentFile = null;
        previewImg.src = 'imgs/post-placeholder.webp';
    }
}