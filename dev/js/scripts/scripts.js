let bodyTag, winH, winW, userAgent, Mozila, scrollBar, initJsSelect;

window.addEventListener('DOMContentLoaded', () => {
    bodyTag = document.querySelector('body');
    winH = window.innerHeight;
    winW = window.innerWidth;
    scrollBar = scrollLock.getPageScrollBarWidth();
    userAgent = navigator.userAgent.toLowerCase();
    Mozila = /firefox/.test(userAgent);
    if (Mozila) {
        document.documentElement.classList.add('moz');
    }

    let header = document.querySelector('.header');
    let headerH;
    if (header) {
        setTimeout(() => {
            headerH = header.getBoundingClientRect().height;
        }, 100);
    }

    document.documentElement.style.setProperty('--h', winH + 'px');
    document.documentElement.style.setProperty('--w', winW + 'px');
    document.documentElement.style.setProperty('--scr', scrollBar + 'px');

    let anchors = document.querySelectorAll('[data-anchor]');
    if (anchors.length) {
        anchors.forEach((anchor) => {
            anchor.onclick = (e) => {
                e.preventDefault();
                let attr = anchor.dataset.anchor;
                let related = document.querySelector(`#${attr}`);
                if (related) {
                    let headerH = header.offsetHeight;
                    let top = related.offsetTop; // + window.scrollY;
                    let calcTop = top - headerH > 0 ? top - headerH : 0;
                    window.scrollTo({
                        top: calcTop,
                        behavior: 'smooth',
                    });
                }
            };
        });
    }

    initJsSelect = function (...rest) {
        let jsSelect = document.querySelectorAll('.js-select');
        let activeSelect = document.querySelector('.dropped .custom-select');
        function drawSelect(select) {
            let isSearch = select.classList.contains('js-search-select');
            let searchInp;
            let selectParent = select.parentNode;
            let prevCustomSelect = selectParent.querySelector('.custom-select');
            if (prevCustomSelect) {
                prevCustomSelect.remove();
            }
            if (isSearch) {
                searchInp = selectParent.querySelector('.drop-search__inp input');
            }
            let newSelect = document.createElement('div');
            newSelect.className = 'custom-select';
            selectParent.appendChild(newSelect);
            let trigger = document.createElement('div');
            trigger.className = 'custom-trigger';
            newSelect.appendChild(trigger);
            let triggerSpanText = document.createElement('span');
            trigger.appendChild(triggerSpanText);
            let optionsWrapOuter = document.createElement('div');
            optionsWrapOuter.className = 'custom-select__wrap_outer';
            newSelect.appendChild(optionsWrapOuter);
            let optionsWrap = document.createElement('div');
            optionsWrap.className = 'custom-select__wrap';
            optionsWrapOuter.appendChild(optionsWrap);
            let options = select.querySelectorAll('option');
            options.forEach((option, i) => {
                let val = option.value;
                let flag = option.dataset.flag;
                let text = option.textContent;
                let checked = option.selected;
                let newOption = document.createElement('div');
                newOption.className = 'custom-option';
                if (option.hidden) {
                    newOption.classList.add('hidden');
                }
                newOption.setAttribute('data-value', val);
                newOption.innerText = text;
                let newImg;
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
                        let imgCopy = newImg.cloneNode(true);
                        trigger.prepend(imgCopy);
                    }
                }
                optionsWrap.appendChild(newOption);
                newOption.addEventListener('click', (e) => {
                    if (!newOption.classList.contains('checked')) {
                        let prevSelected = newSelect.querySelector('.checked');
                        if (prevSelected) {
                            prevSelected.classList.remove('checked');
                            let prevVal = prevSelected.getAttribute('data-value');
                            let prevOption = selectParent.querySelector(
                                `option[value='${prevVal}']`
                            );
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
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                    } else {
                        newSelect.classList.remove('show');
                        selectParent.classList.remove('dropped');
                        if (selectParent.closest('.drop')) {
                            selectParent.closest('.drop').classList.remove('dropped');
                        }
                    }
                });
            });
            trigger.onclick = (e) => {
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
            jsSelect.forEach((select) => {
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

    const ranges = document.querySelectorAll('.range');
    if (ranges.length) {
        ranges.forEach((range) => {
            let input = range.querySelector('.range__input');
            let output = range.querySelector('.range__output');
            output.textContent = input.value;
            input.addEventListener('input', function () {
                output.textContent = this.value;
            });
        });
    }

    let id = 0;
    window.addEventListener('resize', (e) => {
        clearTimeout(id);
        id = setTimeout(() => {
            if (winW != window.innerWidth) {
                winH = window.innerHeight;
                winW = window.innerWidth;
            }
            document.documentElement.style.setProperty('--h', winH + 'px');
            document.documentElement.style.setProperty('--w', winW + 'px');
        }, 100);
    });
});
