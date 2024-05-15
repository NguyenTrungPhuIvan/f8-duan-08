const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function load(selector, path) {
    const cached = localStorage.getItem(path);

    if (cached) {
        document.querySelector(selector).innerHTML = cached;
    }

    fetch(path)
        .then((res) => {
            return res.text();
        })
        .then((html) => {
            if (html !== cached) {
                document.querySelector(selector).innerHTML = html;
                localStorage.setItem(path, html);
            }
        })
        .finally(() => {
            window.dispatchEvent(new Event("template-loaded"));
        });
}

function isHidden(element) {
    if (!element) return true;

    if (window.getComputedStyle(element).display === "none") return true;

    let parent = element.parentElement;
    while (parent) {
        if (window.getComputedStyle(parent).display === "none") return true;
        parent = parent.parentElement;
    }

    return false;
}

function debounce(funt, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            funt.apply(this, args);
        }, timeout);
    };
}

const calArrowPos = debounce(() => {
    if (isHidden($(".js-dropdown-list"))) return;

    const items = $$(".js-dropdown-list > li");

    items.forEach((item) => {
        const arrowPos = item.offsetLeft + item.offsetWidth / 2;
        item.style.setProperty("--arrow-left-pos", `${arrowPos}px`);
    });
});

window.addEventListener("resize", calArrowPos);

window.addEventListener("template-loaded", calArrowPos);

window.addEventListener("template-loaded", handleActiveMenu);

function handleActiveMenu() {
    const dropdown = $$(".js-dropdown-list");
    const menus = $$(".js-menu-list");
    const activeMenu = "menu-column__item--active";

    const resetActive = (menu) => {
        menu.querySelector(`.${activeMenu}`)?.classList.remove(activeMenu);
    };

    const init = () => {
        menus.forEach((menu) => {
            const items = menu.children;
            if (!items.length) return;

            resetActive(menu);
            if (window.innerWidth > 991) items[0].classList.add(activeMenu);

            Array.from(items).forEach((item) => {
                item.onmouseenter = () => {
                    if (window.innerWidth <= 991) return;

                    resetActive(menu);
                    item.classList.add(activeMenu);
                };
                item.onclick = () => {
                    if (window.innerWidth > 991) return;
                    resetActive(menu);
                    item.classList.add(activeMenu);
                    //  cuộn đến menu
                    item.scrollIntoView();
                };
            });
        });
    };

    init();

    dropdown.forEach((dropdownItem) => {
        dropdownItem.onmouseleave = () => {
            init();
        };
    });
}

window.addEventListener("template-loaded", initJsToggle);

function initJsToggle() {
    const buttons = $$(".js-toggle");

    buttons.forEach((button) => {
        const target = button.getAttribute("toggle-target");

        if (!target) {
            console.error(`target is not valid`);
        }

        button.onclick = () => {
            if (!target) return;
            const isHiddenClass = $(target).classList.contains("hide");

            requestAnimationFrame(() => {
                $(target).classList.toggle("show", isHiddenClass);
                $(target).classList.toggle("hide", !isHiddenClass);
            });
        };
    });
}

window.addEventListener("template-loaded", () => {
    const links = $$(".js-dropdown-list > li > a");

    links.forEach((link) => {
        link.onclick = () => {
            if (window.innerWidth > 991) return;
            const item = link.closest("li");
            item.classList.toggle("nav__item--active");
        };
    });
});
function handleSlideShow() {
    const imgs = $$(".js-slideShow-img");
    const slide = $(".slideshow__inner");
    const btnLeft = $(".slideshow__left");
    const btnRight = $(".slideshow__right");
    const line = $(".slideshow__line");
    const moveCircle = $(".slideshow__move");
    let lineWidth = 0;

    let step = 0;

    let curr = 0;
    let intervalFunc = setInterval(() => {
        handleChangeIMG();
    }, 3000);
    setLineWidth();
    function handleChangeIMG() {
        if (curr == imgs.length - 1) {
            curr = 0;
            let width = imgs[0].offsetWidth;
            slide.style.transform = `translateX(${width * curr * -1}px)`;
            resetInterval();
            getSteps();
        } else {
            curr++;
            let width = imgs[0].offsetWidth;
            slide.style.transform = `translateX(${width * curr * -1}px)`;
            resetInterval();
            getSteps();
        }
    }
    btnRight.onclick = handleChangeIMG;
    btnLeft.onclick = () => {
        if (curr == 0) {
            curr = imgs.length - 1;
            let width = imgs[0].offsetWidth;
            slide.style.transform = `translateX(${width * curr * -1}px)`;
            resetInterval();
            getStepsReverse();
        } else {
            curr--;
            let width = imgs[0].offsetWidth;
            slide.style.transform = `translateX(${width * curr * -1}px)`;
            resetInterval();
            getStepsReverse();
        }
    };

    function resetInterval() {
        clearInterval(intervalFunc);
        intervalFunc = setInterval(() => {
            handleChangeIMG();
        }, 3000);
    }

    function setLineWidth() {
        const numbEnd = $(".sildeshow__numb-end");
        numbEnd.innerText = `${imgs.length}`;
        line.style.width = `${lineWidth}px`;
        let numbItem = parseFloat(imgs.length);
        lineWidth = numbItem * 34;
        line.style.width = `${lineWidth}px`;

        step = (lineWidth + 14) / (imgs.length - 1);
    }
    function getSteps() {
        if (moveCircle.offsetLeft >= line.offsetWidth) {
            moveCircle.style.left = `-14px`;
        } else {
            moveCircle.style.left = `${moveCircle.offsetLeft + step}px`;
        }
    }
    function getStepsReverse() {
        if (moveCircle.offsetLeft <= -14) {
            moveCircle.style.left = `${line.offsetWidth}px`;
            console.log(line.offsetWidth);
        } else {
            moveCircle.style.left = `${moveCircle.offsetLeft - step}px`;
        }
    }
}
