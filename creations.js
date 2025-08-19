
gsap.registerPlugin(ScrollTrigger);


try { history.scrollRestoration = "manual"; } catch(_) {}
window.scrollTo(0, 0);

gsap.to(".intro-splash", {
  autoAlpha: 0,
  scale: 0.96,
  ease: "power2.out",
  scrollTrigger: {
    trigger: document.body,
    start: "top top",
    end: "top+=320 top",
    scrub: true
  }
});

const sections = gsap.utils.toArray(".slide");
if (sections.length) {
  sections.forEach((section) => {
    const textEls  = Array.from(section.querySelectorAll(".slide__heading, .slide__text, .Mdesc, .Edesc"));
    const mediaEls = [
      section.querySelector(".slide__img-cont") || section.querySelector(".slide__img"),
      section.querySelector(".video")
    ].filter(Boolean);

    if (textEls.length)  gsap.set(textEls,  { x: -70, autoAlpha: 0 });
    if (mediaEls.length) gsap.set(mediaEls, { x:  70, autoAlpha: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "power2.out", duration: 0.9 },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=140%",
        pin: true,
        scrub: 1.1,
        anticipatePin: 1
      }
    });

    if (textEls.length)  tl.to(textEls,  { x: 0, autoAlpha: 1, stagger: 0.1, duration: 0.8 }, 0.1);
    if (mediaEls.length) tl.to(mediaEls, { x: 0, autoAlpha: 1, duration: 0.9 }, "<0.15");

 
    const driftTarget = section.querySelector(".slide__img") || section.querySelector(".video");
    if (driftTarget) tl.to(driftTarget, { xPercent: -6, ease: "none", duration: 1.2 }, 0);
  });
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  ScrollTrigger.getAll().forEach(st => st.kill());
  gsap.set(".intro-splash", { autoAlpha: 0 });
  gsap.set(".slide__heading, .slide__text, .Mdesc, .Edesc, .slide__img-cont, .slide__img, .video", {
    clearProps: "all", autoAlpha: 1
  });
}

window.addEventListener("load", () => ScrollTrigger.refresh());
