// Контроллер для управления модальными окнами
const ModalController = {
    // Флаг состояния формы (была ли успешно отправлена)
    formSubmitted: false,
    
    // Функция инициализации обработчиков
    init: function() {
        // Добавляем обработчики для всех кнопок, открывающих модальные окна
        this.addModalTriggerHandlers();
        
        // Добавляем обработчики закрытия для модальных окон
        this.addCloseHandlers();
    },
    
    // Обработчики для кнопок, открывающих модальные окна
    addModalTriggerHandlers: function() {
        // Модальное окно консультации
        const consultationBtns = document.querySelectorAll('.consultation-btn, .intro__btn, .consultation-page__btn');
        consultationBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', this.handleConsultationModalOpen.bind(this));
            }
        });
        
        // Модальное окно лулла-бай
        const lullabyBtns = document.querySelectorAll('.lullaby-btn, .lullaby-page__btn');
        lullabyBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', this.handleLullabyModalOpen.bind(this));
            }
        });
        
        // Другие кнопки открытия модальных окон могут быть добавлены аналогично
    },
    
    // Обработка открытия модального окна консультации
    handleConsultationModalOpen: function(event) {
        // Предотвращаем стандартное поведение ссылки
        event.preventDefault();
        
        // Если форма не была отправлена, открываем обычное модальное окно
        if (!this.formSubmitted) {
            const modal = document.getElementById('consultationModal');
            this.openModal(modal);
        } else {
            // Если форма была отправлена, сбрасываем флаг
            this.formSubmitted = false;
            
            // Проверяем, существует ли форма и сбрасываем её
            const form = document.getElementById('consultationForm');
            if (form) {
                form.reset();
            }
            
            // Открываем модальное окно для консультации
            const modal = document.getElementById('consultationModal');
            this.openModal(modal);
        }
    },
    
    // Обработка открытия модального окна лулла-бай
    handleLullabyModalOpen: function(event) {
        // Предотвращаем стандартное поведение ссылки
        if (event) {
            event.preventDefault();
        }
        
        // Получаем название услуги, если оно передано через data-атрибут
        let serviceTitle = event && event.currentTarget ? event.currentTarget.getAttribute('data-service') : null;
        
        // Если форма не была отправлена, открываем обычное модальное окно
        if (!this.formSubmitted) {
            const modal = document.getElementById('lullabyModal');
            
            // Устанавливаем название услуги, если оно передано
            if (serviceTitle && modal) {
                const serviceNameElement = document.getElementById('serviceName');
                const serviceTypeInput = document.getElementById('serviceType');
                
                if (serviceNameElement) {
                    serviceNameElement.textContent = serviceTitle;
                }
                
                if (serviceTypeInput) {
                    serviceTypeInput.value = serviceTitle;
                }
            }
            
            this.openModal(modal);
        } else {
            // Если форма была отправлена, сбрасываем флаг
            this.formSubmitted = false;
            
            // Проверяем, существует ли форма и сбрасываем её
            const form = document.getElementById('lullabyForm');
            if (form) {
                form.reset();
            }
            
            // Открываем модальное окно для лулла-бай
            const modal = document.getElementById('lullabyModal');
            
            // Устанавливаем название услуги, если оно передано
            if (serviceTitle && modal) {
                const serviceNameElement = document.getElementById('serviceName');
                const serviceTypeInput = document.getElementById('serviceType');
                
                if (serviceNameElement) {
                    serviceNameElement.textContent = serviceTitle;
                }
                
                if (serviceTypeInput) {
                    serviceTypeInput.value = serviceTitle;
                }
            }
            
            this.openModal(modal);
        }
    },
    
    // Функция открытия модального окна
    openModal: function(modal) {
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
        }
    },
    
    // Функция закрытия модального окна
    closeModal: function(modal) {
        if (modal) {
            modal.classList.add('closing');
            setTimeout(() => {
                modal.classList.remove('show', 'closing');
                document.body.style.overflow = ''; // Возвращаем прокрутку страницы
            }, 300); // Время должно совпадать с длительностью анимации в CSS
        }
    },
    
    // Добавление обработчиков закрытия модальных окон
    addCloseHandlers: function() {
        // Обработчики для кнопок закрытия
        const closeButtons = document.querySelectorAll('.modal__close');
        closeButtons.forEach(button => {
            if (button) {
                button.addEventListener('click', (event) => {
                    const modal = event.target.closest('.modal');
                    this.closeModal(modal);
                });
            }
        });
        
        // Обработчики для оверлеев модальных окон
        const modalOverlays = document.querySelectorAll('.modal__overlay');
        modalOverlays.forEach(overlay => {
            if (overlay) {
                overlay.addEventListener('click', (event) => {
                    const modal = event.target.closest('.modal');
                    this.closeModal(modal);
                });
            }
        });
        
        // Обработчик для кнопки закрытия модального окна благодарности
        const successCloseBtn = document.getElementById('successCloseBtn');
        if (successCloseBtn) {
            successCloseBtn.addEventListener('click', () => {
                const modal = document.getElementById('successModal');
                this.closeModal(modal);
            });
        }
    },
    
    // Метод для установки флага отправленной формы
    setFormSubmitted: function(value) {
        this.formSubmitted = value;
    }
};

// Инициализация контроллера при загрузке документа
document.addEventListener('DOMContentLoaded', function() {
    ModalController.init();
    
    // Делаем контроллер доступным глобально
    window.ModalController = ModalController;
});
