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

    const slider = $(".slideshow");

    const btns = $$(".slideshow__btn");

    const line = $(".slideshow__line");
    const moveCircle = $(".slideshow__move");
    let lineWidth = 0;

    let step = 0;

    let intervalFunc = setInterval(() => {
        // autoPlaySider();
    }, 3000);

    const autoPlaySider = () => {
        if (slider.scrollLeft === slider.scrollWidth - slider.offsetWidth) {
            slider.scrollLeft = 0;
        } else {
            slider.scrollLeft += slider.offsetWidth;
        }
        getSteps();
        resetInterval();
    };

    setLineWidth();
    // hoverIMGStop();

    dragSlideShow();
    function dragSlideShow() {
        let width = imgs[0].offsetWidth;
        let isGetSteps = false;

        let isDragging = false,
            startX,
            startScrollLeft;

        const dragging = (e) => {
            if (!isDragging) return;
            if (slider.scrollLeft === slider.scrollWidth - slider.offsetWidth) {
                if (-(e.pageX - startX) * 2 > 0) {
                    slider.scrollLeft = 0;
                    if (!isGetSteps && Math.abs((e.pageX - startX) * 2) > slider.offsetWidth / 2) {
                        getSteps();
                        isGetSteps = true;
                    }
                } else {
                    slider.scrollLeft = startScrollLeft - (e.pageX - startX) * 2;
                    if (!isGetSteps && Math.abs((e.pageX - startX) * 2) > slider.offsetWidth / 2) {
                        getStepsReverse();
                        isGetSteps = true;
                    }
                }
            } else if (slider.scrollLeft === 0) {
                if (-(e.pageX - startX) * 2 < 0) {
                    slider.scrollLeft = slider.scrollWidth - slider.offsetWidth;
                    if (!isGetSteps && Math.abs((e.pageX - startX) * 2) > slider.offsetWidth / 2) {
                        getStepsReverse();
                        isGetSteps = true;
                    }
                } else {
                    slider.scrollLeft = startScrollLeft - (e.pageX - startX) * 2;
                    if (!isGetSteps && Math.abs((e.pageX - startX) * 2) > slider.offsetWidth / 2) {
                        getSteps();
                        isGetSteps = true;
                    }
                }
            } else {
                slider.scrollLeft = startScrollLeft - (e.pageX - startX) * 2;
                if (-(e.pageX - startX) * 2 > 0) {
                    if (!isGetSteps && Math.abs((e.pageX - startX) * 2) > slider.offsetWidth / 2) {
                        getSteps();
                        isGetSteps = true;
                    }
                } else {
                    if (!isGetSteps && Math.abs((e.pageX - startX) * 2) > slider.offsetWidth / 2) {
                        getStepsReverse();
                        isGetSteps = true;
                    }
                }
            }
        };

        function startDragging(e) {
            isDragging = true;
            slider.classList.add("dragging");
            startX = e.pageX;
            startScrollLeft = slider.scrollLeft;

            clearInterval(intervalFunc);
        }
        function stopDragging(e) {
            isDragging = false;
            slider.classList.remove("dragging");

            isGetSteps = false;

            // intervalFunc = setInterval(() => {
            //     autoPlaySider();
            // }, 3000);
        }

        slider.addEventListener("mousemove", dragging);
        slider.addEventListener("mousedown", startDragging);

        window.addEventListener("mouseup", stopDragging);

        btns.forEach((btn) => {
            btn.onclick = (e) => {
                const width = imgs[0].offsetWidth;
                if (slider.scrollLeft === 0 && btn.id === "slideshow__left") {
                    slider.scrollLeft = slider.scrollWidth - slider.offsetWidth;
                    resetInterval();
                    getStepsReverse();
                } else if (slider.scrollLeft === slider.scrollWidth - slider.offsetWidth && btn.id === "slideshow__right") {
                    slider.scrollLeft = 0;
                    resetInterval();
                    getSteps();
                } else {
                    slider.scrollLeft += btn.id === "slideshow__left" ? -width : width;
                    btn.id === "slideshow__left" ? getStepsReverse() : getSteps();
                    resetInterval();
                }
            };
        });
    }
    function hoverIMGStop() {
        slider.addEventListener("mouseenter", () => {
            clearInterval(intervalFunc);
        });
        slider.addEventListener("mouseleave", () => {
            // intervalFunc = setInterval(() => {
            //     autoPlaySider();
            // }, 3000);
        });
        resetInterval();
    }
    function resetInterval() {
        clearInterval(intervalFunc);
        intervalFunc = setInterval(() => {
            autoPlaySider();
        }, 3000);
    }

    function setLineWidth() {
        let spaceItem;
        if (window.innerWidth < 991 && window.innerWidth > 768) {
            spaceItem = 24;
        } else if (window.innerWidth < 768) {
            spaceItem = 14;
        } else {
            spaceItem = 34;
        }
        const numbEnd = $(".sildeshow__numb-end");
        numbEnd.innerText = `${imgs.length}`;
        line.style.width = `${lineWidth}px`;
        let numbItem = parseFloat(imgs.length);
        lineWidth = numbItem * spaceItem;
        line.style.width = `${lineWidth}px`;
        step = (lineWidth + moveCircle.offsetWidth) / (imgs.length - 1);
    }

    function getSteps() {
        if (moveCircle.offsetLeft >= line.offsetWidth) {
            setTimeout(() => {
                moveCircle.style.left = `${moveCircle.offsetWidth * -1}px`;
            }, 300);
        } else {
            setTimeout(() => {
                moveCircle.style.left = `${moveCircle.offsetLeft + step}px`;
            }, 300);
        }
    }
    function getStepsReverse() {
        if (moveCircle.offsetLeft <= -14) {
            setTimeout(() => {
                moveCircle.style.left = `${line.offsetWidth}px`;
            }, 300);
        } else {
            setTimeout(() => {
                moveCircle.style.left = `${moveCircle.offsetLeft - step}px`;
            }, 300);
        }
    }
}

window.addEventListener("template-loaded", handleClickHeart);

function handleClickHeart() {
    const heartWrap = $$(".heart-circle");
    const hearts = $$(".heart-circle .icon");

    heartWrap.forEach((heart, index) => {
        heart.onclick = () => {
            heart.classList.toggle(`active-${index}`);
            const activeHeart = $(`.heart.heart-circle.active-${index}`);
            if (activeHeart) {
                hearts[index].src = "./assets/icon/red-heart.svg";
                hearts[index].style.filter = "none";
                hearts[index].style.transform = "translateY(4px)";
            } else {
                hearts[index].src = "./assets/icon/heart-line.svg";
                hearts[index].style.filter = "var(--filter-icon)";
                hearts[index].style.transform = "translateY(0px)";
            }
        };
    });
}

window.addEventListener("template-loaded", addClickFilter);

function addClickFilter() {
    const filters = $$(".filter__wapper");
    const filterWapper = $$(".filter");
    const btnFilter = $$(".filter__control .btn");
    filters.forEach((filter, index) => {
        filter.onclick = (e) => {
            e.preventDefault();
            filterWapper[index].classList.toggle("active");
        };
        btnFilter.forEach((btn) => {
            btn.onclick = () => {
                filterWapper[index].classList.toggle("active");
            };
        });
        document.onclick = function (e) {
            if (!e.target.closest(".filter")) {
                const isActive = filterWapper[index].classList.contains("active");
                if (isActive) {
                    filterWapper[index].classList.toggle("active");
                }
            }
        };
    });
}
