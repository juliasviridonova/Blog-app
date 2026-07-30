const posts = [];

const postTitleInputNode = document.querySelector('.js-post-title-input');
const postTextInputNode = document.querySelector('.js-post-text-input');
const newPostBtnNode = document.querySelector('.js-new-post-btn');
const postsNode = document.querySelector('.js-posts');
const titleErrorNode = document.querySelector('.js-title-error'); // сообщение об ошибке
const textErrorNode = document.querySelector('.js-text-error');// сообщение об ошибке

newPostBtnNode.addEventListener('click', function(){
   const postFromUser = getPostFromUser();

  if (!postFromUser) {
    return;
  }

   addPost(postFromUser);

   renderPosts();
   postTitleInputNode.value = '';
   postTextInputNode.value = '';
   titleErrorNode.style.display = 'none';
   textErrorNode.style.display = 'none';

   postTitleInputNode.focus();

   postTitleInputNode.classList.add('is-focused');

   setTimeout(() => {
      postTitleInputNode.classList.remove('is-focused');
   }, 1000);
});

function getPostFromUser() {
   const title = postTitleInputNode.value;
   const text = postTextInputNode.value;

   // Проверка длины заголовка
  if (title.length > 100) {
    titleErrorNode.style.display = 'block';
    return null; //
  }

  titleErrorNode.style.display = 'none';

  
  if (text.length > 200) {
   textErrorNode.style.display = 'block';
   return null; 
  }

  textErrorNode.style.display = 'none'; 
   return {
      title: title,
      text: text,
      date: new Date() // добавляем текущую дату
   };
}

function addPost({ title, text, date }) {
   posts.unshift({
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


