document.addEventListener('DOMContentLoaded', function () {
    // mobile menu
    const body = document.querySelector('body');
    const menuToggle = document.querySelector('.menu-toggle');

    menuToggle.addEventListener('click', function () {
        body.classList.toggle('menu-active');
    });

    // swiper
    const partnersSwiper = new Swiper('.partners-slider', {
        loop: true,
        allowTouchMove: false,
        spaceBetween: 20,
        slidesPerView: 'auto',
        autoplay: {
            delay: 0,
            disableOnInteraction: false
        },
        speed: 3000,
        breakpoints: {
            1024: {
                slidesPerView: 'auto',
                spaceBetween: 30
            },
            1280: {
                slidesPerView: 'auto',
                spaceBetween: 50
            }
        },
    });

    const projectsSwiper = new Swiper('.projects-slider', {
        loop: false,
        spaceBetween: 16,
        slidesPerView: 1,
        autoplay: false,
        speed: 1000,
        scrollbar: {
            el: ".swiper-scrollbar",
            hide: false,
            draggable: true,
            dragSize: 80
        },
        breakpoints: {
            768: {
                slidesPerView: 2
            },
            1024: {
                slidesPerView: 2,
                spaceBetween: 32
            },
        },
    });

    const testimonialsSwiper = new Swiper('.testimonials-slider', {
        loop: true,
        autoHeight: true,
        spaceBetween: 16,
        slidesPerView: 1,
        autoplay: false,
        speed: 1000,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
        },
        on: {
            init: function (swiper) {
                adjustSliderHeight(swiper);
            },
            slideChange: function (swiper) {
                adjustSliderHeight(swiper);
            },
            setTranslate: function (swiper, translate) {
                if (window.innerWidth >= 1024) {
                    console.log(translate);
                }
            }
        },
        breakpoints: {
            1024: {
                direction: "vertical",
                spaceBetween: 24,
            },
        },
    });

    // fancybox
    Fancybox.bind("[data-fancybox]", {
        // Your custom options
    });

    // masonry
    function initializeMasonry() {
        const isMobile = window.innerWidth <= 768;
        const gutterSize = isMobile ? 16 : 32;

        return new Masonry(".projects-holder", {
            itemSelector: '.project-item:not(.excluded)',
            columnWidth: '.project-item',
            gutter: gutterSize,
        });
    }

    let msnry = initializeMasonry();

    window.addEventListener('resize', () => {
        msnry.destroy();

        msnry = initializeMasonry();
    });

    // load more projects
    function loadMoreProjects() {
        const projectSections = document.querySelectorAll(".projects-section");

        projectSections.forEach((section) => {
            const projectsHolder = section.querySelector(".projects-holder");
            const loadMoreButton = section.querySelector(".btn");

            const initialHeight = projectsHolder.offsetHeight;
            const viewportHeight = window.innerHeight;

            if (initialHeight <= viewportHeight) {
                projectsHolder.classList.add('no-btn');
            } else {
                projectsHolder.style.height = "100vh";

                loadMoreButton.addEventListener("click", function () {
                    if (projectsHolder.style.height === "100vh") {
                        projectsHolder.style.height = `${initialHeight}px`;
                        projectsHolder.classList.add('no-btn');
                    } else {
                        projectsHolder.style.height = "100vh";
                    }
                });
            }
        });
    }

    loadMoreProjects();

    // projects filter
    const projectsHolder = document.querySelector(".projects-holder");
    const radioButtons = document.querySelectorAll(".projects-filter input[type='radio']");
    const allProjects = Array.from(projectsHolder.querySelectorAll(".project-item"));

    function filterProjects(type) {
        allProjects.forEach(project => {
            if (type === "all" || project.dataset.type === type) {
                project.style.display = "";
                project.classList.remove("excluded");
            } else {
                project.style.display = "none";
                project.classList.add("excluded");
            }
        });
        msnry.reloadItems();
        msnry.layout();
        loadMoreProjects();
    }

    radioButtons.forEach(radio => {
        radio.addEventListener("change", (event) => {
            const selectedType = event.target.value;
            filterProjects(selectedType);
        });
    });
});

// Adjust slider height
function adjustSliderHeight(swiper) {
    if (window.innerWidth >= 1024) {
        const slider = document.querySelector(".testimonials-slider");
        const currentSlideItem = swiper.slides[swiper.activeIndex];
        slider.style.height = currentSlideItem.clientHeight + "px";
    } else {
        const slider = document.querySelector(".testimonials-slider");
        slider.style.height = "auto";
    }
}

// Resize event
window.addEventListener("resize", () => {
    const slider = document.querySelector(".testimonials-slider");
    const swiperInstance = testimonialsSwiper;

    adjustSliderHeight(swiperInstance);

    if (window.innerWidth < 1024) {
        slider.style.height = "auto";
    }
});
