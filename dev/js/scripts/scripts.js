let bodyTag;
let winH;
let winW;
let userAgent;
let Mozila;
let scrollBar;

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
