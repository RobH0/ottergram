const selectedElem = document.querySelector('.selected');
const unselectedElem = document.querySelector('.unselected');

function handleMouseEnter(){
    selectedElem.style.color = 'rgb(139, 139, 139)';
    selectedElem.style.fontWeight = '400';
}

function handleMouseLeave(){
    selectedElem.style.color = 'black';
    selectedElem.style.fontWeight = '600';
}

unselectedElem.addEventListener('mouseover', handleMouseEnter);
unselectedElem.addEventListener('mouseleave', handleMouseLeave);