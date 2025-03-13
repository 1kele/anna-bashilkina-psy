// Функция для открытия модального окна добаюкивания
function openLullabyModal(serviceTitle) {
    const modal = document.getElementById('lullabyModal');
    const serviceNameElement = document.getElementById('serviceName');
    const serviceTypeInput = document.getElementById('serviceType');
    
    if (modal) {
        // Установка названия услуги
        if (serviceTitle) {
            serviceNameElement.textContent = serviceTitle;
            serviceTypeInput.value = serviceTitle;
        } else {
            // Если название не передано, используем значение по умолчанию
            serviceNameElement.textContent = "Добаюкивание";
            serviceTypeInput.value = "Добаюкивание";
        }
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
    }
}

// Функция для открытия модального окна добаюкивания
function openLullabyModal(serviceType) {
    const modal = document.getElementById('lullabyModal');
    const serviceNameSpan = document.getElementById('serviceName');
    const serviceTypeInput = document.getElementById('serviceType');
    
    // Устанавливаем тип услуги
    serviceNameSpan.textContent = serviceType;
    serviceTypeInput.value = serviceType;
    
    // Показываем модальное окно
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

document.addEventListener('DOMContentLoaded', function() {
    // Предотвращаем действие по умолчанию для кнопок возврата
    const backButtons = document.querySelectorAll('.back-button, .mobile-home-button');
    backButtons.forEach(button => {
        button.addEventListener('mousedown', function(event) {
            if (event.button === 2) { // Правая кнопка мыши
                event.preventDefault();
                return false;
            }
        });
    });

    // Модальные окна
    const modals = {
        consultation: document.getElementById('consultationModal'),
        family: document.getElementById('familyModal'),
        studio: document.getElementById('studioModal'),
        lullaby: document.getElementById('lullabyModal')
    };
    
    // Кнопки для открытия модальных окон
    const introBtn = document.querySelector('.intro__btn');
    const familyBtn = document.querySelector('.family-btn');
    const studioBtn = document.querySelector('.studio-rent-btn');
    const lullabyBtn = document.querySelector('.lullaby-page__btn');
    const consultationPageBtn = document.querySelector('.consultation-page__btn');
    
    // Кнопки закрытия модальных окон
    const closeButtons = document.querySelectorAll('.modal__close');
    
    // Формы
    const consultationForm = document.getElementById('consultationForm');
    const familyForm = document.getElementById('familyForm');
    const studioForm = document.getElementById('studioForm');
    const lullabyForm = document.getElementById('lullabyForm');
    
    // Функция открытия модального окна с анимацией
    function openModal(modal) {
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Запрещаем прокрутку страницы
        }
    }
    
    // Функция для плавного закрытия модального окна
    function closeModalWithAnimation(modal) {
        if (modal) {
            modal.classList.add('hiding');
            setTimeout(() => {
                modal.classList.remove('show', 'hiding');
                document.body.style.overflow = ''; // Возвращаем прокрутку страницы
            }, 300); // Время должно совпадать с длительностью анимации в CSS
        }
    }
    
    // Обработчики событий для открытия модальных окон
    if (introBtn) {
        introBtn.addEventListener('click', function() {
            openModal(modals.consultation);
        });
    }
    
    if (consultationPageBtn) {
        consultationPageBtn.addEventListener('click', function() {
            openModal(modals.consultation);
        });
    }
    
    if (familyBtn) {
        familyBtn.addEventListener('click', function() {
            openModal(modals.family);
        });
    }
    
    if (studioBtn) {
        studioBtn.addEventListener('click', function() {
            const modal = document.getElementById('studioModal');
            if (modal) {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    if (lullabyBtn) {
        lullabyBtn.addEventListener('click', function() {
            openModal(modals.lullaby);
        });
    }
    
    // Обработчики для закрытия модального окна
    closeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const modal = button.closest('.modal');
            closeModalWithAnimation(modal);
        });
    });
    
    // Закрытие модального окна при клике вне его содержимого
    window.addEventListener('click', function(event) {
        Object.values(modals).forEach(function(modal) {
            if (event.target === modal || event.target.classList.contains('modal__overlay')) {
                closeModalWithAnimation(modal);
            }
        });
    });
    
    // Закрытие модального окна при нажатии Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            Object.values(modals).forEach(function(modal) {
                if (modal && modal.classList.contains('show')) {
                    closeModalWithAnimation(modal);
                }
            });
        }
    });
    
    // Обработка отправки форм
    const forms = document.querySelectorAll('.modal__form');
    
    forms.forEach(function(form) {
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Показываем индикатор загрузки
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Отправка...';
                }

                // Отправляем форму
                sendEmail(form)
                    .then(() => {
                        // Скрываем поля формы
                        const formGroups = form.querySelectorAll('.form-group');
                        formGroups.forEach(group => group.style.display = 'none');
                        if (submitBtn) submitBtn.style.display = 'none';

                        // Показываем сообщение об успехе
                        const successMessage = document.createElement('div');
                        successMessage.innerHTML = `
                            <div class="success-message" style="text-align: center; margin: 20px;">
                                <i class="fas fa-check-circle" style="color: #4CAF50; font-size: 48px; margin-bottom: 15px;"></i>
                                <p style="font-size: 18px; margin-bottom: 10px;">Спасибо! Ваша заявка отправлена.</p>
                                <p style="font-size: 16px;">Мы свяжемся с вами в ближайшее время.</p>
                            </div>
                        `;
                        form.appendChild(successMessage);

                        // Закрываем модальное окно через 3 секунды
                        setTimeout(() => {
                            const modal = form.closest('.modal');
                            if (modal) {
                                modal.classList.remove('show');
                                document.body.style.overflow = '';

                                // Восстанавливаем форму через секунду после закрытия
                                setTimeout(() => {
                                    form.reset();
                                    formGroups.forEach(group => group.style.display = '');
                                    if (submitBtn) {
                                        submitBtn.style.display = '';
                                        submitBtn.disabled = false;
                                        submitBtn.textContent = 'Отправить';
                                    }
                                    successMessage.remove();
                                }, 1000);
                            }
                        }, 3000);
                    })
                    .catch(error => {
                        console.error('Error sending email:', error);
                        alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = 'Отправить';
                        }
                    });
            });
        }
    });
    
    // Обработка отправки форм
    const forms2 = [consultationForm, familyForm, studioForm, lullabyForm];
    
    forms2.forEach(function(form) {
        if (form) {
            // Полностью пропускаем обработку для форм с Formspree
            if (form.action && form.action.includes('formspree.io')) {
                // Formspree формы обрабатываются стандартным способом
                return;
            }
            
            // Для остальных форм используем обычный обработчик
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                
                // Получаем данные формы
                const formData = new FormData(form);
                const formDataObj = {};
                
                // Преобразуем FormData в объект
                for (let [key, value] of formData.entries()) {
                    formDataObj[key] = value;
                }
                // Добавляем цену услуги в зависимости от типа
                if (formDataObj.consultationType) {
                    let servicePrice = '';
                    let serviceName = '';
                    
                    switch(formDataObj.consultationType) {
                        case 'single':
                            servicePrice = '3500 ₽';
                            serviceName = 'Индивидуальная разовая консультация';
                            break;
                        case 'package5':
                            servicePrice = '16000 ₽';
                            serviceName = 'Пакет из 5 консультаций';
                            break;
                        case 'package10':
                            servicePrice = '30000 ₽';
                            serviceName = 'Пакет из 10 консультаций';
                            break;
                    }
                    
                    // Добавляем имя и цену услуги к данным формы
                    formDataObj.servicePrice = servicePrice;
                    formDataObj.serviceName = serviceName;
                }
                console.log('Отправка формы:', formDataObj);
                
                // Очищаем форму
                form.reset();
                
                // Закрываем модальное окно
                const modal = form.closest('.modal');
                
                // Показываем сообщение об успешной отправке
                const formGroups = form.querySelectorAll('.form-group');
                formGroups.forEach(group => group.style.display = 'none');
                
                const submitBtn = form.querySelector('.modal__btn');
                submitBtn.style.display = 'none';
                
                const successMessage = document.createElement('div');
                successMessage.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle success-icon"></i>
                        <p>Спасибо! Ваша заявка отправлена.</p>
                        <p>Мы свяжемся с вами в ближайшее время.</p>
                    </div>
                `;
                successMessage.style.textAlign = 'center';
                successMessage.style.padding = '20px 0';
                
                form.appendChild(successMessage);
                
                // Закрываем модальное окно через 3 секунды
                setTimeout(function() {
                    closeModalWithAnimation(modal);
                    
                    // Восстанавливаем форму после закрытия
                    setTimeout(function() {
                        formGroups.forEach(group => group.style.display = 'block');
                        submitBtn.style.display = 'block';
                        if (successMessage.parentNode === form) {
                            form.removeChild(successMessage);
                        }
                    }, 500);
                }, 3000);
            });
        }
    });
    
    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            // Предотвращаем скрытие хедера при навигации
            if (header) {
                header.classList.remove('header--hidden');
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Анимация при прокрутке
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.about__image, .about__content, .contacts__item, .service-section__content, .service-section__image, .modern-service__content, .modern-service__image-wrapper, .fade-in-up');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };
    
    // Добавляем класс для анимации при загрузке страницы
    setTimeout(animateOnScroll, 300);
    
    // Добавляем класс для анимации при прокрутке
    window.addEventListener('scroll', animateOnScroll);
    
    // Активация пунктов меню при прокрутке
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    function highlightNavOnScroll() {
        const scrollPosition = window.scrollY + 200; // Добавляем смещение для более раннего срабатывания
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}` || link.getAttribute('href') === `index.html#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Вызываем функцию при загрузке страницы
    highlightNavOnScroll();
    
    // Вызываем функцию при прокрутке
    window.addEventListener('scroll', highlightNavOnScroll);

    // Функция для скрытия и показа хедера при прокрутке
    let lastScrollTop = 0;
    const header = document.querySelector('.header'); // Объявляем переменную header
    const headerHeight = header ? header.offsetHeight : 0;
    
    function handleHeaderVisibility() {
        if (!header) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Если прокрутили больше высоты хедера
        if (scrollTop > headerHeight) {
            // Прокрутка вниз - скрываем хедер
            if (scrollTop > lastScrollTop) {
                header.classList.add('header--hidden');
            } 
            // Прокрутка вверх - показываем хедер
            else {
                header.classList.remove('header--hidden');
            }
        } else {
            // Вернулись в начало страницы - всегда показываем хедер
            header.classList.remove('header--hidden');
        }
        
        lastScrollTop = scrollTop;
    }
    
    // Добавляем обработчик события прокрутки с небольшой задержкой для улучшения производительности
    let scrollTimer;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(handleHeaderVisibility, 10);
    });
    
    // Вызываем функцию при загрузке страницы
    handleHeaderVisibility();
    
    // Удаляем предыдущий код для хедера, который теперь заменен новым
    // let lastScroll = 0;
    // let scrollThreshold = 200;
    // let headerHidden = false;
    
    // window.addEventListener('scroll', function() {
    //     const currentScroll = window.pageYOffset;
        
    //     if (Math.abs(lastScroll - currentScroll) <= 5) return;
        
    //     if (currentScroll > lastScroll && !headerHidden) {
    //         // Скролл вниз
    //         if (currentScroll > scrollThreshold && header) {
    //             headerHidden = true;
    //             header.classList.add('nav-down');
    //         }
    //     } else if (currentScroll < lastScroll && headerHidden) {
    //         // Скролл вверх
    //         headerHidden = false;
    //         if (header) header.classList.remove('nav-down');
    //     }
        
    //     lastScroll = currentScroll;
    // });
    
    // Слайдер отзывов
    const sliderContainer = document.querySelector('.testimonials__slider-container');
    if (!sliderContainer) return;

    const slider = document.querySelector('.testimonials__slider');
    const cards = Array.from(slider.querySelectorAll('.testimonial-card'));
    const dotsContainer = document.querySelector('.testimonials__dots');
    const dots = Array.from(dotsContainer.querySelectorAll('.testimonials__dot'));
    const prevBtn = document.querySelector('.testimonials__arrow--prev');
    const nextBtn = document.querySelector('.testimonials__arrow--next');
    
    let currentIndex = 0;
    let startX, moveX;
    let isMoving = false;
    
    // Определяем количество видимых карточек в зависимости от ширины экрана
    function getVisibleCards() {
        if (window.innerWidth <= 768) {
            return 1;
        } else if (window.innerWidth <= 1200) {
            return 2;
        } else {
            return 3;
        }
    }
    
    // Функция для обновления слайдера
    function updateSlider() {
        const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginLeft) * 2;
        const offset = -currentIndex * cardWidth;
        
        // Применяем трансформацию к слайдеру
        slider.style.transform = `translateX(${offset}px)`;
        
        // Обновляем активную точку
        dots.forEach((dot, index) => {
            dot.classList.toggle('testimonials__dot--active', index === currentIndex);
        });
        
        // Обновляем состояние кнопок
        prevBtn.disabled = currentIndex === 0;
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        
        nextBtn.disabled = currentIndex >= cards.length - getVisibleCards();
        nextBtn.style.opacity = currentIndex >= cards.length - getVisibleCards() ? '0.5' : '1';
    }
    
    // Обработчики событий для кнопок
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - getVisibleCards()) {
            currentIndex++;
            updateSlider();
        }
    });
    
    // Обработчики событий для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
        });
    });
    
    // Обработчики событий для свайпа на мобильных устройствах
    sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isMoving = true;
    });
    
    sliderContainer.addEventListener('touchmove', (e) => {
        if (!isMoving) return;
        moveX = e.touches[0].clientX;
        
        // Предотвращаем прокрутку страницы при свайпе
        e.preventDefault();
    });
    
    sliderContainer.addEventListener('touchend', () => {
        if (!isMoving) return;
        
        const diffX = startX - moveX;
        const threshold = 50; // Минимальное расстояние для свайпа
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Свайп влево - следующий слайд
                if (currentIndex < cards.length - getVisibleCards()) {
                    currentIndex++;
                }
            } else {
                // Свайп вправо - предыдущий слайд
                if (currentIndex > 0) {
                    currentIndex--;
                }
            }
            
            updateSlider();
        }
        
        isMoving = false;
    });
    
    // Обработчик события для клавиатуры (стрелки влево/вправо)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        } else if (e.key === 'ArrowRight') {
            if (currentIndex < cards.length - getVisibleCards()) {
                currentIndex++;
                updateSlider();
            }
        }
    });
    
    // Обновление слайдера при изменении размера окна
    window.addEventListener('resize', () => {
        // Сбрасываем индекс, если он выходит за пределы допустимого
        if (currentIndex > cards.length - getVisibleCards()) {
            currentIndex = cards.length - getVisibleCards();
        }
        updateSlider();
    });
    
    // Инициализация слайдера
    updateSlider();
    
    // Автоматическое листание каждые 5 секунд
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            if (currentIndex < cards.length - getVisibleCards()) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Запускаем автоматическое листание
    startAutoSlide();
    
    // Останавливаем при наведении на слайдер
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
    
    // Останавливаем при касании на мобильных
    sliderContainer.addEventListener('touchstart', stopAutoSlide);
    
    // Запускаем анимацию появления для карточек
    cards.forEach((card, index) => {
        card.style.animationDelay = `${0.4 + index * 0.2}s`;
    });

    // Предотвращаем переход назад при нажатии правой кнопки мыши
    (function() {
        // Блокируем стандартное поведение правой кнопки мыши
        // document.oncontextmenu = function(e) {
        //     e.preventDefault();
        //     return false;
        // };
        
        // Блокируем все события мыши, связанные с правой кнопкой
        // document.addEventListener('mousedown', function(e) {
        //     if (e.button === 2) {
        //         e.preventDefault();
        //         e.stopPropagation();
        //         return false;
        //     }
        // }, true);
        
        if (window.location.pathname === '/' || window.location.pathname.endsWith('/index.html')) {
            history.pushState(null, null, location.href);
            window.onpopstate = function() {
                history.go(1);
            };
        }
    })();
});

document.addEventListener('DOMContentLoaded', function() {
    // Получаем все кнопки с классом pricing-card__btn
    const pricingButtons = document.querySelectorAll('.pricing-card__btn');
    
    // Для каждой кнопки добавляем обработчик события
    pricingButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Получаем значение атрибута data-service
            const serviceType = this.getAttribute('data-service');
            
            // Получаем модальное окно
            const modal = document.getElementById('consultationModal');
            
            // Устанавливаем значение в скрытое поле
            const consultationTypeInput = document.getElementById('consultationType');
            if (consultationTypeInput) {
                consultationTypeInput.value = serviceType;
            }
            
            // Открываем модальное окно
            if (modal) {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Функционал мобильного меню
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Открытие/закрытие мобильного меню
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function() {
            if (this.classList.contains('active')) {
                // Если меню открыто - закрываем
                this.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = ''; // Возвращаем прокрутку страницы
            } else {
                // Если меню закрыто - открываем
                this.classList.add('active');
                nav.classList.add('active');
                document.body.style.overflow = 'hidden'; // Запрещаем прокрутку страницы
            }
        });
    }
    
    // Закрытие мобильного меню при клике на ссылку
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            hamburgerMenu.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = ''; // Возвращаем прокрутку страницы
        });
    });
    
    // Закрытие мобильного меню при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767) {
            hamburgerMenu.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal__close');
        
        // Закрытие по клику на крестик
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            });
        }
        
        // Закрытие по клику вне модального окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    });
});

// Код для слайдера с фото-отзывами
document.addEventListener('DOMContentLoaded', function() {
    const photoSliderContainer = document.querySelector('.photo-testimonials__slider-container');
    const photoSlider = document.querySelector('.photo-testimonials__slider');
    const photoCards = document.querySelectorAll('.photo-testimonial-card');
    const photoPrevBtn = document.querySelector('.photo-testimonials__arrow--prev');
    const photoNextBtn = document.querySelector('.photo-testimonials__arrow--next');
    const photoDots = document.querySelectorAll('.photo-testimonials__dot');
    const photoModal = document.getElementById('photoModal');
    const photoModalImage = document.querySelector('.photo-modal__image');
    const photoModalClose = document.querySelector('.photo-modal__close');
    
    // Если элементы слайдера не найдены, прекращаем выполнение
    if (!photoSlider || !photoCards.length) return;
    
    let photoCurrentIndex = 0;
    let photoStartX, photoMoveX;
    let photoIsMoving = false;
    
    // Определяем количество видимых карточек в зависимости от ширины экрана
    function getPhotoVisibleCards() {
        if (window.innerWidth <= 767) {
            return 1;
        } else {
            return 3; // Для десктопа показываем по 3 карточки сразу
        }
    }
    
    // Функция для обновления слайдера
    function updatePhotoSlider() {
        const cardWidth = photoCards[0].offsetWidth + parseInt(getComputedStyle(photoCards[0]).marginLeft) * 2;
        const offset = -photoCurrentIndex * cardWidth;
        
        // Применяем трансформацию к слайдеру
        photoSlider.style.transform = `translateX(${offset}px)`;
        
        // Обновляем активную точку
        photoDots.forEach((dot, index) => {
            dot.classList.toggle('photo-testimonials__dot--active', index === photoCurrentIndex);
        });
        
        // Обновляем состояние кнопок
        photoPrevBtn.disabled = photoCurrentIndex === 0;
        photoPrevBtn.style.opacity = photoCurrentIndex === 0 ? '0.5' : '1';
        
        photoNextBtn.disabled = photoCurrentIndex >= photoCards.length - getPhotoVisibleCards();
        photoNextBtn.style.opacity = photoCurrentIndex >= photoCards.length - getPhotoVisibleCards() ? '0.5' : '1';
    }
    
    // Обработчики событий для кнопок
    photoPrevBtn.addEventListener('click', () => {
        if (photoCurrentIndex > 0) {
            photoCurrentIndex--;
            updatePhotoSlider();
        }
    });
    
    photoNextBtn.addEventListener('click', () => {
        if (photoCurrentIndex < photoCards.length - getPhotoVisibleCards()) {
            photoCurrentIndex++;
            updatePhotoSlider();
        }
    });
    
    // Обработчики событий для точек
    photoDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            photoCurrentIndex = index;
            updatePhotoSlider();
        });
    });
    
    // Обработчики событий для свайпа на мобильных устройствах
    photoSliderContainer.addEventListener('touchstart', (e) => {
        photoStartX = e.touches[0].clientX;
        photoIsMoving = true;
    });
    
    photoSliderContainer.addEventListener('touchmove', (e) => {
        if (!photoIsMoving) return;
        photoMoveX = e.touches[0].clientX;
        
        // Предотвращаем прокрутку страницы при свайпе
        e.preventDefault();
    });
    
    photoSliderContainer.addEventListener('touchend', () => {
        if (!photoIsMoving) return;
        
        const diffX = photoStartX - photoMoveX;
        const threshold = 50; // Минимальное расстояние для свайпа
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Свайп влево - следующий слайд
                if (photoCurrentIndex < photoCards.length - getPhotoVisibleCards()) {
                    photoCurrentIndex++;
                }
            } else {
                // Свайп вправо - предыдущий слайд
                if (photoCurrentIndex > 0) {
                    photoCurrentIndex--;
                }
            }
            
            updatePhotoSlider();
        }
        
        photoIsMoving = false;
    });
    
    // Обновление слайдера при изменении размера окна
    window.addEventListener('resize', () => {
        // Сбрасываем индекс, если он выходит за пределы допустимого
        if (photoCurrentIndex > photoCards.length - getPhotoVisibleCards()) {
            photoCurrentIndex = photoCards.length - getPhotoVisibleCards();
        }
        updatePhotoSlider();
    });
    
    // Инициализация слайдера
    updatePhotoSlider();
    
    // Автоматическое листание каждые 8 секунд
    let photoAutoSlideInterval;
    
    function startPhotoAutoSlide() {
        photoAutoSlideInterval = setInterval(() => {
            if (photoCurrentIndex < photoCards.length - getPhotoVisibleCards()) {
                photoCurrentIndex++;
            } else {
                photoCurrentIndex = 0;
            }
            updatePhotoSlider();
        }, 8000);
    }
    
    function stopPhotoAutoSlide() {
        clearInterval(photoAutoSlideInterval);
    }
    
    // Запускаем автоматическое листание
    startPhotoAutoSlide();
    
    // Останавливаем при наведении на слайдер
    photoSliderContainer.addEventListener('mouseenter', stopPhotoAutoSlide);
    photoSliderContainer.addEventListener('mouseleave', startPhotoAutoSlide);
    
    // Останавливаем при касании на мобильных
    photoSliderContainer.addEventListener('touchstart', stopPhotoAutoSlide);
    
    // Запускаем анимацию появления для карточек
    photoCards.forEach((card, index) => {
        card.style.animationDelay = `${0.4 + index * 0.2}s`;
    });
    
    // Открытие модального окна при клике на фото-отзыв
    photoCards.forEach(card => {
        card.addEventListener('click', function() {
            // Получаем ссылку на изображение из карточки
            const imageSrc = this.querySelector('.photo-testimonial-card__image img').src;
            
            // Устанавливаем изображение в модальное окно
            photoModalImage.src = imageSrc;
            
            // Отображаем модальное окно
            photoModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
        });
    });
    
    // Закрытие модального окна
    if (photoModalClose) {
        photoModalClose.addEventListener('click', () => {
            photoModal.classList.remove('show');
            document.body.style.overflow = ''; // Возвращаем прокрутку страницы
        });
    }
    
    // Закрытие модального окна при клике вне изображения
    photoModal.addEventListener('click', function(event) {
        if (event.target === photoModal) {
            photoModal.classList.remove('show');
            document.body.style.overflow = ''; // Возвращаем прокрутку страницы
        }
    });
    
    // Закрытие модального окна при нажатии Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && photoModal.classList.contains('show')) {
            photoModal.classList.remove('show');
            document.body.style.overflow = ''; // Возвращаем прокрутку страницы
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.photo-reviews__slider');
    const slides = document.querySelectorAll('.photo-reviews__slide');
    const prevBtn = document.querySelector('.photo-reviews__nav--prev');
    const nextBtn = document.querySelector('.photo-reviews__nav--next');
    const modal = document.getElementById('photoViewerModal');
    const modalImg = modal.querySelector('.photo-viewer-modal__image');
    const closeBtn = modal.querySelector('.photo-viewer-modal__close');
    
    let currentSlide = 0;
    
    // Инициализация слайдера
    function initSlider() {
        slides[currentSlide].style.opacity = '1';
        updateSlider();
    }
    
    // Обновление позиции слайдера
    function updateSlider() {
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    // Переход к следующему слайду
    function nextSlide() {
        slides[currentSlide].style.opacity = '0';
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].style.opacity = '1';
        updateSlider();
    }
    
    // Переход к предыдущему слайду
    function prevSlide() {
        slides[currentSlide].style.opacity = '0';
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        slides[currentSlide].style.opacity = '1';
        updateSlider();
    }
    
    // Открытие модального окна
    function openModal(imgSrc) {
        modalImg.src = imgSrc;
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
    
    // Закрытие модального окна
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    // Обработчики событий
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Открытие модального окна при клике на изображение
    slides.forEach(slide => {
        const img = slide.querySelector('.photo-reviews__img');
        img.addEventListener('click', () => {
            openModal(img.src);
        });
    });
    
    // Закрытие модального окна
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Инициализация слайдера
    initSlider();
});

document.addEventListener('DOMContentLoaded', function() {
    // Функционал для кнопки "Показать еще фото" в галерее студии
    const showMoreGalleryBtn = document.getElementById('showMoreGalleryBtn');
    
    if (showMoreGalleryBtn) {
        showMoreGalleryBtn.addEventListener('click', function() {
            const hiddenItems = document.querySelectorAll('.hidden-gallery-item');
            
            if (hiddenItems.length > 0) {
                // Показываем скрытые элементы с анимацией
                hiddenItems.forEach((item, index) => {
                    // Добавляем задержку для каскадного эффекта
                    setTimeout(() => {
                        item.classList.remove('hidden-gallery-item');
                        item.classList.add('fade-in');
                    }, index * 100); // Задержка для каждого элемента
                });
                
                // Скрываем кнопку после показа всех фотографий
                setTimeout(() => {
                    showMoreGalleryBtn.style.display = 'none';
                }, hiddenItems.length * 100 + 300);
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const imageModalClose = document.getElementById('imageModalClose');
    const prevImageBtn = document.getElementById('prevImageBtn');
    const nextImageBtn = document.getElementById('nextImageBtn');
    const galleryItems = document.querySelectorAll('.studio-gallery__item img');
    
    let currentImageIndex = 0;
    let galleryImages = [];
    
    // Собираем все изображения галереи в массив
    galleryItems.forEach((item, index) => {
        galleryImages.push(item.src);
        
        // Добавляем обработчик клика для открытия модального окна
        item.addEventListener('click', function() {
            openImageModal(index);
        });
    });
    
    // Функция открытия модального окна с изображением
    function openImageModal(index) {
        currentImageIndex = index;
        modalImage.src = galleryImages[index];
        imageModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Запрещаем прокрутку страницы
    }
    
    // Функция закрытия модального окна
    function closeImageModal() {
        imageModal.classList.remove('show');
        document.body.style.overflow = ''; // Возвращаем прокрутку страницы
    }
    
    // Функция для показа предыдущего изображения
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        modalImage.src = galleryImages[currentImageIndex];
    }
    
    // Функция для показа следующего изображения
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        modalImage.src = galleryImages[currentImageIndex];
    }
    
    // Обработчики событий
    if (imageModalClose) {
        imageModalClose.addEventListener('click', closeImageModal);
    }
    
    if (prevImageBtn) {
        prevImageBtn.addEventListener('click', showPrevImage);
    }
    
    if (nextImageBtn) {
        nextImageBtn.addEventListener('click', showNextImage);
    }
    
    // Закрытие модального окна при клике вне изображения
    if (imageModal) {
        imageModal.addEventListener('click', function(e) {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });
    }
    
    // Обработка клавиш клавиатуры
    document.addEventListener('keydown', function(event) {
        if (!imageModal.classList.contains('show')) return;
        
        if (event.key === 'Escape') {
            closeImageModal();
        } else if (event.key === 'ArrowLeft') {
            showPrevImage();
        } else if (event.key === 'ArrowRight') {
            showNextImage();
        }
    });
});
