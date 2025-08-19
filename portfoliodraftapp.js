// Text scramble animation
const title = document.querySelector('h1');
const originalText = title.textContent;

gsap.to(title, {
  duration: 1.5,
  scrambleText: {
    text: originalText,
    chars: "upperAndLowerCase",
    revealDelay: 0.2,
    speed: 0.2,
    newClass: "scrambled-text"
  },
  ease: "power2.inOut",
});

gsap.from(title, {
  duration: 1.5,
  y: -100,
  opacity: 0,
  ease: "power.inOut",
    });
    

const images = document.querySelectorAll('.carousel-image')
const radius = 242


const progress = {
  value: 0.975
}
const carousel = document.querySelector('.carousel')

Observer.create({
  target: carousel,
  type: "wheel,pointer",
  onPress: (self) => {
    carousel.style.cursor = 'grabbing'
  },
  onRelease: (self) => {
    carousel.style.cursor = 'grab'
  },
  onChange: (self) => {
    gsap.killTweensOf(progress)
    const p = self.event.type === 'wheel' ? self.deltaY * -.0005 : self.deltaX * .05
    gsap.to(progress, {
      duration: 3,
      ease: 'power4.out',
      value: `+=${p}`
    })
  }
})

const animate = () => {
  images.forEach((image, index) => {
    const theta = index / images.length - progress.value
    const x = -Math.sin(theta * Math.PI * 2) * radius
    const y = Math.cos(theta * Math.PI * 2) * radius
    image.style.transform = `translate3d(${x}px, 0px, ${y}px) rotateY(${360 * -theta }deg)`
  })
}
gsap.ticker.add(animate)

const externalLinks = {
  'YouTube': 'https://www.youtube.com/@loicjohl',
  'Spotify': 'https://open.spotify.com/artist/7iegIk70UybEXI5hSwlOP9?si=rt7z9Ph7QguLgs_nfTBFGw',
  'Apple Music': 'https://music.apple.com/ca/artist/loic-johl/1448267842'
};

const pageMap = {
  'About & Contact': 'about.html',
  'Live Events': 'liveevents.html',
  'Contact': 'contact.html',
  'Creations': 'creations.html'
};

images.forEach((image) => {
  image.addEventListener('click', () => {
    const text = image.textContent.trim();
    if (externalLinks[text]) {
      window.open(externalLinks[text], '_blank');
      return;
    }
    const page = pageMap[text];
    if (page) {
      window.location.href = page;
    }
  });
});

