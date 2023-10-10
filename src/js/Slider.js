export default (enableAutoSlide, deltaTime, isButtonIn) => ({
    skip: 1,
    atBeginning: false,
    atEnd: false,
    curIndex: 0,
    numSlides: 0,
    thumbnails: null,
    next() {
        if (this.curIndex >= this.numSlides - 1) {
            return;
        }
        this.to((current, offset) => current + (offset * this.skip));
    },
    prev() {
        if (this.curIndex <= 0) {
            return;
        }
        this.to((current, offset) => current - (offset * this.skip))
    },
    to(strategy) {
        let slider = this.$refs.slider
        let current = slider.scrollLeft
        let offset = slider.firstElementChild.getBoundingClientRect().width
        slider.scrollTo({ left: strategy(current, offset), behavior: 'smooth' })

        if (enableAutoSlide) {
            this.stopAutoSlide();
            this.startAutoSlide();
        }
    },
    jumpTo(index) {
        this.to((current, offset) => index * offset);
        this.curIndex = index;
    },
    mouseHoverThumbnails(index) {
        Array.from(this.thumbnails.children).forEach((child) => {
            child.classList.remove('border-2');
        });
        this.thumbnails.children[index].classList.add('border-2');
    },
    focusableWhenVisible: {
        'x-intersect.full:enter'() {
            this.$el.removeAttribute('tabindex')
        },
        'x-intersect.full:leave'() {
            this.$el.setAttribute('tabindex', '-1')
        },
    },
    disableNextAndPreviousButtons: {
        'x-intersect:enter.threshold.50'() {
            let slideEls = this.$el.parentElement.children
            let index = Array.from(slideEls).indexOf(this.$el);
            this.curIndex = index;
            if (this.thumbnails)
                this.mouseHoverThumbnails(this.curIndex);

            if (index == 0) {
                this.atBeginning = true
            }
            else if ((isButtonIn ? slideEls.length - 3 : slideEls.length - 1) == index) {
                this.atEnd = true
            }
            // // If this is the first slide.
            // if (slideEls[0] === this.$el) {
            //     this.atBeginning = true
            //     // If this is the last slide.
            // } else if (slideEls[isButtonIn ? slideEls.length - 3 : slideEls.length - 1] === this.$el) {
            //     this.atEnd = true
            // }
        },
        'x-intersect:leave.threshold.50'() {
            let slideEls = this.$el.parentElement.children
            let index = Array.from(slideEls).indexOf(this.$el);

            if (index == 0) {
                this.atBeginning = false
            }
            else if ((isButtonIn ? slideEls.length - 3 : slideEls.length - 1) == index) {
                this.atEnd = false
            }
            // // If this is the first slide.
            // if (slideEls[0] === this.$el) {
            //     this.atBeginning = false
            //     // If this is the last slide.
            // } else if (slideEls[isButtonIn ? slideEls.length - 3 : slideEls.length - 1] === this.$el) {
            //     this.atEnd = false
            // }
        },
    },
    // 新增的自动切换slider功能
    autoSlideInterval: null, // 用于存储定时器引用

    init() {
        let slider = this.$refs.slider;
        this.thumbnails = this.$refs.thumbnails;

        if (enableAutoSlide) {
            this.startAutoSlide = this.startAutoSlide.bind(this); // 将上下文绑定到函数
            this.stopAutoSlide = this.stopAutoSlide.bind(this); // 将上下文绑定到函数

            this.startAutoSlide();

            slider.addEventListener("touchstart", this.stopAutoSlide);
            slider.addEventListener("touchend", this.startAutoSlide);
        }

        if (isButtonIn)
            this.numSlides = Array.from(slider.children).length - 2;
        else
            this.numSlides = Array.from(slider.children).length;
    },
    destroy() {
        this.stopAutoSlide();

        let slider = this.$refs.slider;
        if (this.autoSlideInterval) {
            slider.removeEventListener("touchstart", this.stopAutoSlide);
            slider.removeEventListener("touchend", this.startAutoSlide);
        }
    },
    // 启用或禁用自动切换
    toggleAutoSlide() {
        if (enableAutoSlide) {
            this.startAutoSlide();
        } else {
            this.stopAutoSlide();
        }
    },
    // 开始自动切换
    startAutoSlide() {
        if (!this.autoSlideInterval) {
            this.autoSlideInterval = setInterval(() => {
                if (this.atEnd) {
                    this.to((current, offset) => 0);
                    return;
                }
                else {
                    this.next();
                }
            }, deltaTime); // 每2秒切换一次，可以根据需要调整间隔时间
        }
    },
    // 停止自动切换
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
})
