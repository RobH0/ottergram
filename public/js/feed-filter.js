const selectedElem = document.querySelector('.selected');
const unselectedElem = document.querySelector('.unselected');

console.log(selectedElem);
console.log(unselectedElem);

function handleMouseEnter(){
    console.log('handleMouseEnter');
    selectedElem.style.color = 'rgb(139, 139, 139)';
    selectedElem.style.fontWeight = '400';
}

function handleMouseLeave(){
    console.log('mouse leave');
    selectedElem.style.color = 'black';
    selectedElem.style.fontWeight = '600';
}

unselectedElem.addEventListener('mouseover', handleMouseEnter);
unselectedElem.addEventListener('mouseleave', handleMouseLeave);