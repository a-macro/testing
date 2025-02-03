let formValidator;
    
function addErr(inp) {
    let parent = inp.closest('.input-wrap');
    if (!parent) {
        parent = inp.closest('.checkbox');
    }
    if(parent) {
        parent.classList.add('_err');
    }
}

function removeErr(inp) {
    let parent = inp.closest('.input-wrap');
    if (!parent) {
        parent = inp.closest('.checkbox');
    }
    if(parent) {
        parent.classList.remove('_err');
    }
}

function scrollToErr(parent) {
    /*let firstErr = parent.querySelector("._err");
    if(firstErr) {
        firstErr.scrollIntoView({ block: "center", behavior: "auto" });
    }*/
}
    
function setSubmitVal() {
    let forms = document.querySelectorAll('.form-val');
    if (forms.length) {
        forms.forEach((form) => {
            form.onsubmit = (e) => {
                let check = formValidator(form);
                let errs = form.querySelectorAll('._err');
                if (errs.length > 0 || check > 0) {
                    e.preventDefault();
                    if (BX) {
                        BX.closeWait();
                    }
                    scrollToErr(form);
                    return false;
                }
            };
        });
    }

    let mailFormat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    function checkFormat(inp, format) {
        let result = format.test(inp.value);
        return result;
    }


    let inpsReq = document.querySelectorAll('._req');
    if (inpsReq.length) {
        inpsReq.forEach((inp) => {
            inp.oninput = (e) => {
                setTimeout(() => {
                    inpValidator(inp);
                }, 10);
            };
        });
    }

    function inpValidator(inp) {
        let attr = inp.getAttribute('data-type');
        let errs = 0;
        if(attr === "option") {
            let parent = inp.closest("._select");
            let allChecks = parent.querySelectorAll("input");
            if(allChecks.length) {
                allChecks.forEach((check) => {
                    if(check.checked) {
                        parent.classList.remove("_err");
                    } else {
                        parent.classList.add("_err");
                    }
                });
            }
            if(parent.querySelector("._err")) {
                parent.classList.add("_err");
                errs++;
            } else {
                parent.classList.remove("_err");
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
            if (inp.value.includes('_') || !inp.value || !inp.classList.contains("_success")) {
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

    formValidator = function(form) {
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
    }
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
