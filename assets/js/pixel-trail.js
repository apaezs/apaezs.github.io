// Pixel Cursor Trail Component (Vanilla JS version)
(function() {
  const PIXEL_SIZE = 12;
  const TRAIL_LENGTH = 40;
  const FADE_SPEED = 0.04;
  
  // Create container if it doesn't exist
  let container = document.getElementById('pixel-trail-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'pixel-trail-container';
    document.body.appendChild(container);
  }
  
  let pixels = [];
  let pixelId = 0;
  let lastPosition = { x: 0, y: 0 };
  let animationId = null;
  
  function createPixel(x, y) {
    return {
      id: pixelId++,
      x: x,
      y: y,
      opacity: 1,
      age: 0,
      element: null
    };
  }
  
  function handleMouseMove(e) {
    const x = e.clientX;
    const y = e.clientY;
    
    const dx = x - lastPosition.x;
    const dy = y - lastPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > PIXEL_SIZE) {
      const newPixel = createPixel(x, y);
      const pixelElement = document.createElement('div');
      pixelElement.className = 'pixel-trail-pixel';
      
      const sizeMultiplier = Math.max(0.3, 1 - newPixel.age / 100);
      const currentSize = PIXEL_SIZE * sizeMultiplier;
      
      pixelElement.style.left = (x - currentSize / 2) + 'px';
      pixelElement.style.top = (y - currentSize / 2) + 'px';
      pixelElement.style.width = currentSize + 'px';
      pixelElement.style.height = currentSize + 'px';
      pixelElement.style.opacity = '1';
      pixelElement.style.borderRadius = '0';
      
      container.appendChild(pixelElement);
      newPixel.element = pixelElement;
      
      pixels.push(newPixel);
      if (pixels.length > TRAIL_LENGTH) {
        const oldPixel = pixels.shift();
        if (oldPixel.element && oldPixel.element.parentNode) {
          oldPixel.element.parentNode.removeChild(oldPixel.element);
        }
      }
      
      lastPosition = { x: x, y: y };
    }
  }
  
  function animate() {
    pixels = pixels.map(pixel => {
      pixel.opacity -= FADE_SPEED;
      pixel.age += 1;
      
      if (pixel.element) {
        const sizeMultiplier = Math.max(0.3, 1 - pixel.age / 100);
        const currentSize = PIXEL_SIZE * sizeMultiplier;
        
        pixel.element.style.opacity = pixel.opacity;
        pixel.element.style.width = currentSize + 'px';
        pixel.element.style.height = currentSize + 'px';
        pixel.element.style.left = (pixel.x - currentSize / 2) + 'px';
        pixel.element.style.top = (pixel.y - currentSize / 2) + 'px';
        pixel.element.style.borderRadius = '0';
      }
      
      return pixel;
    }).filter(pixel => {
      if (pixel.opacity <= 0) {
        if (pixel.element && pixel.element.parentNode) {
          pixel.element.parentNode.removeChild(pixel.element);
        }
        return false;
      }
      return true;
    });
    
    animationId = requestAnimationFrame(animate);
  }
  
  function init() {
    document.addEventListener('mousemove', handleMouseMove);
    animate();
  }
  
  function cleanup() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    document.removeEventListener('mousemove', handleMouseMove);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  window.addEventListener('beforeunload', cleanup);
})();

