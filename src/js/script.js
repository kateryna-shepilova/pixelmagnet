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
        on: {
            init: function () {
                this.snapGrid = [...this.slidesGrid];
            },
            slideChange: function () {
                this.snapGrid = [...this.slidesGrid];
            },
            reachEnd: function () {
                this.snapGrid = [...this.slidesGrid];
            },
        },
    });

    function calculateSlideHeights() {
        const slides = document.querySelectorAll('.testimonials-slider .swiper-slide');
        const slideHeights = Array.from(slides).map(slide => slide.getBoundingClientRect().height);
        return slideHeights;
    }

    const slideHeights = calculateSlideHeights();

    const testimonialsSwiper = new Swiper('.testimonials-slider', {
        loop: true,
        autoHeight: false,
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
                setInitialSliderHeight(swiper);
            },
            slideChange: function (swiper) {
                updateSliderHeight(swiper);
            },
        },
        breakpoints: {
            1024: {
                direction: "vertical",
                spaceBetween: 24,
            },
        },
    });

    function setInitialSliderHeight(swiper) {
        const slider = document.querySelector(".testimonials-slider");
        if (window.innerWidth >= 1024) {
            const initialHeight = slideHeights[swiper.realIndex];
            slider.style.height = `${initialHeight}px`;
        } else {
            slider.style.height = "auto";
        }
    }

    function updateSliderHeight(swiper) {
        const slider = document.querySelector(".testimonials-slider");
        if (window.innerWidth >= 1024) {
            const activeSlideHeight = slideHeights[swiper.realIndex];
            slider.style.height = `${activeSlideHeight}px`;
        } else {
            slider.style.height = "auto";
        }
    }

    window.addEventListener("resize", () => {
        const slider = document.querySelector(".testimonials-slider");
        if (window.innerWidth >= 1024) {
            const activeSlideHeight = slideHeights[testimonialsSwiper.realIndex];
            slider.style.height = `${activeSlideHeight}px`;
        } else {
            slider.style.height = "auto";
        }
    });

    // fancybox
    Fancybox.bind("[data-fancybox]", {
        // Your custom options
    });

    // masonry
    const projectsHolder = document.querySelector(".projects-holder");

    if (projectsHolder && typeof Masonry !== "undefined") {
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

        // projects filter
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
    }

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
});
