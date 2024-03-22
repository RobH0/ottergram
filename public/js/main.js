const uploadFile = document.querySelector('.choose-file');
const previewImg = document.querySelector('.post-pic-img')
const fileReader = new FileReader();


function fileChosen(){
    if (uploadFile.value != ""){
        console.log(uploadFile.value);
        //previewImg.src = uploadFile.result;
        let file = uploadFile.files[0];
        fileReader.readAsDataURL(file);
        fileReader.addEventListener("load", function (){
            previewImg.src=this.result;
        })
    } else {
        console.log('no file');
    }
    
}