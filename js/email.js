// Функция для отправки данных формы через EmailJS
function sendEmail(formId, templateId) {
    console.log(`Инициализация отправки для формы: ${formId} с шаблоном: ${templateId}`);
    // Получаем форму
    const form = document.getElementById(formId);
    
    if (form) {
        console.log(`Форма ${formId} найдена, добавляем обработчик события`);
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log(`Форма ${formId} отправлена, начинаем обработку...`);
            
            // Показываем индикатор загрузки
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            // submitBtn.textContent = 'Отправка...'; // Убираем изменение текста
            submitBtn.classList.add('btn-loading'); // Добавляем класс для анимации загрузки
            
            // Собираем данные формы
            const formData = new FormData(form);
            const data = {};
            
            // Добавляем приемника электронной почты
            data['to_email'] = 'bashilkina82@mail.ru';
            
            // Определяем тип формы
            const isLullabyForm = formId === 'lullabyForm';
            const isStudioForm = formId === 'studioForm';
            
            if (isLullabyForm) {
                // Для формы добаюкивания берем тип из скрытого поля
                const serviceType = form.querySelector('#serviceType').value;
                data['serviceName'] = serviceType;
                data['servicePrice'] = 'По договоренности';
            } else if (isStudioForm) {
                // Для формы аренды студии
                data['serviceName'] = 'Аренда студии';
                data['servicePrice'] = 'По договоренности';
            } else {
                // Получаем значение типа консультации из скрытого поля
                const consultationType = form.querySelector('#consultationType').value;
                let servicePrice = '';
                let serviceName = '';

                switch(consultationType) {
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

                // Добавляем данные услуги в объект
                data['serviceName'] = serviceName;
                data['servicePrice'] = servicePrice;
            }
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            console.log('Собранные данные формы:', data);
            console.log('ID сервиса EmailJS:', 'service_5glro6g');
            console.log('ID шаблона EmailJS:', templateId);
            
            // Отправляем данные через EmailJS
            emailjs.send('service_5glro6g', templateId, data)
                .then(function(response) {
                    console.log('Успех! Полный ответ:', response);
                    console.log('Статус:', response.status);
                    console.log('Текст ответа:', response.text);
                    
                    // Не очищаем форму после отправки, чтобы сохранить данные
                    // form.reset(); - закомментировано, чтобы не стирать данные
                    
                    // Устанавливаем флаг, что форма была отправлена (если модальный контроллер доступен)
                    if (window.ModalController) {
                        window.ModalController.setFormSubmitted(true);
                    }
                    
                    // Проверяем, является ли форма consultationForm
                    if (formId === 'consultationForm') {
                        // Закрываем текущее модальное окно с анимацией
                        const currentModal = form.closest('.modal');
                        
                        if (currentModal) {
                            // Добавляем класс для анимации закрытия
                            currentModal.classList.add('closing');
                            
                            // Через небольшой таймаут скрываем модальное окно
                            setTimeout(() => {
                                currentModal.classList.remove('show');
                                currentModal.classList.remove('closing');
                                
                                // Показываем модальное окно благодарности
                                const successModal = document.getElementById('successModal');
                                if (successModal) {
                                    // Восстанавливаем кнопку отправки формы
                                    submitBtn.disabled = false;
                                    // submitBtn.textContent = originalBtnText; // Убираем восстановление текста
                                    submitBtn.classList.remove('btn-loading'); // Убираем класс анимации
                                    
                                    // Показываем модальное окно с благодарностью
                                    successModal.classList.add('show');
                                    
                                    // Добавляем обработчики событий для закрытия
                                    const closeModal = () => {
                                        successModal.classList.add('closing');
                                        setTimeout(() => {
                                            successModal.classList.remove('show');
                                            successModal.classList.remove('closing');
                                        }, 300);
                                    };
                                    
                                    // Находим все элементы для закрытия модального окна
                                    const closeBtn = successModal.querySelector('.modal__close');
                                    const okBtn = successModal.querySelector('#successCloseBtn');
                                    const overlay = successModal.querySelector('.modal__overlay');
                                    
                                    // Добавляем обработчики для закрытия
                                    if (closeBtn) {
                                        closeBtn.onclick = closeModal;
                                    }
                                    
                                    if (okBtn) {
                                        okBtn.onclick = closeModal;
                                    }
                                    
                                    if (overlay) {
                                        overlay.onclick = closeModal;
                                    }
                                }
                            }, 300);
                        }
                    } else {
                        // Скрываем элементы формы
                        const formGroups = form.querySelectorAll('.form-group');
                        formGroups.forEach(group => group.style.display = 'none');
                        submitBtn.style.display = 'none';
                        
                        // Показываем сообщение об успешной отправке
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
                        const modal = form.closest('.modal');
                        setTimeout(function() {
                            if (modal && typeof closeModalWithAnimation === 'function') {
                                closeModalWithAnimation(modal);
                                
                                // Восстанавливаем форму после закрытия
                                setTimeout(function() {
                                    formGroups.forEach(group => group.style.display = 'block');
                                    submitBtn.style.display = 'block';
                                    submitBtn.disabled = false;
                                    // submitBtn.textContent = originalBtnText; // Убираем восстановление текста
                                    submitBtn.classList.remove('btn-loading'); // Убираем класс анимации
                                    if (successMessage.parentNode === form) {
                                        form.removeChild(successMessage);
                                    }
                                }, 500);
                            }
                        }, 3000);
                    }
                })
                .catch(function(error) {
                    console.error('Ошибка при отправке:', error);
                    console.error('Полная информация об ошибке:', JSON.stringify(error));
                    alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
                    
                    // Восстанавливаем кнопку
                    submitBtn.disabled = false;
                    // submitBtn.textContent = originalBtnText; // Убираем восстановление текста
                    submitBtn.classList.remove('btn-loading'); // Убираем класс анимации
                    
                });
        });
    } else {
        console.error(`Форма с ID ${formId} не найдена!`);
    }
}

// Инициализация EmailJS с вашим User ID
(function() {
    console.log('Начинаем инициализацию EmailJS...');
    // Инициализируем EmailJS 
    emailjs.init('6Mbx3qLFw3E3Iw8PM'); // Публичный ключ
    console.log('EmailJS инициализирован с публичным ключом: 6Mbx3qLFw3E3Iw8PM');
})();

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded событие запущено, инициализируем обработчики форм');
    // Инициализация форм для отправки через EmailJS
    sendEmail('consultationForm', 'template_ofi7cdj');
    sendEmail('studioForm', 'template_ofi7cdj');
    sendEmail('lullabyForm', 'template_ofi7cdj'); // Добавляем обработку формы добаюкивания
});
