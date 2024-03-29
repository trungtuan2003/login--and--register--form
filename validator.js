function Validator(options) {
    const selectorRules = [];
    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        let errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;

        // Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        // Lặp qua từng rules và kiểm tra
        // Nếu có lỗi thì dừng kiểm tra
        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add("Invalid");
        } else {
            removeInvalid(inputElement, errorElement);
        }
    }

    // remove invalid
    function removeInvalid(inputElement, errorElement) {
        errorElement.innerText = "";
        inputElement.parentElement.classList.remove("Invalid");
    }

    // Lấy element của form cần validate 
    var formElement = document.querySelector(options.form);
    if (formElement) {
        options.rules.forEach((rule) => {
            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else { 
                selectorRules[rule.selector] = [rule.test];
            }


            var inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                // Kiểm tra giá trị khi nhấn chuột ra khỏi ô input
                inputElement.onblur = () => {
                    validate(inputElement, rule);
                }
                
                // Kiểm tra khi người dùng nhập vào ô input
                inputElement.oninput = () => {
                    let errorElement = inputElement.parentElement.querySelector(options.errorSelector);

                    removeInvalid(inputElement, errorElement);
                }
            }
        });
    }

}





// Định nghĩa rules
// Nguyên tắc của rules: 
// 1. Khi gặp lỗi => trả message lỗi
// 2. Khi hợp lệ => Không trả ra gì cả (undefined)
Validator.isRequired = (selector, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value.trim() ? undefined : message || "Vui lòng nhập trường này";
        }
    }
}

Validator.isEmail = (selector, message) => {
    return {
        selector: selector,
        test: (value) => {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined  : message || "Nhập email";
        }
    }
}

Validator.isConfirmed = (selector, getConfirmPassword, message) => {
    return {
        selector: selector,
        test: (value) => {  
            return value === getConfirmPassword() ? undefined :  message || "Nhap dung gia tri";
        }
    }
}