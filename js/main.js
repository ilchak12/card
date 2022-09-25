// Variables
const body = document.body;

let request;
let mouse = {x: 0, y: 0};

let cx = window.innerWidth / 2;
let cy = window.innerHeight / 2;

// Get cx and cy on resize
window.addEventListener('resize',function() {
    cx = window.innerWidth / 2;
    cy = window.innerHeight / 2;
});

// Start animation
body.addEventListener('mousemove', function (e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;

    request = requestAnimationFrame(update);
})

// Update animation function
function update() {
    dx = mouse.x - cx;
    dy = mouse.y - cy;

    tiltx = (dy / cy);
    tilty = - (dx / cx);
    radius = Math.sqrt(Math.pow(tiltx,2) + Math.pow(tilty,2));
    degree = (radius * 12);
    gsap.to(".card", 1,
        {
            transform: 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg)'
        }
    );
}

// Card form validation
const cardForm = document.getElementsByClassName('card__form')[0];
const card = document.getElementsByClassName('card')[0];

const numberInput = document.getElementsByClassName('card__input_number')[0];
const validMonthInput = document.getElementsByClassName('card__input_valid-month')[0];
const validYearInput = document.getElementsByClassName('card__input_valid-year')[0];
const cvvInput = document.getElementsByClassName('card__input_cvv')[0];
const holderInput = document.getElementsByClassName('card__input_cardholder')[0];

numberInput.addEventListener('input', function() {
    if (this.value.length > 0) this.value = this.value.replace(/(\d{4})(?!\s|$)/gm, `$1 `).match(/(?:\d{4} ?){0,3}(?:\d{0,4})?/);

    jumpToInput(this, validMonthInput);
})

validMonthInput.addEventListener('input', function () {
    if (this.value.length > 0) this.value = this.value.replace(/[^0-9]/g, ``);

    jumpToInput(this, validYearInput);
})

validYearInput.addEventListener('input', function () {
    if (this.value.length > 0) this.value = this.value.replace(/[^0-9]/g, ``);

    jumpToInput(this, cvvInput);
})

cvvInput.addEventListener('input', function () {
    if (this.value.length > 0) this.value = this.value.replace(/[^0-9]/g, ``);

    jumpToInput(this, holderInput);
})

holderInput.addEventListener('input', function () {
    if (this.value.length > 0) this.value = this.value.replace(/[^a-zA-Zа-яА-Я ]/g, ``);
})


function jumpToInput(current, next) {
    current.value.length === current.maxLength ? next.focus() : false;
}

function numberValidation(inputDOM, reqLength, inputNameString, objProperty) {
    if (inputDOM.value == null || inputDOM.value == '') {
        console.log(`${inputNameString} can't be empty`);

        inputDOM.classList.add('error');
        setTimeout(() => {
            inputDOM.classList.remove('error');
        }, 3000)
    } else if (inputDOM.value.length < inputDOM.maxLength) {
        console.log(`${inputNameString} must be ${reqLength} character('s) long`);

        inputDOM.classList.add('error');
        setTimeout(() => {
            inputDOM.classList.remove('error');
        }, 3000)
    } else {
        return objProperty = inputDOM.value;
    }
}

cardForm.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        let cardInfoObj = {
            cardNumber: 0,
            month: 0,
            year: 0,
            cvv: 0,
            cardHolder: ''
        }, error_key = false;

        numberValidation(numberInput, 16, 'Card', cardInfoObj.cardNumber);
        numberValidation(validMonthInput, 2, 'Month', cardInfoObj.month);
        numberValidation(validYearInput, 2, 'Year', cardInfoObj.year);
        numberValidation(cvvInput, 3, 'CVV', cardInfoObj.cvv);
        if(holderInput.value == null || holderInput.value == '') {
            console.log("Card holder name can't be empty");

            holderInput.classList.add('error');
            setTimeout(() => {
                holderInput.classList.remove('error');
            }, 3000)
        } else if (holderInput.value.length < 1) {
            console.log('Card holder name must be at least 1 character long');

            holderInput.classList.add('error');
            setTimeout(() => {
                holderInput.classList.remove('error');
            }, 3000)
        } else {
            cardInfoObj.cardHolder = holderInput.value;
        }

        for (let key in cardInfoObj) {
            if (cardInfoObj.hasOwnProperty(key) && !cardInfoObj[key]) {
                error_key = true;
                alert('Заповність правильно поля у карті!');
                card.classList.add('error');
                setTimeout(() => {
                    card.classList.remove('error');
                }, 700)

                break;
            }
        }

        if (!error_key) {
            console.log(cardInfoObj);
        }
    }
})