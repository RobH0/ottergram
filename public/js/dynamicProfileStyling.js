const gallery = document.querySelector('.gallery');

console.log(gallery.children.length);

// Dynamically change gallery's grid column template to prevent overlaping when less than 3 posts exist on a user's profile.
if (gallery.children.length == 2){
    gallery.style.gridTemplateColumns = '50% 50%';
} else if (gallery.children.length == 1){
    gallery.style.gridTemplateColumns = '100%';
}