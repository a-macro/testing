"use strict";

var bodyTag, winH, winW, userAgent, Mozila, scrollBar, initJsSelect, openModalFunc, closeModal;
window.addEventListener('DOMContentLoaded', function () {
  bodyTag = document.querySelector('body');
  winH = window.innerHeight;
  winW = window.innerWidth;
  scrollBar = scrollLock.getPageScrollBarWidth();
  userAgent = navigator.userAgent.toLowerCase();
  Mozila = /firefox/.test(userAgent);
  if (Mozila) {
    document.documentElement.classList.add('moz');
  }
  var header = document.querySelector('.header');
  var headerH;
  if (header) {
    setTimeout(function () {
      headerH = header.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--hH', headerH + 'px');
    }, 100);
  }
  document.documentElement.style.setProperty('--h', winH + 'px');
  document.documentElement.style.setProperty('--w', winW + 'px');
  document.documentElement.style.setProperty('--scr', scrollBar + 'px');
  var burger = document.querySelector('.header__burger');
  if (burger) {
    var nav = document.querySelector('.header__nav');
    burger.onclick = function (e) {
      e.preventDefault();
      if (bodyTag.classList.contains('show-burger')) {
        bodyTag.classList.remove('show-burger');
        setTimeout(function () {
          nav.style.display = 'none';
          scrollLock.enablePageScroll();
        }, 300);
      } else {
        scrollLock.disablePageScroll();
        nav.style.display = 'flex';
        setTimeout(function () {
          bodyTag.classList.add('show-burger');
        }, 100);
      }
    };
  }
  var anchors = document.querySelectorAll('[data-anchor]');
  if (anchors.length) {
    anchors.forEach(function (anchor) {
      anchor.onclick = function (e) {
        e.preventDefault();
        var attr = anchor.dataset.anchor;
        var related = document.querySelector("#".concat(attr));
        if (related) {
          console.log(top);
          var top = related.getBoundingClientRect().top + window.scrollY; // ;
          console.log(top);
          var calcTop = top - headerH > 0 ? top - headerH : 0;
          window.scrollTo({
            top: calcTop,
            behavior: 'smooth'
          });
        }
      };
    });
  }
  initJsSelect = function initJsSelect() {
    for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }
    var jsSelect = document.querySelectorAll('.js-select');
    var activeSelect = document.querySelector('.dropped .custom-select');
    function drawSelect(select) {
      var isSearch = select.classList.contains('js-search-select');
      var searchInp;
      var selectParent = select.parentNode;
      var prevCustomSelect = selectParent.querySelector('.custom-select');
      if (prevCustomSelect) {
        prevCustomSelect.remove();
      }
      if (isSearch) {
        searchInp = selectParent.querySelector('.drop-search__inp input');
      }
      var newSelect = document.createElement('div');
      newSelect.className = 'custom-select';
      selectParent.appendChild(newSelect);
      var trigger = document.createElement('div');
      trigger.className = 'custom-trigger';
      newSelect.appendChild(trigger);
      var triggerSpanText = document.createElement('span');
      trigger.appendChild(triggerSpanText);
      var optionsWrapOuter = document.createElement('div');
      optionsWrapOuter.className = 'custom-select__wrap_outer';
      newSelect.appendChild(optionsWrapOuter);
      var optionsWrap = document.createElement('div');
      optionsWrap.className = 'custom-select__wrap';
      optionsWrapOuter.appendChild(optionsWrap);
      var options = select.querySelectorAll('option');
      options.forEach(function (option, i) {
        var val = option.value;
        var flag = option.dataset.flag;
        var text = option.textContent;
        var checked = option.selected;
        var newOption = document.createElement('div');
        newOption.className = 'custom-option';
        if (option.hidden) {
          newOption.classList.add('hidden');
        }
        newOption.setAttribute('data-value', val);
        newOption.innerText = text;
        var newImg;
        if (flag) {
          newImg = document.createElement('img');
          newImg.src = flag;
          newOption.prepend(newImg);
        }
        if (checked) {
          newOption.classList.add('checked');
          triggerSpanText.innerText = text;
          if (option.hidden) {
            trigger.classList.add('default');
          } else {
            if (searchInp) {
              searchInp.value = text;
            }
            selectParent.classList.add('was-checked');
          }
          if (newImg) {
            var imgCopy = newImg.cloneNode(true);
            trigger.prepend(imgCopy);
          }
        }
        optionsWrap.appendChild(newOption);
        newOption.addEventListener('click', function (e) {
          if (!newOption.classList.contains('checked')) {
            var prevSelected = newSelect.querySelector('.checked');
            if (prevSelected) {
              prevSelected.classList.remove('checked');
              var prevVal = prevSelected.getAttribute('data-value');
              var prevOption = selectParent.querySelector("option[value='".concat(prevVal, "']"));
              if (prevOption) {
                prevOption.removeAttribute('selected');
              }
            }
            selectParent.classList.add('was-checked');
            option.setAttribute('selected', 'selected');
            newOption.classList.add('checked');
            newSelect.classList.remove('show');
            selectParent.classList.remove('dropped');
            if (selectParent.closest('.drop')) {
              selectParent.closest('.drop').classList.remove('dropped');
            }
            trigger.innerHTML = newOption.innerHTML;
            if (searchInp) {
              searchInp.value = newOption.innerText;
            }
            trigger.classList.remove('default');
            //select.value = newOption.innerHTML;
            select.selectedIndex = i;
            select.dispatchEvent(new Event('change', {
              bubbles: true
            }));
            select.classList.remove('_err');
          } else {
            newSelect.classList.remove('show');
            selectParent.classList.remove('dropped');
            if (selectParent.closest('.drop')) {
              selectParent.closest('.drop').classList.remove('dropped');
            }
          }
        });
      });
      trigger.onclick = function (e) {
        e.preventDefault();
        activeSelect = document.querySelector('.show.custom-select');
        newSelect.classList.toggle('show');
        selectParent.classList.toggle('dropped');
        if (selectParent.closest('.drop')) {
          selectParent.closest('.drop').classList.toggle('dropped');
        }
        if (activeSelect && activeSelect != newSelect) {
          activeSelect.classList.remove('show');
          activeSelect.parentNode.classList.remove('dropped');
          activeSelect = null;
          if (activeSelect.closest('.drop')) {
            activeSelect.closest('.drop').classList.remove('dropped');
          }
        }
        if (newSelect.classList.contains('show')) {
          activeSelect = newSelect;
        } else {
          activeSelect = null;
        }
      };
    }
    if (jsSelect.length) {
      jsSelect.forEach(function (select) {
        if (rest.length) {
          if (select.name === rest[0]) {
            drawSelect(select);
          }
        } else {
          drawSelect(select);
        }
      });
    }
  };
  initJsSelect();
  var ranges = document.querySelectorAll('.range');
  if (ranges.length) {
    ranges.forEach(function (range) {
      var input = range.querySelector('.range__input');
      var output = range.querySelector('.range__output');
      output.textContent = input.value;
      input.addEventListener('input', function () {
        output.textContent = this.value;
      });
    });
  }
  scrollLock.addScrollableSelector('.modal__inner');
  openModalFunc = function openModalFunc(modal) {
    var prevShowed = document.querySelector('.show-modal');
    if (prevShowed && prevShowed != modal) {
      closeModal(prevShowed);
    }
    scrollLock.clearQueueScrollLocks();
    scrollLock.disablePageScroll(modal);
    modal.style.display = 'flex';
    setTimeout(function () {
      modal.classList.add('show-modal');
    }, 100);
  };
  closeModal = function closeModal(modal) {
    modal.classList.remove('show-modal');
    if (modal.classList.contains('authorization')) {
      var modalForm = document.querySelector('.authorization__form');
      modalForm.classList.remove('hide');
    }
    var form = document.querySelector('form');
    if (form) {
      form.reset();
      var empty = form.querySelectorAll('.empty-text');
      if (empty.length) {
        empty.forEach(function (el) {
          el.innerHTML = '';
          el.classList.remove('filled');
        });
        var sels = document.querySelectorAll('.js-select__wrap');
        if (sels.length) {
          sels.forEach(function (sel) {
            sel.classList.remove('was-checked');
            var hidden = sel.querySelector('.hidden');
            console.log(hidden);
            if (hidden) {
              hidden.dispatchEvent(new Event('click', {
                bubbles: true
              }));
            }
          });
        }
      }
    }
    setTimeout(function () {
      modal.style.display = 'none';
      scrollLock.enablePageScroll(modal);
    }, 300);
  };
  var closeModalBtns = document.querySelectorAll('[data-close]');
  if (closeModalBtns.length) {
    closeModalBtns.forEach(function (btn) {
      btn.onclick = function (e) {
        e.preventDefault();
        var modal = btn.closest('.show-modal');
        if (modal) {
          closeModal(modal);
        }
      };
    });
  }
  var modals = document.querySelectorAll('.modal');
  if (modals.length) {
    modals.forEach(function (modal) {
      modal.onclick = function (e) {
        if (e.target == e.currentTarget) {
          closeModal(modal);
        }
      };
    });
  }
  var id = 0;
  window.addEventListener('resize', function (e) {
    clearTimeout(id);
    id = setTimeout(function () {
      if (winW != window.innerWidth) {
        winH = window.innerHeight;
        winW = window.innerWidth;
        headerH = header.getBoundingClientRect().height;
        scrollBar = scrollLock.getPageScrollBarWidth();
      }
      document.documentElement.style.setProperty('--h', winH + 'px');
      document.documentElement.style.setProperty('--w', winW + 'px');
      document.documentElement.style.setProperty('--hH', headerH + 'px');
      document.documentElement.style.setProperty('--scr', scrollBar + 'px');
    }, 100);
  });
});