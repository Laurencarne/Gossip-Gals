document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderPosts();
});
////////////////////////////////
const form = document.querySelector(".newPostForm");
const mainBody = document.querySelector(".theMainBodyDiv");
const sortForm = document.querySelector("#sort-dropdown");
const baseURL = "http://localhost:3000/posts?_embed=likes";
const likesURL = "http://localhost:3000/likes/";
const postsURL = "http://localhost:3000/posts/";
////////////////////////////////
function fetchPosts() {
  return fetch(baseURL).then(response => response.json());
}
////////////////////////////////
function makeCardForEachPost(post) {
  const div = document.createElement("div");
  div.className = "cardDiv";

  const h3 = document.createElement("h3");
  h3.innerText = post.name;

  const p = document.createElement("p");
  p.innerText = post.message;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "deleteBtn";
  deleteBtn.innerText = "Delete Post";

  const likeBtn = document.createElement("button");
  likeBtn.className = "likeBtn";
  likeBtn.innerText = `Likes: ${post.likes.length}`;

  const editBtn = document.createElement("button");
  editBtn.className = "editBtn";
  editBtn.innerText = "Edit Post";

  div.append(h3, p, deleteBtn, likeBtn, editBtn);

  deleteBtn.addEventListener("click", () => deletePost(post));
  likeBtn.addEventListener("click", () => makeLike(post));
  editBtn.addEventListener("click", () => editPostSetup(post));

  return div;
}
////////////////////////////////
function renderPosts(json) {
  mainBody.innerHTML = "";
  json.forEach(function(post) {
    mainBody.appendChild(makeCardForEachPost(post));
  });
}
////////////////////////////////
function fetchAndRenderPosts() {
  fetchPosts().then(renderPosts);
}
////////////////////////////////
function deletePost(post) {
  const parent = event.target.parentElement;
  deletePostFromServer(post.id).then(() => parent.remove());
}
////////////////////////////////
function deletePostFromServer(id) {
  return fetch(postsURL + id, {
    method: "DELETE"
  });
}
////////////////////////////////
function makeLike(post) {
  event.preventDefault();

  sortForm.selectedIndex = 0;

  const postLikes = {
    postId: post.id
  };
  updateLikesOnServer(postLikes).then(fetchAndRenderPosts);
}
////////////////////////////////
function updateLikesOnServer(postLikes) {
  return fetch(likesURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(postLikes)
  });
}
////////////////////////////////
form.addEventListener("submit", submitOrEditAPost);
////////////////////////////////
function submitOrEditAPost(post) {
  if (form[2].value === "Post") {
    makePost();
  } else if (form[2].value === "Edit") {
    editPost();
  }
}
////////////////////////////////
function makePost() {
  event.preventDefault();
  const newPost = {
    name: event.target[0].value,
    message: event.target[1].value
  };
  addPostToServer(newPost).then(fetchAndRenderPosts);
  event.target.reset();
}
////////////////////////////////
function addPostToServer(newPost) {
  return fetch(postsURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newPost)
  });
}
////////////////////////////////
function editPost(post) {
  event.preventDefault();
  id = form.dataset.id;
  updatedPost = {
    name: event.target[0].value,
    message: event.target[1].value
  };
  updatePostToServer(updatedPost, id).then(fetchAndRenderPosts);
  form[2].value = "Post";
  event.target.reset();
}
////////////////////////////////
function updatePostToServer(post, id) {
  return fetch(postsURL + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(post)
  });
}
////////////////////////////////
function editPostSetup(post) {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });

  form[0].value = post.name;
  form[1].value = post.message;
  form[2].value = "Edit";
  form.dataset.id = post.id;
}
////////////////////////////////
function sortPostData(value) {
  if (value === "Author") {
    displayPostsByAuthor();
  } else if (value === "Likes") {
    displayPostsByLikes();
  } else if (value === "Length") {
    displayPostsByLength();
  }
}
////////////////////////////////
function displayPostsByAuthor() {
  fetchPosts().then(json => {
    posts = json.slice(0);
    posts.sort(function(a, b) {
      let x = a.name.toLowerCase();
      let y = b.name.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
    renderPosts(posts);
  });
}
////////////////////////////////
function displayPostsByLikes() {
  fetchPosts().then(json => {
    posts = json.slice(0);
    posts.sort(function(a, b) {
      let x = a.likes.length;
      let y = b.likes.length;
      return y < x ? -1 : y > x ? 1 : 0;
    });
    renderPosts(posts);
  });
}
////////////////////////////////
function displayPostsByLength() {
  fetchPosts().then(json => {
    posts = json.slice(0);
    posts.sort(function(a, b) {
      let x = a.message.length;
      let y = b.message.length;
      return x < y ? -1 : x > y ? 1 : 0;
    });
    renderPosts(posts);
  });
}
////////////////////////////////

////////////////////////////////

////////////////////////////////

////////////////////////////////
