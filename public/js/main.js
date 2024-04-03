const uploadFile = document.querySelector('.choose-file');
const previewImg = document.querySelector('.post-pic-img');
const previewPostContainer = document.querySelector('.feed-post-container');
const postNowBtn = document.querySelector('.post-now-btn');
const fileUploadForm = document.querySelector('.file-upload-form');
const profilePic = document.querySelector('.settings-options-sec .large-profile-pic')

const fileReader = new FileReader();
var mostRecentFile;

try{
    fileUploadForm.addEventListener('submit', postPhoto);
}catch{
    console.log("Not on /create-post");
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


//fix issue where preview post overflows page for tall images.
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
            previewImg.style.maxHeight = "100%";
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

// take file.
// get the first 8 bytes of the file.
// compare the first 8 bytes of the file to magic bytes of file types that are allowed.
// if they match any of the file types return true
// else return false.
function checkFileType(file){
    
}
