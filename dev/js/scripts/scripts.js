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

    let id = 0;
    window.addEventListener("resize", (e) => {
        clearTimeout(id);
        id = setTimeout(() => {
            if(winW != window.innerWidth) {
                winH = window.innerHeight;
                winW = window.innerWidth;
            }
            document.documentElement.style.setProperty('--h', winH + 'px');
            document.documentElement.style.setProperty('--w', winW + 'px');
        }, 100);
    });

    const vboxOptions = {
        overlayColor: 'rgba(46, 46, 46, 0.4)',
        bgcolor: null,
        overlayClose: true,
        onContentLoaded: (newcontent) => {
            initPopup();
            setSubmitVal();
        },
    };
    let vBox;
    if(VenoBox) {
        vBox = new VenoBox(vboxOptions);
        window.vBox = vBox;
    }
      
    document.addEventListener('click', (e) => {
        const dataAction = 'data-action';
        const eTarget = e.target.closest(`[${dataAction}]`);
        const activeClass = '_active';
      
        const vBoxLink = e.target.closest('[data-venobox]');
        if (vBoxLink) {
            const href = vBoxLink.getAttribute('href');
        
            if (href) {
                e.preventDefault();
                if (!vBoxLink.settings) {
                    vBoxLink.settings = vBox.settings;
                }
                vBox.close();
                setTimeout(() => {
                    vBox.open(vBoxLink);
                }, 500);
            }
        }
      
        if (eTarget) {
            const actions = eTarget.getAttribute('data-action').split(' ');
        
            for (let action of actions) {
                switch (action) {
                    case 'vbox-close': {
                        vBox.close();
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }
    });
});

