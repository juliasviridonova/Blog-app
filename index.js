// --- 1. РАБОТА С ПАМЯТЬЮ (LOCALSTORAGE) ---

function getPostsFromStorage() {
  const saved = localStorage.getItem('myBlogPosts');
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
}

function savePostsToStorage(posts) {
  localStorage.setItem('myBlogPosts', JSON.stringify(posts));
}

// --- 2. ИНИЦИАЛИЗАЦИЯ ---

// Загружаем посты при старте
let posts = getPostsFromStorage();

const postTitleInputNode = document.querySelector('.js-post-title-input');
const postTextInputNode = document.querySelector('.js-post-text-input');
const newPostBtnNode = document.querySelector('.js-new-post-btn');
const postsNode = document.querySelector('.js-posts');
const titleErrorNode = document.querySelector('.js-title-error');
const textErrorNode = document.querySelector('.js-text-error');

// Переменная для хранения ID редактируемого поста (null = создаем новый)
let editingPostId = null;

renderPosts();

// --- 3. ОБРАБОТЧИК КНОПКИ "ОПУБЛИКОВАТЬ" / "СОХРАНИТЬ" ---

newPostBtnNode.addEventListener('click', function() {
  const postFromUser = getPostFromUser();

  if (!postFromUser) {
    return;
  }

  if (editingPostId === null) {
    // Если мы НЕ в режиме редактирования -> создаем новый пост
    addPost(postFromUser);
  } else {
    // Если мы В режиме редактирования -> обновляем старый
    updatePost(editingPostId, postFromUser);
    editingPostId = null; // Сбрасываем режим редактирования
    newPostBtnNode.textContent = 'Опубликовать'; // Меняем текст кнопки
  }

  renderPosts();

  // Сброс формы
  postTitleInputNode.value = '';
  postTextInputNode.value = '';
  titleErrorNode.style.display = 'none';
  textErrorNode.style.display = 'none';

  postTitleInputNode.classList.add('is-focused'); // анимация есть

   setTimeout(() => {
      postTitleInputNode.classList.remove('is-focused'); // через 1 сек анимация пропадает
   }, 1000);
});

// --- 4. ЛОГИКА СОЗДАНИЯ/ОБНОВЛЕНИЯ ПОСТА ---

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

  const dateString = new Date().toLocaleString('ru-RU');

  return {
    title: title,
    text: text,
    date: dateString
  };
}

function addPost(postData) {
  const newPost = {
    ...postData,
    id: Date.now() // Уникальный ID на основе времени
  };
  posts.unshift(newPost);
  savePostsToStorage(posts);
}

function updatePost(id, postData) {
  const index = posts.findIndex(p => p.id === id);
  if (index !== -1) {
    posts[index] = {
      ...postData,
      id: id, // Сохраняем старый ID
      date: new Date() // Обновляем дату редактирования
    };
    savePostsToStorage(posts);
  }
}

function deletePost(id) {
  if (!confirm('Вы уверены, что хотите удалить этот пост?')) {
    return;
  }
  posts = posts.filter(p => p.id !== id);
  savePostsToStorage(posts);
  renderPosts();
}

// --- 5. ОТРИСОВКА ЛЕНТЫ (С КНОПКАМИ) ---

function renderPosts() {
  if (posts.length === 0) {
    postsNode.innerHTML = '<p class="post">Лента пуста…</p>';
    return;
  }

  let postsHTML = '';

  posts.forEach(post => {
    postsHTML += `
      <div class="post-item">
        <span class="post__date">${post.date.toLocaleString('ru-RU')}</span>
        
        <h3 class="post__title">${post.title}</h3>
        
        <p class="post__text">${post.text}</p>

        <div class="post-actions">
          <!-- Кнопка РЕДАКТИРОВАТЬ -->
          <button type="button" class="btn-edit" onclick="editPost(${post.id})">
            ✏️ Редактировать
          </button>
          
          <!-- Кнопка УДАЛИТЬ -->
          <button type="button" class="btn-delete" onclick="deletePost(${post.id})">
            🗑️ Удалить
          </button>
        </div>
      </div>
    `;
  });

  postsNode.innerHTML = postsHTML;
}

// --- 6. ФУНКЦИИ ДЛЯ КНОПОК (глобальные, чтобы работали из onclick в HTML) ---

window.editPost = function(id) {
  // Находим пост по ID
  const post = posts.find(p => p.id === id);
  if (!post) return;

  // Заполняем форму данными поста
  postTitleInputNode.value = post.title;
  postTextInputNode.value = post.text;
  
  // Активируем режим редактирования
  editingPostId = id;
  newPostBtnNode.textContent = 'Сохранить изменения';
  
  // Прокрутка к форме (опционально)
  postTitleInputNode.scrollIntoView({ behavior: 'smooth' });
  postTitleInputNode.focus();
};

// --- 7. ПРОВЕРКА ДЛИНЫ В РЕАЛЬНОМ ВРЕМЕНИ ---

postTitleInputNode.addEventListener('input', function() {
  const titleLength = postTitleInputNode.value.length;
  titleErrorNode.style.display = titleLength > 100 ? 'block' : 'none';
});

postTextInputNode.addEventListener('input', function() {
  const textLength = postTextInputNode.value.length;
  textErrorNode.style.display = textLength > 200 ? 'block' : 'none';
});
