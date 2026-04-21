const posts = [];

const postTitleInputNode = document.querySelector('.js-post-title-input');
const postTextInputNode = document.querySelector('.js-post-text-input');
const newPostBtnNode = document.querySelector('.js-new-post-btn');
const postsNode = document.querySelector('.js-posts');
const titleErrorNode = document.querySelector('.js-title-error'); // сообщение об ошибке
const textErrorNode = document.querySelector('.js-text-error');// сообщение об ошибке

newPostBtnNode.addEventListener('click', function(){
   const postFromUser = getPostFromUser();

   // Если пост не создан (из‑за ошибки), прерываем выполнение
  if (!postFromUser) {
    return;
  }

   addPost(postFromUser);

   renderPosts();
});

function getPostFromUser() {
   const title = postTitleInputNode.value;
   const text = postTextInputNode.value;

   // Проверка длины заголовка
  if (title.length > 100) {
    titleErrorNode.style.display = 'block';
    return null; // не возвращаем пост, если заголовок слишком длинный
  }

  titleErrorNode.style.display = 'none'; // скрываем ошибку, если всё в порядке

   //добавила
  if (text.length > 200) {
   textErrorNode.style.display = 'block';
   return null; // добавила не возвращаем пост, если заголовок слишком длинный
  }

  textErrorNode.style.display = 'none'; // добавила скрываем ошибку, если всё в порядке

   return {
      title: title,
      text: text,
      date: new Date() // добавляем текущую дату
   };
}

function addPost({ title, text, date }) {
   posts.push({
      title,
      text,
      date
   });
}

function getPosts(){
   return posts;
}

function renderPosts() {
   const posts = getPosts();

   let postsHTML = '';

   posts.forEach(post => {
      postsHTML += `
         <div class='post'>
            <p class='post__date'>${post.date.toLocaleString('ru-RU')}</p>
            <p class='post__title'>${post.title}</p>
            <p class='post__text'>${post.text}</p>
            
         </div>
      `
   });

   
      
   postsNode.innerHTML = postsHTML;
}

postTitleInputNode.addEventListener('input', function() {
  const titleLength = postTitleInputNode.value.length;

  if (titleLength > 100) {
    titleErrorNode.style.display = 'block'; // показываем сообщение
  } else {
    titleErrorNode.style.display = 'none'; // скрываем сообщение
  }
});

postTextInputNode.addEventListener ('input', function() {
   const textLength = postTextInputNode.value.length;

   if (textLength > 200) {
      textErrorNode.style.display = 'block';
   } else {
      textErrorNode.style.display = 'none';
   }
});


