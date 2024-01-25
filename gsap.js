const slider = document.querySelector('.l-slider');
const sections = gsap.utils.toArray('.l-slider section');
const verticalSlider = document.querySelector('.js-vertical-slider');

function getScrollAmount() {
	let sliderWidth = slider.scrollWidth;
	return -(sliderWidth - window.innerWidth);
}

function getScrollImages() {
	let sliderHeight = slider.scrollHeight;
	return -(sliderHeight - window.innerHeight)/2;
}

let tl_init = gsap.timeline();

let tl = gsap.timeline({
    defaults:{
        ease: "none"
    }, 
    scrollTrigger: {
        trigger: slider,
        pin: true,
        scrub: 2,
        end: ()=> "+=" + slider.offsetWidth,
    },
});

tl.to(slider, {
    x: getScrollAmount,
    duration: 3,
}, "<");

// Update on window resize
let windowWidth = $(window).innerWidth();
window.addEventListener("resize", function () {
  if (windowWidth !== $(window).innerWidth()) {
    windowWidth = $(window).innerWidth();
  }
});

//Animation for init
//Whoa text
const myText = new SplitType("#js-whoa-text");
tl_init
.from(".galaxy .nebula", {
    duration: .5, 
    opacity: 0,
    stagger: 0.3,
},"<")
.to('#js-whoa-text .char', {
    y: 0,
    stagger: 0.05,
    duration: .03
})
    .from('.js-item-init-up', { opacity: 0, scale: 0.5, stagger: 0.1 })
    .from('.js-image-pop-init', { opacity: 0, scale: 2, stagger: 0.05 })
tl_init.play()

//Animation for sections



sections.forEach((stop, index)=>{
    tl
        //Animation for images scrooll
        .to(".m-scroll-image", {
            duration: .3,
            y: getScrollImages,
            stagger: 0.01,
            scrollTrigger: {
                id: 'vertical-scroll',
                trigger: ".js-vertical-slider",
                start: "center right-=200",
                end: "center left",
                containerAnimation: tl,
                scrub: true,
                //markers: true,
            }
        })
        //Animation for item list of nav
        .to(".l-nav", {
            duration: .3,
            backgroundColor: "transparent", 
            ease: "power2.inOut",
            scrollTrigger: {
                id: 'nav',
                trigger: ".l-section--white",
                start: "left right",
                end: "center left",
                containerAnimation: tl,
                scrub: true,
            }
        })

        .to('.m-logo', {
            duration: 3,                  
            backgroundImage: "url('assets/images/png/logo-azul.png')" ,
            ease: "power2",
            scrollTrigger: {
                id: 'logo',
                trigger: ".l-section--white",
                start: "left right",
                end: "center left",
                containerAnimation: tl,
                scrub: true,
            },
            onComplete: () => {
                // Callback que se ejecuta al completar la animación
                // Vuelve al color original del texto
                gsap.to(".m-logo", {
                  duration: 3,          // Duración de la animación de retorno (en segundos)
                  backgroundImage: "url('assets/images/png/logo-Add-Astra.png')" ,
                  ease: "power2.inOut",  // Tipo de facilidad (easing) para la animación de retorno,
                  scrollTrigger: {
                    trigger: ".l-section--black",
                    start: "left right",
                    end: "right right",
                    containerAnimation: tl,
                    scrub: .1,
                    //markers: true,
                },
                });
              }
        })

        .to(".l-nav .m-list-item a" , {
            duration: .2,
            color: "#131c46", 
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: ".l-section--white",
                start: "left right",
                end: "right right",
                containerAnimation: tl,
                scrub: .1,
            },
            onComplete: () => {
                // Callback que se ejecuta al completar la animación
                // Vuelve al color original del texto
                gsap.to(".l-nav .m-list-item a", {
                  duration: 1,          // Duración de la animación de retorno (en segundos)
                  color: "#fff", // Color original del texto
                  ease: "power2.inOut",  // Tipo de facilidad (easing) para la animación de retorno,
                  scrollTrigger: {
                    trigger: ".l-section--black",
                    start: "left right",
                    end: "right right",
                    containerAnimation: tl,
                    scrub: .1,
                    },
                });
              }
        })

        .fromTo(".js-animation-top", {
            y: 10, 
            opacity: 0,
        },
        {
            duration: 1,
            y: '-1em',
            opacity: 1,
            stagger: 1,
            scrollTrigger: {
                trigger: ".js-content-top",
                start: "left right",
                end: "right right",
                containerAnimation: tl,
                scrub: .1,
            },
        })

        .fromTo(".js-animation-bottom", {
            y: -10, 
            opacity: 0,
        },
        {
            duration: 1,
            y: '1em',
            opacity: 1,
            stagger: 1,
            scrollTrigger: {
                trigger: ".js-content-bottom",
                start: "left right",
                end: "right right",
                containerAnimation: tl,
                scrub: .1,
            },
        })

        const whoaTextScroll = document.querySelectorAll('.js-whoa-text-scroll');
        whoaTextScroll.forEach(text=>{
            const myText = new SplitType(text);
            const charsInSection = text.querySelectorAll('.char');
            gsap.to(charsInSection, {
                y: 0,
                stagger: 0.05,
                delay: 0.2,
                duration: .03,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: text,
                    start: "center right",
                    end: "center center",
                    containerAnimation: tl,
                    scrub: true,
                    //toggleActions: 'play none none reverse',
                    //markers: true,
                }
            })
        })


        const scrollTriggerBg = ScrollTrigger.create({
            trigger: "#js-trigger-bg",
                start: "left+=200 right",
                end: "center left",
                containerAnimation: tl,
                scrub: true,
                //toggleActions: 'play none none reverse',
                markers: true,
        })

        gsap.fromTo(".l-section__scroll-bg", {
            clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
        }, 
        {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            scrollTrigger: {
                ...scrollTriggerBg.vars,
            }
        })

        gsap.to(".m-card-service", { 
            backgroundColor: "#dcdcdc",
            scrollTrigger: {
                ...scrollTriggerBg.vars,
            }
        })
} )

//smooth scroll
const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// Preloader
document.addEventListener("DOMContentLoaded", function () {
    // Ocultar el preloader una vez que la página esté completamente cargada
    gsap.to("#preloader", { opacity: 0,zIndex: -100, duration: 1, onComplete: showContent });
});

function showContent() {
    // Mostrar el contenido de la página una vez que el preloader se haya desvanecido
    gsap.to("#content", { opacity: 1, duration: 0.3 });
}
