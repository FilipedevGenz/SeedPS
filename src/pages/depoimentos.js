const listEl = document.getElementById("cards-list");
const formEl = document.getElementById("post-form");
const titleInput = document.getElementById("post-title");
const contentInput = document.getElementById("post-content");
const authorInput = document.getElementById("post-author");
const submitBtn = formEl.querySelector("button[type='submit']");

const ICON_USER = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="8" r="4"></circle>
    <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"></path>
  </svg>`;

const ICON_TRASH = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 6h18"></path>
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
    <path d="M10 11v6"></path>
    <path d="M14 11v6"></path>
  </svg>`;

function escapeHtml(str = "") {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderLoading() {
  listEl.innerHTML = `<div class="loading-state">Carregando depoimentos...</div>`;
}

function renderEmpty() {
  listEl.innerHTML = `<div class="empty-state">Nenhum depoimento ainda. Seja o primeiro a contar sua experiência!</div>`;
}

function renderError(message) {
  listEl.innerHTML = `<div class="error-state">Não foi possível carregar os depoimentos${message ? ": " + escapeHtml(message) : "."}</div>`;
}

function createCardElement(post) {
  const card = document.createElement("article");
  card.className = "idea-card";
  card.dataset.id = post.id;

  card.innerHTML = `
    <h2>${escapeHtml(post.title)}</h2>
    <p>${escapeHtml(post.content)}</p>
    <div class="card-footer">
      <div class="author">
        ${ICON_USER}
        <span>${escapeHtml(post.author)}</span>
      </div>
      <button class="delete-btn" type="button" title="Excluir depoimento" aria-label="Excluir depoimento">
        ${ICON_TRASH}
      </button>
    </div>
  `;

  card.querySelector(".delete-btn").addEventListener("click", () => handleDelete(post.id, card));
  return card;
}

function renderPosts(posts) {
  if (!posts || !posts.length) {
    renderEmpty();
    return;
  }
  listEl.innerHTML = "";
  posts.forEach((post) => listEl.appendChild(createCardElement(post)));
}

async function loadPosts() {
  renderLoading();
  const res = await apiRequest.getPosts();
  if (!res.success) {
    renderError(res.statusText);
    return;
  }
  renderPosts(res.data);
}

async function handleDelete(id, cardEl) {
  const confirmed = window.confirm("Excluir este depoimento?");
  if (!confirmed) return;

  cardEl.style.opacity = "0.5";
  const res = await apiRequest.deletePost(id);

  if (res.success) {
    cardEl.remove();
    if (!listEl.children.length) renderEmpty();
  } else {
    cardEl.style.opacity = "1";
    window.alert("Erro ao excluir depoimento: " + res.statusText);
  }
}

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const author = authorInput.value.trim();
  if (!title || !content || !author) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Publicando...";

  const res = await apiRequest.createPost({ title, content, author });
  console.log(res);
  submitBtn.disabled = false;
  submitBtn.textContent = "Publicar depoimento";

  if (res.success) {
    formEl.reset();
    await loadPosts();
  } else {
    window.alert("Erro ao publicar depoimento: " + res.statusText);
  }
});

document.addEventListener("DOMContentLoaded", loadPosts);