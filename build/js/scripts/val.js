"use strict";

var formValidator;
function addErr(inp) {
  var parent = inp.closest('.input-wrap');
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
  var parent = inp.closest('.input-wrap');
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
  var firstErr = parent.querySelector('._err');
  if (firstErr) {
    firstErr.scrollIntoView({
      block: 'center',
      behavior: 'auto'
    });
  }
}
function setSubmitVal() {
  var forms = document.querySelectorAll('.form-val');
  if (forms.length) {
    var inputFileUploads = document.querySelectorAll('.input-file input');
    if (inputFileUploads) {
      inputFileUploads.forEach(function (inputFileUpload) {
        var inputFile = inputFileUpload.closest('.input-file');
        var emptyText = inputFile.querySelector('.empty-text');
        if (inputFile.classList.contains('multi')) {
          var amount = inputFile.dataset.amount;
          inputFileUpload.onchange = function () {
            var _this = this;
            var newEl = document.createElement('div');
            newEl.classList.add('file');
            emptyText.appendChild(newEl);
            var inp = document.createElement('input');
            inp.type = 'file';
            inp.name = inputFileUpload.name;
            inp.files = inputFileUpload.files;
            newEl.appendChild(inp);
            var text = document.createElement('span');
            text.classList.add('inp-text');
            text.innerHTML = this.files[0].name;
            newEl.appendChild(text);
            var del = document.createElement('span');
            del.className = 'empty-text__btn-del';
            del.innerText = '';
            newEl.appendChild(del);
            del.onclick = function () {
              _this.value = '';
              emptyText.innerHTML = '';
              del.className = '';
              emptyText.classList.remove('filled');
            };
            this.value = '';
          };
        } else {
          inputFileUpload.onchange = function () {
            var _this2 = this;
            emptyText.innerText = this.files[0].name;
            emptyText.classList.add('filled');
            var del = document.createElement('span');
            del.className = 'empty-text__btn-del';
            del.innerText = '';
            emptyText.appendChild(del);
            inputFile.classList.remove('_err');
            del.onclick = function () {
              _this2.value = '';
              emptyText.innerHTML = '';
              del.className = '';
              emptyText.classList.remove('filled');
            };
          };
        }
      });
    }
    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        var files = form.querySelectorAll('.input-file');
        if (files.length) {
          files.forEach(function (el) {
            var wrap = el.closest('.input-wrap');
            if (el.classList.contains('multi')) {
              var amount = el.dataset.amount;
              var _files = el.querySelectorAll('.file');
              var text = wrap.querySelector('.multi-amount');
              if (_files.length < +amount) {
                el.classList.add('_err');
                text.classList.add('red');
              } else {
                el.classList.remove('_err');
                text.classList.remove('red');
              }
            } else {
              var inp = el.querySelector('input');
              if (inp.files.length === 0) {
                el.classList.add('_err');
              } else {
                el.classList.remove('_err');
              }
            }
          });
        }
        var check = formValidator(form);
        var errs = form.querySelectorAll('._err');
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
  var mailFormat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  function checkFormat(inp, format) {
    var result = format.test(inp.value);
    return result;
  }
  var timer;
  function debounce(inp) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      console.log(1);
      inpValidator(inp);
    }, 1000);
  }
  var inpsReq = document.querySelectorAll('._req');
  if (inpsReq.length) {
    inpsReq.forEach(function (inp) {
      inp.oninput = function (e) {
        debounce(inp);
      };
    });
  }
  function inpValidator(inp) {
    var attr = inp.getAttribute('data-type');
    var errs = 0;
    if (attr === 'option') {
      var parent = inp.closest('._select');
      var allChecks = parent.querySelectorAll('input');
      if (allChecks.length) {
        allChecks.forEach(function (check) {
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
      var _attr = inp.getAttribute('data-index');
      if (_attr == -1) {
        addErr(inp);
        errs++;
      } else {
        removeErr(inp);
      }
    } else if (attr && attr == 'email') {
      var result = checkFormat(inp, mailFormat);
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
  formValidator = function formValidator(form) {
    var inps = form.querySelectorAll('._req');
    var errs = 0;
    if (inps.length) {
      inps.forEach(function (inp) {
        var result = inpValidator(inp);
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
  var inps = parent.querySelectorAll('input');
  var checked = false;
  var errs = 0;
  if (inps.length) {
    inps.forEach(function (inp) {
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