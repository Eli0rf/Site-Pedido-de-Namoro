// Sistema de Personalização para Jade
const CONFIG_KEY = 'jade_romance_config';

// Elementos principais
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');
const heartsContainer = document.querySelector('.hearts-container');
const adminPanel = document.getElementById('adminPanel');
const closeAdminBtn = document.getElementById('closeAdminBtn');

// Elementos de exibição
const pageTitle = document.getElementById('pageTitle');
const mainTitle = document.getElementById('mainTitle');
const subtitle = document.getElementById('subtitle');
const responseTitle = document.getElementById('responseTitle');
const responseMessage = document.getElementById('responseMessage');
const extraMessage = document.getElementById('extraMessage');
const topImageContainer = document.getElementById('topImageContainer');
const photoGallery = document.getElementById('photoGallery');
const responseImageContainer = document.getElementById('responseImageContainer');
const videoContainer = document.getElementById('videoContainer');
const customBgImage = document.getElementById('customBgImage');

// Carregar configuração ao iniciar
window.addEventListener('DOMContentLoaded', () => loadConfig());

// Botão NÃO foge sempre
noBtn.addEventListener('mouseenter', moveNoBtn);
noBtn.addEventListener('click', moveNoBtn);
noBtn.addEventListener('touchstart', moveNoBtn);

// Botão SIM mostra mensagem
yesBtn.addEventListener('click', () => {
  overlay.style.display = 'flex';
  launchHearts();
});

// Fechar mensagem
closeBtn.addEventListener('click', () => overlay.style.display = 'none');

// Move o botão NÃO
function moveNoBtn() {
  const maxX = window.innerWidth - noBtn.offsetWidth - 20;
  const maxY = window.innerHeight - noBtn.offsetHeight - 20;
  const newX = Math.random() * maxX;
  const newY = Math.random() * maxY;
  noBtn.style.position = 'fixed';
  noBtn.style.left = `${newX}px`;
  noBtn.style.top = `${newY}px`;
}

// Corações animados
function launchHearts() {
  for (let i = 0; i < 50; i++) {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.textContent = '❤️';
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 2000);
  }
}

// Abrir painel admin com Ctrl+Shift+A
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
    e.preventDefault();
    adminPanel.style.display = 'flex';
    loadConfigToInputs();
  }
});

closeAdminBtn.addEventListener('click', () => adminPanel.style.display = 'none');

// Sistema de Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${tab}`).classList.add('active');
  });
});


// Preview de imagens
function setupImagePreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    }
  });
}

setupImagePreview('input-topImage', 'preview-topImage');
setupImagePreview('input-bgImage', 'preview-bgImage');
setupImagePreview('input-responseImage', 'preview-responseImage');

// Preview galeria
document.getElementById('input-gallery').addEventListener('change', (e) => {
  const preview = document.getElementById('preview-gallery');
  preview.innerHTML = '';
  Array.from(e.target.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (event) => {
      preview.innerHTML += `<img src="${event.target.result}" alt="Gallery">`;
    };
    reader.readAsDataURL(file);
  });
});

// Preview vídeo
document.getElementById('input-video').addEventListener('change', (e) => {
  const file = e.target.files[0];
  const preview = document.getElementById('preview-video');
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      preview.innerHTML = `<video src="${event.target.result}" controls></video>`;
    };
    reader.readAsDataURL(file);
  }
});

// Botões remover
document.querySelectorAll('.remove-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    document.getElementById(`input-${target}`).value = '';
    document.getElementById(`preview-${target}`).innerHTML = '';
  });
});

// SALVAR CONFIGURAÇÃO
document.getElementById('saveBtn').addEventListener('click', async () => {
  const config = {
    pageTitle: document.getElementById('input-pageTitle').value,
    mainTitle: document.getElementById('input-mainTitle').value,
    subtitle: document.getElementById('input-subtitle').value,
    responseTitle: document.getElementById('input-responseTitle').value,
    responseMessage: document.getElementById('input-responseMessage').value,
    extraMessage: document.getElementById('input-extraMessage').value,
    primaryColor: document.getElementById('input-primaryColor').value,
    bgColor1: document.getElementById('input-bgColor1').value,
    bgColor2: document.getElementById('input-bgColor2').value,
    bgOpacity: document.getElementById('input-bgOpacity').value,
    videoUrl: document.getElementById('input-videoUrl').value,
    topImage: await getBase64('input-topImage'),
    bgImage: await getBase64('input-bgImage'),
    responseImage: await getBase64('input-responseImage'),
    video: await getBase64('input-video'),
    gallery: await getGalleryBase64('input-gallery')
  };
  
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  alert('✅ Configuração salva! Agora você pode enviar a URL para Jade.');
  loadConfig();
  adminPanel.style.display = 'none';
});

// CARREGAR CONFIGURAÇÃO
function loadConfig() {
  const saved = localStorage.getItem(CONFIG_KEY);
  if (!saved) return;
  const config = JSON.parse(saved);
  if (config.pageTitle) pageTitle.textContent = config.pageTitle;
  if (config.mainTitle) mainTitle.textContent = config.mainTitle;
  if (config.subtitle) subtitle.textContent = config.subtitle;
  if (config.responseTitle) responseTitle.textContent = config.responseTitle;
  if (config.responseMessage) responseMessage.textContent = config.responseMessage;
  if (config.extraMessage) extraMessage.textContent = config.extraMessage;
  if (config.primaryColor) {
    document.querySelectorAll('.title, .message-box h2').forEach(el => el.style.color = config.primaryColor);
  }
  if (config.bgColor1 && config.bgColor2) {
    document.body.style.background = `linear-gradient(135deg, ${config.bgColor1}, ${config.bgColor2})`;
  }
  if (config.topImage) topImageContainer.innerHTML = `<img src="${config.topImage}" alt="Foto">`;
  if (config.bgImage) {
    customBgImage.style.backgroundImage = `url(${config.bgImage})`;
    customBgImage.style.display = 'block';
    customBgImage.style.opacity = (config.bgOpacity || 30) / 100;
  }
  if (config.responseImage) responseImageContainer.innerHTML = `<img src="${config.responseImage}" alt="Resposta">`;
  if (config.gallery && config.gallery.length > 0) {
    photoGallery.innerHTML = '';
    config.gallery.forEach(img => photoGallery.innerHTML += `<img src="${img}" alt="Galeria">`);
  }
  if (config.video) {
    videoContainer.innerHTML = `<video src="${config.video}" controls></video>`;
  } else if (config.videoUrl) {
    const videoId = extractYouTubeID(config.videoUrl);
    if (videoId) videoContainer.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
  }
}

function loadConfigToInputs() {
  const saved = localStorage.getItem(CONFIG_KEY);
  if (!saved) return;
  const config = JSON.parse(saved);
  document.getElementById('input-pageTitle').value = config.pageTitle || '';
  document.getElementById('input-mainTitle').value = config.mainTitle || '';
  document.getElementById('input-subtitle').value = config.subtitle || '';
  document.getElementById('input-responseTitle').value = config.responseTitle || '';
  document.getElementById('input-responseMessage').value = config.responseMessage || '';
  document.getElementById('input-extraMessage').value = config.extraMessage || '';
  document.getElementById('input-primaryColor').value = config.primaryColor || '#d6336c';
  document.getElementById('input-bgColor1').value = config.bgColor1 || '#ffe4e1';
  document.getElementById('input-bgColor2').value = config.bgColor2 || '#ffc0cb';
  document.getElementById('input-bgOpacity').value = config.bgOpacity || 30;
  document.getElementById('opacity-value').textContent = (config.bgOpacity || 30) + '%';
  document.getElementById('input-videoUrl').value = config.videoUrl || '';
  if (config.topImage) document.getElementById('preview-topImage').innerHTML = `<img src="${config.topImage}">`;
  if (config.bgImage) document.getElementById('preview-bgImage').innerHTML = `<img src="${config.bgImage}">`;
  if (config.responseImage) document.getElementById('preview-responseImage').innerHTML = `<img src="${config.responseImage}">`;
  if (config.gallery) {
    const galleryPreview = document.getElementById('preview-gallery');
    galleryPreview.innerHTML = '';
    config.gallery.forEach(img => galleryPreview.innerHTML += `<img src="${img}">`);
  }
  if (config.video) document.getElementById('preview-video').innerHTML = `<video src="${config.video}" controls></video>`;
}

// RESETAR
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('⚠️ Tem certeza que deseja resetar tudo?')) {
    localStorage.removeItem(CONFIG_KEY);
    location.reload();
  }
});

// EXPORTAR
document.getElementById('exportBtn').addEventListener('click', () => {
  const config = localStorage.getItem(CONFIG_KEY);
  if (!config) { alert('Nenhuma configuração para exportar.'); return; }
  const blob = new Blob([config], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'config-jade.json';
  a.click();
  URL.revokeObjectURL(url);
});

// IMPORTAR
document.getElementById('importBtn').addEventListener('click', () => {
  document.getElementById('importFile').click();
});

document.getElementById('importFile').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const config = JSON.parse(event.target.result);
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        alert('✅ Configuração importada!');
        location.reload();
      } catch (error) {
        alert('❌ Erro ao importar.');
      }
    };
    reader.readAsText(file);
  }
});

// UTILITÁRIOS
async function getBase64(inputId) {
  const input = document.getElementById(inputId);
  const file = input.files[0];
  if (!file) return null;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

async function getGalleryBase64(inputId) {
  const input = document.getElementById(inputId);
  const files = Array.from(input.files);
  if (files.length === 0) return [];
  const promises = files.map(file => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  });
  return Promise.all(promises);
}

function extractYouTubeID(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

