# Ottergram

**Link to project:** [ottergram.social](https://ottergram.social/)

A social media platform providing users the opportunity to share their favorite GIFs/pictures and interact with posts made by other users.

![Preview GIF](https://github.com/RobH0/ottergram/blob/main/ottergram-preview.gif)

## How It's Made

**Tech used:** EJS, Node.js, Express.js, MongoDB, JavaScript, HTML, CSS.

**Dependencies:** bcrypt, connect-mongo, dotenv, ejs, express, express-session, mongodb, passport, passport-local, express-flash, multer, cloudinary.

The web app was developed using an MVC (model-view-controller) design pattern for future scalability and maintainability. 

The front-end was created using EJS and styled with CSS, providing a responsive design for mobile, tablet, laptop, and desktop users. 

The back-end utilizes Node.js and Express.js to handle and respond to REST API requests while users interact with the web app's front-end from their browser.

MongoDB stores data relating to user profiles, posts, likes, comments, and sessions.

## Future Improvements/Optimizations

Given more time, I would like to make the following improvements:
- Implement a direct messaging feature that allows users to text chat with one another.
- Provide authenticated users with the ability to search for other users' profiles via a search bar.
- Alter profile settings to include an option allowing the authenticated user to delete their account.
- Add ability for a user to directly reply to another user's comment.
- Design a landing page.
- Refactor code.