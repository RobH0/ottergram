const uploadFile = document.querySelector('.choose-file');
const previewImg = document.querySelector('.post-pic-img');
const previewPostContainer = document.querySelector('.feed-post-container');
const fileReader = new FileReader();

//fix sizing!!!!!!
function fileChosen(){
    if (uploadFile.value != ""){
        console.log(uploadFile.value);
        let file = uploadFile.files[0];
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
            // fix issue where preview doesn't resize correctly
            previewPostContainer.style.width = newWidthStr + "px";
            previewPostContainer.style.maxWidth = "100%";
        });
        
    } else {
        console.log('no file');
    }
    
}