const about = document.querySelector('.Header');
const desc = document.querySelector('.Desc');
const text = desc.innerHTML.trim();

gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger);


gsap.to(".IMG1", {
  yPercent: 20,    // tune amount
  ease: "none",
  scrollTrigger: {
    trigger: ".IMG1",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});

gsap.to(".IMG2", {
  yPercent: 40,  
  ease: "none",
  scrollTrigger: {
    trigger: ".IMG2",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});

const proxy = { skew: 0 };
const clamp = gsap.utils.clamp(-20, 20);
const skewSetter = gsap.quickSetter(".IMG1, .IMG2", "skewY", "deg");

ScrollTrigger.create({
  onUpdate(self) {
    const v = clamp(self.getVelocity() / -100);
    if (Math.abs(v) > Math.abs(proxy.skew)) {
      proxy.skew = v;
      gsap.to(proxy, {
        skew: 0,
        duration: 0.8,
        ease: "power2",
        overwrite: true,
        onUpdate: () => skewSetter(proxy.skew)
      });
    }
  }
});

const sentences = text.split(/([.?!])/).filter(s => s.trim().length > 4);
desc.innerHTML = sentences.map(s => `<span class="desc-part">${s}</span>`).join(' ');
const parts = document.querySelectorAll('.desc-part');

gsap.to(parts[0], {
  duration: 1,
  scrambleText: {
    text: "Loic Johl is a Canadian artist whose prime goal in his art is to innovate and 'bring listeners to another world'.",
    chars: "upperAndLowerCase",
    speed: 0.4,
    newClass: "scrambled-text"
  },
  ease: "power1.out"
});

gsap.to(parts[1], {
  duration: 1,
  scrambleText: {
    text: "Primarily a bassist, who has been playing since he was a child, alongside teaching himself how to produce and mix his own music around a similar age, Loic has carefully crafted his sound over years, linking to his own self-development as a human and his technical proficiency.",
    chars: "upperAndLowerCase",
    speed: 0.9,
    newClass: "scrambled-text"
  },
  ease: "power1.out"
});

gsap.to(parts[2], {
  duration: 1,
  scrambleText: {
    text: "His music is almost entirely made with the bass, using creative ways to layer this instrument alongside luscious vocals and introspective lyrics, creating a unique experience for listeners.",
    chars: "upperAndLowerCase",
    speed: 1.3,
    newClass: "scrambled-text"
  },
  ease: "power1.out"
});

gsap.to(parts[3], {
  duration: 1,
  scrambleText: {
    text: "Anyone who is an outcast, alternative, struggles with their own mind, the world around them and prides themselves on non-conformity will find solace in Loic Johl’s music.",
    chars: "upperAndLowerCase",
    speed: 2.5,
    newClass: "scrambled-text"
  },
  ease: "power1.out"
});

gsap.from(desc, {
  opacity: 0,
  duration: 1,
  y: 100,
  scale: 1.8,
  ease: "power3.out"
});

gsap.from(about, {
  duration: 1,
  x: -300,
  ease: "back.out(0.5)",
  yoyo: true
});
