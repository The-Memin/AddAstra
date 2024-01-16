jQuery(function ($) {
	//beginning

	$("").on("click", function (e) {

	});

	const constants = {
		isDevice: false,
	};

	const instances = {
		scroll: undefined,
		slider: undefined,
	};



	const lerp = (a, b, n) => (1 - n) * a + n * b;
	const clamp = (val, min, max) => Math.max(Math.min(val, min), max);



	class Placeholders {
		constructor() {
			this.dom = {};
			this.dom.el = document.querySelector('.js-placeholders');
			this.dom.images = this.dom.el.querySelectorAll('.js-img-wrap');
			this.dom.buttonOpen = document.querySelector('.js-slider-open');
			this.dom.content = document.querySelector('.js-content');

			this.bounds = this.dom.el.getBoundingClientRect();

			this.state = {
				animating: false
			};
		}

		setHoverAnimation() {
			this.tlHover = gsap.timeline({ paused: true });

			this.tlHover
				.addLabel('start')

				.set(this.dom.el, { autoAlpha: 1 })
				.set(this.dom.images, { scale: 0.5, x: (window.innerWidth / 12) * 1.2, rotation: 0 })

				.to(this.dom.images, { duration: 1, stagger: 0.07, ease: 'in-out-smooth', x: 0, y: 0 })
				.to(this.dom.images[0], { duration: 1, ease: 'in-out-smooth', rotation: -4 }, 'start')
				.to(this.dom.images[1], { duration: 1, ease: 'in-out-smooth', rotation: -2 }, 'start');
		}

		setExpandAnimation() {
			setTimeout(() => { // set timeout to make sure x position is set (parallax)
				!constants.isDevice && instances.scroll.enable();

				const x1 = this.bounds.left - instances.slider.items[0].bounds.left - 20;
				const x2 = this.bounds.left - instances.slider.items[1].bounds.left + 10;
				const x3 = this.bounds.left - instances.slider.items[2].bounds.left;

				const y1 = this.bounds.top - instances.slider.items[0].bounds.top + 10;
				const y2 = this.bounds.top - instances.slider.items[1].bounds.top - 30;
				const y3 = this.bounds.top - instances.slider.items[2].bounds.top + 30;

				const intersectX1 = constants.isDevice ? 0 : instances.slider.items[0].x;
				const intersectX2 = constants.isDevice ? 0 : instances.slider.items[1].x;
				const intersectX3 = constants.isDevice ? 0 : instances.slider.items[2].x;

				const scale = instances.slider.items[0].bounds.width / this.bounds.width;
				const rotation = 0;

				this.tlExpand = gsap.timeline({
					paused: true,
					onComplete: () => {
						this.state.animating = false;
						this.setHoverAnimation();
					}
				});

				if (constants.isDevice) {
					// set images position + rotation, because there's no hover animation on touch devices
					this.tlExpand.set(this.dom.images, { scale: 0.5, x: (window.innerWidth / 12) * 7, rotation: 0 });
				}

				this.tlExpand
					.addLabel('start')

					.set(this.dom.el, { autoAlpha: 1 })

					.to(this.dom.buttonOpen, { duration: 0.5, autoAlpha: 0 })

					.to(this.dom.content, { duration: 0.8, autoAlpha: 0 }, 'start')

					.to(this.dom.images[0], { duration: 1.67, ease: 'in-out-smooth', x: -x1, y: -y1, scale, rotation }, 'start')
					.to(this.dom.images[1], { duration: 1.67, ease: 'in-out-smooth', x: -x2, y: -y2, scale, rotation }, 'start')
					.to(this.dom.images[2], { duration: 1.67, ease: 'in-out-smooth', x: -x3, y: -y3, scale, rotation }, 'start')

					.to(this.dom.images[0].querySelector('img'), { duration: 1.67, ease: 'in-out-smooth', x: intersectX1 }, 'start')
					.to(this.dom.images[1].querySelector('img'), { duration: 1.67, ease: 'in-out-smooth', x: intersectX2 }, 'start')
					.to(this.dom.images[2].querySelector('img'), { duration: 1.67, ease: 'in-out-smooth', x: intersectX3 }, 'start')

					.set(this.dom.el, { autoAlpha: 0 }, 'start+=1.67')

				this.tlExpand.play();

				instances.slider.open();
			}, 100);
		}

		handleMouseenter = () => {
			if (this.state.animating || constants.isDevice) return;

			this.tlHover.play();
		}

		handleMouseleave = () => {
			if (this.state.animating || constants.isDevice) return;

			this.tlHover.reverse();
		}

		handleClick = () => {
			if (this.state.animating) return;

			this.state.animating = true;

			this.setExpandAnimation();
		}

		handleResize = () => {
			this.bounds = this.dom.el.getBoundingClientRect();

			this.setHoverAnimation();
		}

		addListeners() {
			this.dom.buttonOpen.addEventListener('click', this.handleClick);

			this.dom.buttonOpen.addEventListener('mouseenter', this.handleMouseenter);
			this.dom.buttonOpen.addEventListener('mouseleave', this.handleMouseleave);
			window.addEventListener('resize', this.handleResize);
		}

		init() {
			this.addListeners();
			this.setHoverAnimation();
		}
	}


	class Slider {
		constructor() {
			this.dom = {};
			this.dom.el = document.querySelector('.js-slider');
			this.dom.container = this.dom.el.querySelector('.js-container');
			this.dom.items = this.dom.el.querySelectorAll('.js-item');
			this.dom.images = this.dom.el.querySelectorAll('.js-img-wrap');
			this.dom.headings = this.dom.el.querySelectorAll('.js-heading');
			this.dom.buttons = this.dom.el.querySelectorAll('.js-button');
			this.dom.buttonOpen = document.querySelector('.js-slider-open');
			this.dom.buttonClose = this.dom.el.querySelector('.js-slider-close');
			this.dom.buttonCloseCircle = this.dom.buttonClose.querySelector('circle');
			this.dom.progressWrap = this.dom.el.querySelector('.js-progress-wrap');
			this.dom.progress = this.dom.el.querySelector('.js-progress');
			this.dom.content = document.querySelector('.js-content');


			this.state = {
				open: false,
				scrollEnabled: false,
				progress: 0,
			};
		}

		setCache() {
			this.items = [];
			[...this.dom.items].forEach((el) => {
				const bounds = el.getBoundingClientRect();

				this.items.push({
					img: el.querySelector('img'),
					bounds,
					x: 0,
				});
			});
		}

		render = () => {
			if (constants.isDevice) return;

			const scrollLast = Math.abs(instances.scroll.state.last);

			this.items.forEach((item) => {
				const { bounds } = item;
				const inView = scrollLast + window.innerWidth >= bounds.left && scrollLast < bounds.right;

				if (inView) {
					const min = bounds.left - window.innerWidth;
					const max = bounds.right;
					const percentage = ((scrollLast - min) * 100) / (max - min);
					const newMin = -(window.innerWidth / 12) * 3;
					const newMax = 0;
					item.x = ((percentage - 0) / (100 - 0)) * (newMax - newMin) + newMin;

					item.img.style.transform = `translate3d(${item.x}px, 0, 0) scale(1.75)`;
				}
			});

			if (this.state.scrollEnabled) {
				const min = 0;
				const max = -instances.scroll.state.bounds.width + window.innerWidth;
				this.state.progress = ((instances.scroll.state.last - min) * 100) / (max - min) / 100;

				this.dom.progress.style.transform = `scaleX(${this.state.progress})`;
			}
		}

		open = () => {
			if (this.state.open) return;

			const tl = gsap.timeline({ paused: true });

			const length = this.dom.buttonCloseCircle.getTotalLength();
			this.dom.buttonCloseCircle.style.strokeDasharray = length;
			this.dom.buttonCloseCircle.style.strokeDashoffset = length;

			tl
				.addLabel('start')

				.set(this.dom.items, { autoAlpha: 0 })
				.set(this.dom.el, { autoAlpha: 1 })

				.set(this.dom.headings, { y: -this.dom.headings[0].offsetHeight, rotation: -5 })
				.set(this.dom.buttons, { y: -this.dom.buttons[0].offsetHeight * 1.7 })

				.set(this.dom.progressWrap, { autoAlpha: 0 })
				.set(this.dom.buttonClose, { autoAlpha: 0 })

				.to(this.dom.buttonClose, { duration: 1.5, autoAlpha: 1 }, '+=0.1')
				.to(this.dom.buttonCloseCircle, { duration: 1.5, ease: 'Expo.easeInOut', strokeDashoffset: 0 }, 'start+=0.1')

				.set(this.dom.items, { autoAlpha: 1 }, 'start+=0.5')
				.set(this.dom.images, { autoAlpha: 0 }, 'start+=0.5')
				.set(this.dom.images, { autoAlpha: 1 }, 'start+=1.67')

				.call(() => {
					// reset scroll position
					if (constants.isDevice) {
						this.dom.container.scrollLeft = 0;
					} else {
						instances.scroll.state.current = 0;
						instances.scroll.state.last = 0;
					}

					this.state.scrollEnabled = true;
					gsap.to('.overlay-texto', { duration: 0.5, opacity: 1 });
				})

				.to(this.dom.headings, { duration: 1.6, stagger: 0.15, ease: 'in-out-smooth', y: 0, rotation: 0 }, 'start+=0.5')
				.to(this.dom.buttons, { duration: 1.6, stagger: 0.15, ease: 'in-out-smooth', y: 0 }, 'start+=0.6')
				.to(this.dom.progressWrap, { duration: 0.6, ease: 'in-out-smooth', autoAlpha: 1 }, 'start+=0.73');

			tl.play();

			this.state.open = true;
		}

		close = () => {
			if (!this.state.open) return;

			instances.scroll.disable();
			this.state.scrollEnabled = false;

			const { top, height } = this.dom.items[0].getBoundingClientRect();
			const y = window.innerHeight - top - height + height;

			const tl = gsap.timeline({
				paused: true, onComplete: () => {
					if (!constants.isDevice) {
						// reset scroll position
						instances.scroll.state.current = 0;
						instances.scroll.state.last = 0;
						this.state.progress = 0;
					} else {
						this.dom.container.scrollLeft = 0;
					}

				}
			});

			tl.addLabel('start');

			tl
				.to(this.dom.items, { duration: 1.8, stagger: { each: 0.03, from: 'center' }, ease: 'in-out-smooth', autoAlpha: 0, y })
				.to(this.dom.buttonClose, { duration: 0.5, autoAlpha: 0 }, 'start')
				.to(this.dom.progressWrap, { duration: 0.5, autoAlpha: 0 }, 'start')
				.to(this.dom.buttonOpen, { duration: 0.5, autoAlpha: 1 }, 'start+=0.5')
				.to(this.dom.content, { duration: 0.8, autoAlpha: 1 }, 'start+=1.1')
				.set(this.dom.items, { y: 0 })
				.set(this.dom.el, { autoAlpha: 0 });

			tl.play();
			gsap.to('.overlay-texto', { opacity: 0 });
			this.state.open = false;
		}

		handleResize = () => {
			this.setCache();
		}

		addListeners() {
			window.addEventListener('resize', this.handleResize);
			this.dom.buttonClose.addEventListener('click', this.close);
		}

		init() {
			gsap.ticker.add(this.render);
			this.setCache();
			this.addListeners();
		}
	}

	class Scroll {
		constructor() {
			this.dom = {
				container: document.querySelector('[data-scroll]')
			};

			this.options = {
				ease: 0.1,
				dragSpeed: 1.5,
			};

			this.state = {
				bounds: {},
				current: 0,
				last: 0,
				dragging: false,
				dragStart: 0,
				dragEnd: 0,
			};
		}

		smooth = () => {
			this.state.last = lerp(this.state.last, this.state.current, this.options.ease);
			this.dom.container.style.transform = `translate3d(${this.state.last}px, 0, 0)`;
		}

		calc = () => {
			this.state.current = window.scrollX || window.pageXOffset;
			this.state.current = Math.max((this.state.bounds.width - window.innerWidth) * -1, this.state.current);
			this.state.current = Math.min(0, this.state.current);
		}

		handleWheel = (e) => {
			this.state.current -= e.deltaY;
			this.state.current = Math.max((this.state.bounds.width - window.innerWidth) * -1, this.state.current);
			this.state.current = Math.min(0, this.state.current);
		}

		enable() {
			window.addEventListener('scroll', this.calc);
			window.addEventListener('wheel', this.handleWheel, { passive: false });
			gsap.ticker.add(this.smooth);
		}

		disable() {
			window.removeEventListener('scroll', this.calc);
			window.removeEventListener('wheel', this.handleWheel, { passive: false });
			gsap.ticker.remove(this.smooth);
		}

		handleMouseup = () => {
			this.state.dragging = false;
			this.state.dragEnd = this.state.current;

			document.body.classList.remove('is-dragging');
		}

		handleMousedown = (e) => {
			this.state.dragging = true;

			this.state.dragEnd = this.state.current;
			this.state.dragStart = e.clientX;

			document.body.classList.add('is-dragging');
		}

		handleMousemove = (e) => {
			if (!this.state.dragging) return;

			this.state.current = this.state.dragEnd + ((e.clientX - this.state.dragStart) * this.options.dragSpeed);
			this.state.current = clamp(this.state.current, 0, -this.state.bounds.width + window.innerWidth);
		}

		handleMouseleave = () => {
			this.state.dragging = false;
			this.state.dragEnd = this.state.current;

			document.body.classList.remove('is-dragging');
		}

		handleResize = () => {
			this.state.bounds = this.dom.container.getBoundingClientRect();
		}

		addListeners() {
			window.addEventListener('resize', this.handleResize, { passive: true });
			this.dom.container.addEventListener('mouseup', this.handleMouseup);
			this.dom.container.addEventListener('mousedown', this.handleMousedown);
			this.dom.container.addEventListener('mouseleave', this.handleMouseleave);
			this.dom.container.addEventListener('mousemove', this.handleMousemove);
		}

		removeListeners() {
			window.removeEventListener('resize', this.handleResize, { passive: true });
			this.dom.container.removeEventListener('mouseup', this.handleMouseup);
			this.dom.container.removeEventListener('mousedown', this.handleMousedown);
			this.dom.container.removeEventListener('mouseleave', this.handleMouseleave);
			this.dom.container.removeEventListener('mousemove', this.handleMousemove);
		}

		init() {
			this.handleResize();
			window.addEventListener('scroll', this.calc);
			window.addEventListener('wheel', this.handleWheel, { passive: false });
			gsap.ticker.add(this.smooth);
			this.addListeners();
			this.disable(); // You may want to enable it based on your specific use case.
		}

		destroy() {
			this.disable();
			window.removeEventListener('scroll', this.calc);
			window.removeEventListener('wheel', this.handleWheel, { passive: false });
			gsap.ticker.remove(this.smooth);
			this.removeListeners();
		}
	}





	constants.isDevice = 'ontouchstart' in window;
	constants.isDevice && document.body.classList.add('is-device');

	document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);



	instances.scroll = new Scroll();
	instances.scroll.init();

	const placeholders = new Placeholders();
	placeholders.init();

	instances.slider = new Slider();
	instances.slider.init();

	//ending

	Barba.Dispatcher.on('transitionCompleted', function () {
		// Se ejecutará después de cada transición de página 
		instances.scroll = new Scroll();
		instances.scroll.init();

		const placeholders = new Placeholders();
		placeholders.init();


		instances.slider = new Slider();
		instances.slider.init();
	});

});

jQuery(function ($) {
	document.querySelectorAll('.transicion-button').forEach(boton => {
		boton.addEventListener('click', () => {
			Barba.Pjax.start();
		});
	});


	var FadeTransition = Barba.BaseTransition.extend({
		start: function () {
			/**
			 * This function is automatically called as soon the Transition starts
			 * this.newContainerLoading is a Promise for the loading of the new container
			 * (Barba.js also comes with an handy Promise polyfill!)
			 */

			// As soon the loading is finished and the old page is faded out, let's fade the new page
			Promise
				.all([this.newContainerLoading, this.fadeOut()])
				.then(this.fadeIn.bind(this));
		},

		fadeOut: function () {
			/**
			 * this.oldContainer is the HTMLElement of the old Container
			 */

			return gsap.to(this.oldContainer, { opacity: 0, delay: 1, duration: 1.5 });
		},

		fadeIn: function () {
			var _this = this;
			var $el = $(this.newContainer);

			abrirOverlay();

			gsap.set(this.oldContainer, { display: 'none' });
			gsap.set($el, { visibility: 'visible', opacity: 0 });

			gsap.to($el, {
				delay: 0.5,
				opacity: 1,
				duration: 1.5,
				onComplete: function () {
					gsap.to(window, { duration: 0.3 });
					cerrarOverlay();
					_this.done();
				}
			});
		}
	});

	/**
	 * Next step, you have to tell Barba to use the new Transition
	 */
	function abrirOverlay() {
		const timeline = gsap.timeline({ defaults: { duration: 1, ease: 'power3.inOut' } });
		timeline.to('.overlay__row', { scaleY: 1 })
			.to('.carga', { opacity: 1 }, '-=0.5');
	}

	function cerrarOverlay() {
		gsap.timeline({ defaults: { duration: 1, ease: 'power3.inOut' } })
			.to('.carga', { opacity: 0 })
			.to('.overlay__row', { delay: 0.5, scaleY: 0 }, '-=0.5');
	}
	Barba.Pjax.getTransition = function () {
		/**
		 * Here you can use your own logic!
		 * For example you can use different Transition based on the current page or link...
		 */

		return FadeTransition;
	};
});

jQuery(function ($) {
	function crearStars() {
		const starContainer = document.querySelector('.galaxy');

		for (let i = 0; i < 1000; i++) {// Crear 1000 estrellas
			const tamStar = Math.floor(Math.random() * 5);
			const opacityStar = Math.random();
			const izqStar = Math.random() * 100 + '%';
			const topStar = Math.random() * 100 + '%';

			const star = document.createElement('div');// Crear un elemento div para representar la estrella
			star.className = 'star';
			star.style.width = star.style.height = tamStar + 'px';
			star.style.opacity = opacityStar;
			star.style.left = izqStar;
			star.style.top = topStar;

			starContainer.appendChild(star);

			// Cambia la opacidad de 750 estrellas
			if (i < 750) {
				gsap.to(star, {
					opacity: 0.2,
					duration: 2,
					repeat: -1,
					yoyo: true,
					delay: Math.random() * 5,
				});

			// Cambia el color de 200 estrellas
				if (i < 200) {
					gsap.to(star, {
						backgroundColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
						duration: 2,
						repeat: -1,
						yoyo: true,
						delay: Math.random() * 5,
					});
				}
			}

		}
	}

	crearStars();

	function crearCometas() {
		const cometaContainer = document.querySelector('.galaxy');

		for (let i = 0; i < 3; i++) {
			setTimeout(() => {
				const cometa = document.createElement('div');// Crear un elemento div para representar el cometa / cometa
				cometa.className = 'cometa';
				cometa.style.left = Math.random() * 100 + '%';
				cometa.style.top = Math.random() * 100 + '%';

				cometaContainer.appendChild(cometa);
			}, Math.random() * 5000);
		}
	}

	crearCometas()

});