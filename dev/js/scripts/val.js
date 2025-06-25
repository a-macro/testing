let formValidator;

function addErr(inp) {
    let parent = inp.closest('.input-wrap');
    if (!parent) {
        parent = inp.closest('.checkbox');
    }
    if (parent) {
        parent.classList.add('_err');
    } else {
        inp.classList.add('_err');
    }
}

function removeErr(inp) {
    let parent = inp.closest('.input-wrap');
    if (!parent) {
        parent = inp.closest('.checkbox');
    }
    if (!parent) {
        parent = inp.closest('.js-select__wrap');
    }
    if (parent) {
        parent.classList.remove('_err');
    } else {
        inp.classList.remove('_err');
    }
}

function scrollToErr(parent) {
    let firstErr = parent.querySelector('._err');
    if (firstErr) {
        firstErr.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
}

function setSubmitVal() {
    let forms = document.querySelectorAll('.form-val');
    if (forms.length) {
        let inputFileUploads = document.querySelectorAll('.input-file input');
        if (inputFileUploads) {
            inputFileUploads.forEach(function (inputFileUpload) {
                let inputFile = inputFileUpload.closest('.input-file');
                let emptyText = inputFile.querySelector('.empty-text');
                if (inputFile.classList.contains('multi')) {
                    let amount = inputFile.dataset.amount;
                    inputFileUpload.onchange = function () {
                        let newEl = document.createElement('div');
                        newEl.classList.add('file');
                        emptyText.appendChild(newEl);
                        let inp = document.createElement('input');
                        inp.type = 'file';
                        inp.name = inputFileUpload.name;
                        inp.files = inputFileUpload.files;
                        newEl.appendChild(inp);
                        let text = document.createElement('span');
                        text.classList.add('inp-text');
                        text.innerHTML = this.files[0].name;
                        newEl.appendChild(text);
                        let del = document.createElement('span');
                        del.className = 'empty-text__btn-del';
                        del.innerText = '';
                        newEl.appendChild(del);
                        del.onclick = () => {
                            this.value = '';
                            emptyText.innerHTML = '';
                            del.className = '';
                            emptyText.classList.remove('filled');
                        };
                        this.value = '';
                    };
                } else {
                    inputFileUpload.onchange = function () {
                        emptyText.innerText = this.files[0].name;
                        emptyText.classList.add('filled');
                        let del = document.createElement('span');
                        del.className = 'empty-text__btn-del';
                        del.innerText = '';
                        emptyText.appendChild(del);
                        inputFile.classList.remove('_err');
                        del.onclick = () => {
                            this.value = '';
                            emptyText.innerHTML = '';
                            del.className = '';
                            emptyText.classList.remove('filled');
                        };
                    };
                }
            });
        }
        forms.forEach((form) => {
            form.addEventListener('submit', (e) => {
                let files = form.querySelectorAll('.input-file');
                if (files.length) {
                    files.forEach((el) => {
                        let wrap = el.closest('.input-wrap');
                        if (el.classList.contains('multi')) {
                            let amount = el.dataset.amount;
                            let files = el.querySelectorAll('.file');
                            let text = wrap.querySelector('.multi-amount');
                            if (files.length < +amount) {
                                el.classList.add('_err');
                                text.classList.add('red');
                            } else {
                                el.classList.remove('_err');
                                text.classList.remove('red');
                            }
                        } else {
                            let inp = el.querySelector('input');
                            if (inp.files.length === 0) {
                                el.classList.add('_err');
                            } else {
                                el.classList.remove('_err');
                            }
                        }
                    });
                }
                let check = formValidator(form);
                let errs = form.querySelectorAll('._err');
                console.log(errs);
                if (errs.length > 0 || check > 0) {
                    e.preventDefault();
                    scrollToErr(form);
                    return false;
                } else {
                    e.preventDefault();
                    openModalFunc(document.querySelector('.modal'));
                }
            });
        });
    }

    let mailFormat =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    function checkFormat(inp, format) {
        let result = format.test(inp.value);
        return result;
    }
    let timer;

    function debounce(inp) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            console.log(1);
            inpValidator(inp);
        }, 1000);
    }
    let inpsReq = document.querySelectorAll('._req');
    if (inpsReq.length) {
        inpsReq.forEach((inp) => {
            inp.oninput = (e) => {
                debounce(inp);
            };
        });
    }

    function inpValidator(inp) {
        let attr = inp.getAttribute('data-type');
        let errs = 0;
        if (attr === 'option') {
            let parent = inp.closest('._select');
            let allChecks = parent.querySelectorAll('input');
            if (allChecks.length) {
                allChecks.forEach((check) => {
                    if (check.checked) {
                        parent.classList.remove('_err');
                    } else {
                        parent.classList.add('_err');
                    }
                });
            }
            if (parent.querySelector('._err')) {
                parent.classList.add('_err');
                errs++;
            } else {
                parent.classList.remove('_err');
            }
        } else if (inp.classList.contains('itc-select__toggle')) {
            let attr = inp.getAttribute('data-index');
            if (attr == -1) {
                addErr(inp);
                errs++;
            } else {
                removeErr(inp);
            }
        } else if (attr && attr == 'email') {
            let result = checkFormat(inp, mailFormat);
            if (!result) {
                addErr(inp);
                errs++;
            } else {
                removeErr(inp);
            }
        } else if (attr && attr == 'tel') {
            if (inp.value.includes('_') || !inp.value || !inp.classList.contains('_success')) {
                addErr(inp);
                errs++;
            } else {
                removeErr(inp);
            }
        } else if (inp.type == 'checkbox') {
            if (!inp.checked) {
                addErr(inp);
                errs++;
            } else {
                removeErr(inp);
            }
        } else if (inp.classList.contains('js-select')) {
            if (!inp.value || inp.value === 'default') {
                addErr(inp);
                errs++;
            } else {
                removeErr(inp);
            }
        } else {
            if (!inp.value) {
                addErr(inp);
                errs++;
            } else {
                removeErr(inp);
            }
        }
        return errs;
    }

    formValidator = function (form) {
        let inps = form.querySelectorAll('._req');
        let errs = 0;
        if (inps.length) {
            inps.forEach((inp) => {
                let result = inpValidator(inp);
                if (result) {
                    errs++;
                }
            });
        }
        return errs;
    };
}
document.addEventListener('DOMContentLoaded', function () {
    setSubmitVal();
});

function checkAltern(parent) {
    let inps = parent.querySelectorAll('input');
    let checked = false;
    let errs = 0;
    if (inps.length) {
        inps.forEach((inp) => {
            if (inp.checked) {
                checked = true;
            }
        });
    }
    if (!checked) {
        errs++;
        parent.classList.add('_err');
    } else {
        parent.classList.remove('_err');
    }
    return errs;
}
