import {closeModal} from "./modal";
import {openModal} from "./modal";
import {postDate} from "../services/services";

function forms (formSelector, modalTimerId){
    //forms

    const forms = document.querySelectorAll(formSelector);

    const message = { //хранилище сообщений, которые мы хотим показать пользователю
        loading: '../img/form/spinner.svg',
        success: 'Мы скоро с вами свяжемся!',
        fail: 'что-то пошло не так...'
    }

    forms.forEach( item => {
        bindPostDate(item);
    });

    function bindPostDate (form) { //обработчик событий при отправке
        form.addEventListener('submit', (e) => {
            e.preventDefault(); //в запросах должна идти, чтобы не было казусов (отмена стандартного поведения браузера)

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto; 
            `;
            form.insertAdjacentElement('afterend', statusMessage); //добавляем к форме сообщение

            // const object = {};
            // formData.forEach(function(value, key){
            //     object[key] = value;
            // });

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postDate('http://localhost:3000/requests', json )
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                showThanksModal(message.fail);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal (message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add ('hide');
        openModal('.modal',modalTimerId );

        const thanksModal = document.createElement('div');
        thanksModal.classList.add ('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                 <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div> 
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(()=> {
            thanksModal.remove();
            prevModalDialog.classList.add ('show');
            prevModalDialog.classList.remove ('hide');
            closeModal('.modal');
        },4000);
    }
}

export default forms;
