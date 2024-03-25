const uploadFile = document.querySelector('.choose-file');
const previewImg = document.querySelector('.post-pic-img');
const previewPostContainer = document.querySelector('.feed-post-container');
const postNowBtn = document.querySelector('.post-now-btn');
const fileUploadForm = document.querySelector('.file-upload-form');

const fileReader = new FileReader();
var mostRecentFile;

fileUploadForm.addEventListener('submit', postPhoto);



function postPhoto(event){
    event.preventDefault();
    
    let url = '/new-post'
    let formData = new FormData();
    console.log(`uploading ${mostRecentFile.name}`);
    formData.append('file', mostRecentFile);
    formData.append('filename', mostRecentFile.name);

    try{
        fetch(url, {
            method: 'POST',
            body: formData
        });
    }catch (err){
        console.error(err);
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

function previewImgNow(file){
    fileReader.readAsDataURL(file);
        fileReader.addEventListener("load", function (){
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
}
