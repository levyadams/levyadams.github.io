import lazy from './lazyloader.js';
let postIndex;
window.addEventListener('DOMContentLoaded', () => {
  fetchPosts();
})



function FillFrontPagePosts() {
  let container = document.getElementById('post-list');

  self.postIndex.front_page.forEach(function (post) {
    const li = document.createElement('li');
    let card = document.createElement('div');
    card.id = 'post-card';
    li.style.backgroundImage = "url('/images/svg/GameDevLogo.svg')";
    li.id = post.id;
    const title = document.createElement('h1');
    title.innerHTML = post.title;
    card.append(title);
    li.append(card);
    container.append(li);

    const image = document.createElement('picture');
    const imageSource = document.createElement('img');
    imageSource.className = 'post-img';
    const sourceJpeg = document.createElement('source');
    const sourceWebp = document.createElement('source');
    let imageURL = `${post.media}`;
    if (imageURL === '/images/undefined') {
      imageURL = '/images/no_image';
    }
    imageSource.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOcPiWrHgAFdQIWjjm6lwAAAABJRU5ErkJggg==');
    imageSource.setAttribute('data-src', `${imageURL}_small_1x.webp`);
    sourceWebp.setAttribute("srcset", `${imageURL}_small_1x.webp 550w, ${imageURL}_medium_1x.webp 800w,
  ${imageURL}_large_1x.webp 1600w`);
    sourceJpeg.setAttribute("srcset", `${imageURL}_small_1x.jpg 550w, ${imageURL}_medium_1x.jpg 800w,
  ${imageURL}_large_1x.jpg 1600w`);
    imageSource.setAttribute("alt", `Image for ${post.title}`);
    image.alt = `Image for ${post.title}`;
    image.append(imageSource, sourceWebp, sourceJpeg);
    card.append(image);

    const details = document.createElement('h2');
    details.innerHTML = post.details;
    card.append(details);

    const user = document.createElement('p');
    user.innerHTML = post.user;
    user.setAttribute("aria-label", "user who made the post");
    card.append(user);
  });
}



/**
 * Fetch all restaurants.
 */
function fetchPosts(posts = self.frontPagePosts) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `http://localhost:3000/data/posts.json`);
  xhr.onload = () => {
    if (xhr.status === 200) { // Got a success response from server!
      const json = JSON.parse(xhr.responseText);
      self.postIndex = json;
      FillFrontPagePosts();
      // callback(null, json);
    } else { // Oops!. Got an error from server.
      const error = (`Request failed. Returned status of ${xhr.status}`);
      // callback(error, null);
    }
  };
  xhr.send();
}

