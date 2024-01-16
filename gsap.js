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
tl_init.to('#js-whoa-text .char', {
    y: 0,
    stagger: 0.05,
    duration: .03
},"<")
    .from('.js-item-init-up', { opacity: 0, scale: 0.5, stagger: 0.1 })
    .from('.js-image-pop-init', { opacity: 0, scale: 2, stagger: 0.05 })
tl_init.play()

//Animation for sections

sections.forEach((stop, index)=>{
    tl
        .from(stop.querySelector('.m-content'), {
            yPercent: -50,
            opacity: 0,
            scrollTrigger: {
                trigger: stop.querySelector('.m-content'),
                start: "left center",
                end: "center center",
                containerAnimation: tl,
                scrub: true,
            }
        })
        //Animation for images scrooll
        gsap.to(".m-scroll-image", {
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
                markers: true,
            }
        })
        //Animation for item list of nav
        gsap.to(".l-nav", {
            duration: .3,
            backgroundColor: "transparent", 
            ease: "power2.inOut",
            scrollTrigger: {
                id: 'nav',
                trigger: ".l-section-white",
                start: "left right",
                end: "center left",
                containerAnimation: tl,
                scrub: true,
            }
        })

        gsap.to('.m-logo', {
            duration: 3,                  
            backgroundImage: "url('assets/images/png/logo-azul.png')" ,
            ease: "power2",
            scrollTrigger: {
                id: 'logo',
                trigger: ".l-section-white",
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
                    trigger: ".l-section-black",
                    start: "left right",
                    end: "right right",
                    containerAnimation: tl,
                    scrub: .1,
                    //markers: true,
                },
                });
              }
        })

        gsap.to(".l-nav .m-list-item a" , {
            duration: .2,
            color: "#131c46", 
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: ".l-section-white",
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
                    trigger: ".l-section-black",
                    start: "left right",
                    end: "right right",
                    containerAnimation: tl,
                    scrub: .1,
                    },
                });
              }
        })

        const sections = document.querySelectorAll('.js-whoa-text-scroll');
        sections.forEach(section=>{
            const myText = new SplitType(section);
            const charsInSection = section.querySelectorAll('.char');
            gsap.to(charsInSection, {
                y: 0,
                stagger: 0.05,
                delay: 0.2,
                duration: .03,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: section,
                    start: "center right",
                    end: "center center",
                    containerAnimation: tl,
                    scrub: 0.3,
                   // markers: true,
                }
            })
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
                    scrub: 0.3,
                    //markers: true,
                }
            })
        })
} )




//smooth scroll
const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)