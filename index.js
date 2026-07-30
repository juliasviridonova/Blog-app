// --- 1. ФУНКЦИИ ДЛЯ РАБОТЫ С ПАМЯТЬЮ (LOCALSTORAGE) ---

// Получаем посты из памяти браузера. Если их нет — возвращаем пустой массив.
function getPostsFromStorage() {
  const saved = localStorage.getItem('myBlogPosts');
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
}

// Сохраняем массив постов в память браузера.
function savePostsToStorage(posts) {
  localStorage.setItem('myBlogPosts', JSON.stringify(posts));
}

// --- 2. ИНИЦИАЛИЗАЦИЯ ---

// ВАЖНО: Теперь мы не создаем пустой массив здесь. 
// Мы сразу загружаем то, что уже есть в браузере.
let posts = getPostsFromStorage(); 

const postTitleInputNode = document.querySelector('.js-post-title-input');
const postTextInputNode = document.querySelector('.js-post-text-input');
const newPostBtnNode = document.querySelector('.js-new-post-btn');
const postsNode = document.querySelector('.js-posts');
const titleErrorNode = document.querySelector('.js-title-error');
const textErrorNode = document.querySelector('.js-text-error');

// Сразу рисуем ленту (если там что-то было сохранено ранее)
renderPosts();

// --- 3. ОБРАБОТЧИК КНОПКИ ---

newPostBtnNode.addEventListener('click', function() {
  const postFromUser = getPostFromUser();

  if (!postFromUser) {
    return;
  }

  addPost(postFromUser);
  renderPosts();

  // Очистка формы
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

// --- 4. ЛОГИКА СОЗДАНИЯ ПОСТА ---

function getPostFromUser() {
  const title = postTitleInputNode.value.trim();
  const text = postTextInputNode.value.trim();

  if (title.length > 100) {
    titleErrorNode.style.display = 'block';
    return null;
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
    date: new Date()
  };
}

function addPost(post) {
  // Добавляем пост в наш главный массив
  posts.unshift(post);
  // И СРАЗУ сохраняем обновленный массив в LocalStorage
  savePostsToStorage(posts);
}

// --- 5. ОТРИСОВКА ЛЕНТЫ ---

function renderPosts() {
  // Берем данные из нашего главного массива (который уже содержит данные из storage)
  const currentPosts = posts; 
  
  if (currentPosts.length === 0) {
    postsNode.innerHTML = '<p class="post">Лента пуста…</p>';
    return;
  }

  let postsHTML = '';

  currentPosts.forEach(post => {
    postsHTML += `
      <div class="post-item">
        <span class="post__date">${post.date.toLocaleString('ru-RU')}</span>
        <h3 class="post__title">${post.title}</h3>
        <p class="post__text">${post.text}</p>
      </div>
    `;
  });

  postsNode.innerHTML = postsHTML;
}

// --- 6. ПРОВЕРКА ДЛИНЫ В РЕАЛЬНОМ ВРЕМЕНИ ---

postTitleInputNode.addEventListener('input', function() {
  const titleLength = postTitleInputNode.value.length;
  titleErrorNode.style.display = titleLength > 100 ? 'block' : 'none';
});

postTextInputNode.addEventListener('input', function() {
  const textLength = postTextInputNode.value.length;
  textErrorNode.style.display = textLength > 200 ? 'block' : 'none';
});
