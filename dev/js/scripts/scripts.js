let bodyTag;
let winH;
let winW;
let userAgent;
let Mozila;

window.addEventListener('DOMContentLoaded', () => {
    bodyTag = document.querySelector("body");
    winH = window.innerHeight;
    winW = window.innerWidth;
    userAgent = navigator.userAgent.toLowerCase();
    Mozila = /firefox/.test(userAgent);
    if (Mozila) {
        document.documentElement.classList.add('moz');
    }

    document.documentElement.style.setProperty('--h', winH + 'px');
    document.documentElement.style.setProperty('--w', winW + 'px');

    window.addEventListener("resize", (e) => {
        if(winW != window.innerWidth) {
            winH = window.innerHeight;
            winW = window.innerWidth;
        }
        document.documentElement.style.setProperty('--h', winH + 'px');
        document.documentElement.style.setProperty('--w', winW + 'px');
    });
});

