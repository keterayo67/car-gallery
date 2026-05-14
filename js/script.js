// ========== ДАННЫЕ АЛЬБОМОВ ==========
const albums = {
    mercedes: {
        name: "Mercedes-Benz",
        type: "simple",
        icon: "⭐",
        images: [
            "img/mercedes/merc1.jpg",
            "img/mercedes/merc2.jpg",
            "img/mercedes/merc3.jpg",
            "img/mercedes/merc4.jpg"
        ]
    },
    bmw: {
        name: "BMW",
        type: "simple",
        icon: "🔵",
        images: [
            "img/bmw/bmw1.jpg",
            "img/bmw/bmw2.jpg",
            "img/bmw/bmw3.jpg",
            "img/bmw/bmw4.jpg"
        ]
    },
    audi: {
        name: "Audi",
        type: "simple",
        icon: "🔴",
        images: [
            "img/audi/audi1.jpg",
            "img/audi/audi2.jpg",
            "img/audi/audi3.jpg",
            "img/audi/audi4.jpg"
        ]
    },
    tesla: {
        name: "Tesla",
        type: "simple",
        icon: "⚡",
        images: [
            "img/tesla/tesla1.jpg",
            "img/tesla/tesla2.jpg",
            "img/tesla/tesla3.jpg",
            "img/tesla/tesla4.jpg"
        ]
    },
    porsche: {
        name: "Porsche",
        type: "simple",
        icon: "🐎",
        images: [
            "img/porsche/porsche1.jpg",
            "img/porsche/porsche2.jpg",
            "img/porsche/porsche3.jpg",
            "img/porsche/porsche4.jpg"
        ]
    },
    aurus: {
        name: "Aurus",
        type: "simple",
        icon: "👑",
        images: [
            "img/aurus/aurus1.jpg",
            "img/aurus/aurus2.jpg",
            "img/aurus/aurus3.jpg",
            "img/aurus/aurus4.jpg"
        ]
    },
    rollsroyce: {
        name: "Rolls-Royce",
        type: "simple",
        icon: "🕊️",
        images: [
            "img/rollsroyce/rolls1.jpg",
            "img/rollsroyce/rolls2.jpg",
            "img/rollsroyce/rolls3.jpg",
            "img/rollsroyce/rolls4.jpg"
        ]
    },
    lada: {
        name: "LADA",
        type: "folder",
        icon: "🚗",
        logo: "lada-logo.png",
        children: {
            niva: {
                name: "LADA Niva",
                icon: "🏔️",
                images: [
                    "img/lada/niva/niva1.jpg",
                    "img/lada/niva/niva2.jpg",
                    "img/lada/niva/niva3.jpg",
                    "img/lada/niva/niva4.jpg"
                ]
            },
            vesta: {
                name: "LADA Vesta",
                icon: "🏁",
                images: [
                    "img/lada/vesta/vesta1.jpg",
                    "img/lada/vesta/vesta2.jpg",
                    "img/lada/vesta/vesta3.jpg",
                    "img/lada/vesta/vesta4.jpg"
                ]
            }
        }
    }
};

// ========== ПЕРЕМЕННЫЕ СОСТОЯНИЯ ==========
let currentParentAlbum = null;
let currentAlbum = null;
let currentIndex = 0;
let slideshowInterval = null;
let isSlideshowActive = false;

// ========== DOM ЭЛЕМЕНТЫ ==========
const folderView = document.getElementById('folderView');
const folderGrid = document.getElementById('folderGrid');
const folderTitle = document.getElementById('folderTitle');
const backToAlbumsFromFolder = document.getElementById('backToAlbumsFromFolder');
const galleryView = document.getElementById('galleryView');
const albumTitle = document.getElementById('albumTitle');
const backToFolderBtn = document.getElementById('backToFolderBtn');
const mainPhoto = document.getElementById('mainPhoto');
const prevPhotoBtn = document.getElementById('prevPhoto');
const nextPhotoBtn = document.getElementById('nextPhoto');
const slideshowBtn = document.getElementById('slideshowBtn');
const thumbsGrid = document.getElementById('thumbsGrid');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.querySelector('.close');

// ========== ФУНКЦИЯ ОСТАНОВКИ СЛАЙД-ШОУ ==========
function stopSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
    isSlideshowActive = false;
    if (slideshowBtn) {
        slideshowBtn.textContent = '▶ СЛАЙД-ШОУ';
        slideshowBtn.style.background = '#27ae60';
    }
}

// ========== ФУНКЦИИ НАВИГАЦИИ ==========

// Показать главный экран (все альбомы)
function showMainView() {
    const topGrid = document.getElementById('topAlbumsGrid');
    const bottomGrid = document.getElementById('bottomAlbumsGrid');
    
    if (topGrid) {
        topGrid.style.display = 'flex';
        topGrid.style.flexWrap = 'wrap';
        topGrid.style.justifyContent = 'center';
    }
    
    if (bottomGrid) {
        bottomGrid.style.display = 'flex';
        bottomGrid.style.flexWrap = 'wrap';
        bottomGrid.style.justifyContent = 'center';
    }
    
    if (folderView) folderView.style.display = 'none';
    if (galleryView) galleryView.style.display = 'none';
    
    stopSlideshow();
    
    // Прокрутка вверх
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Показать содержимое папки (альбомы внутри LADA)
function showFolderView(parentKey) {
    currentParentAlbum = albums[parentKey];
    if (folderTitle) folderTitle.textContent = currentParentAlbum.name;
    
    if (folderGrid) {
        folderGrid.innerHTML = '';
        for (const [key, child] of Object.entries(currentParentAlbum.children)) {
            const card = document.createElement('div');
            card.classList.add('album-card');
            card.innerHTML = `
                <div class="album-icon"><div style="font-size: 50px;">${child.icon}</div></div>
                <h2>${child.name}</h2>
                <p>${child.images.length} фото</p>
            `;
            card.onclick = () => showGalleryView(child, key);
            folderGrid.appendChild(card);
        }
    }
    
    const topGrid = document.getElementById('topAlbumsGrid');
    const bottomGrid = document.getElementById('bottomAlbumsGrid');
    if (topGrid) topGrid.style.display = 'none';
    if (bottomGrid) bottomGrid.style.display = 'none';
    if (folderView) folderView.style.display = 'block';
    if (galleryView) galleryView.style.display = 'none';
}

// Показать галерею с фото
function showGalleryView(albumData, albumKey) {
    currentAlbum = albumData;
    currentIndex = 0;
    
    stopSlideshow();
    
    if (albumTitle) albumTitle.textContent = currentAlbum.name;
    
    updateMainPhoto();
    renderThumbnails();
    
    const topGrid = document.getElementById('topAlbumsGrid');
    const bottomGrid = document.getElementById('bottomAlbumsGrid');
    if (topGrid) topGrid.style.display = 'none';
    if (bottomGrid) bottomGrid.style.display = 'none';
    if (folderView) folderView.style.display = 'none';
    if (galleryView) galleryView.style.display = 'block';
}

// ========== ФУНКЦИИ ГАЛЕРЕИ ==========

function updateMainPhoto() {
    if (currentAlbum && mainPhoto) {
        mainPhoto.src = currentAlbum.images[currentIndex];
    }
}

function renderThumbnails() {
    if (!thumbsGrid) return;
    thumbsGrid.innerHTML = '';
    
    currentAlbum.images.forEach((src, idx) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.classList.add('thumb');
        thumb.onclick = () => {
            if (isSlideshowActive) stopSlideshow();
            currentIndex = idx;
            updateMainPhoto();
        };
        thumbsGrid.appendChild(thumb);
    });
}

function startSlideshow() {
    if (slideshowInterval) clearInterval(slideshowInterval);
    isSlideshowActive = true;
    if (slideshowBtn) {
        slideshowBtn.textContent = '⏸ СТОП';
        slideshowBtn.style.background = '#c0392b';
    }
    slideshowInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % currentAlbum.images.length;
        updateMainPhoto();
    }, 2000);
}

function toggleSlideshow() {
    if (isSlideshowActive) {
        stopSlideshow();
    } else {
        startSlideshow();
    }
}

function openModal() {
    if (modal && modalImage && currentAlbum) {
        modal.style.display = 'block';
        modalImage.src = currentAlbum.images[currentIndex];
    }
}

function closeModalFunc() {
    if (modal) modal.style.display = 'none';
}

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

if (prevPhotoBtn) {
    prevPhotoBtn.onclick = () => {
        if (isSlideshowActive) stopSlideshow();
        currentIndex = (currentIndex - 1 + currentAlbum.images.length) % currentAlbum.images.length;
        updateMainPhoto();
    };
}

if (nextPhotoBtn) {
    nextPhotoBtn.onclick = () => {
        if (isSlideshowActive) stopSlideshow();
        currentIndex = (currentIndex + 1) % currentAlbum.images.length;
        updateMainPhoto();
    };
}

if (slideshowBtn) slideshowBtn.onclick = toggleSlideshow;
if (mainPhoto) mainPhoto.onclick = openModal;
if (backToAlbumsFromFolder) backToAlbumsFromFolder.onclick = showMainView;
if (backToFolderBtn) backToFolderBtn.onclick = showMainView;
if (closeModal) closeModal.onclick = closeModalFunc;

if (modal) {
    modal.onclick = (e) => {
        if (e.target === modal) closeModalFunc();
    };
}

document.onkeydown = (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'block') {
        closeModalFunc();
    }
};

// ========== СОЗДАНИЕ КАРТОЧЕК НА ГЛАВНОЙ ==========

function renderMainAlbums() {
    const topGrid = document.getElementById('topAlbumsGrid');
    const bottomGrid = document.getElementById('bottomAlbumsGrid');
    
    if (topGrid) topGrid.innerHTML = '';
    if (bottomGrid) bottomGrid.innerHTML = '';
    
    const topCategories = ['mercedes', 'bmw', 'audi', 'tesla'];
    const bottomCategories = ['porsche', 'aurus', 'rollsroyce', 'lada'];
    
    function createCard(key, album) {
        const card = document.createElement('div');
        card.classList.add('album-card');
        
        if (album.type === 'folder') {
            // LADA
            const logoFile = album.logo ? `img/${album.logo}` : null;
            card.innerHTML = `
                <div class="album-icon">
                    ${logoFile ? `<img src="${logoFile}" style="width: 70px; height: 70px; object-fit: contain;">` : '📁'}
                </div>
                <h2>${album.name}</h2>
                <p>📁 ${Object.keys(album.children).length} альбома</p>
            `;
            card.onclick = () => showFolderView(key);
        } else {
            // Обычные марки
            const logoFile = `img/${key}-logo.png`;
            card.innerHTML = `
                <div class="album-icon">
                    <img src="${logoFile}" style="width: 70px; height: 70px; object-fit: contain;" onerror="this.style.display='none'; this.parentElement.innerHTML='${album.icon}'; this.parentElement.style.fontSize='50px';">
                </div>
                <h2>${album.name}</h2>
                <p>${album.images.length} фото</p>
            `;
            card.onclick = () => showGalleryView(album, key);
        }
        return card;
    }
    
    // Верхние категории
    for (const key of topCategories) {
        if (albums[key] && topGrid) {
            topGrid.appendChild(createCard(key, albums[key]));
        }
    }
    
    // Нижние категории
    for (const key of bottomCategories) {
        if (albums[key] && bottomGrid) {
            bottomGrid.appendChild(createCard(key, albums[key]));
        }
    }
}

// ========== ЗАПУСК ==========
renderMainAlbums();
showMainView();