// Mobile Enhancements for MindWeaver
class MobileEnhancements {
  constructor() {
    this.isMobile = this.detectMobile();
    this.init();
  }

  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  init() {
    if (this.isMobile) {
      this.setupMobileOptimizations();
      this.setupTouchGestures();
      this.setupViewportOptimizations();
    }
  }

  setupMobileOptimizations() {
    // Add mobile-specific CSS classes
    document.body.classList.add('mobile-device');
    
    // Optimize font sizes for mobile
    const style = document.createElement('style');
    style.textContent = `
      .mobile-device {
        font-size: 16px;
        -webkit-text-size-adjust: 100%;
      }
      
      .mobile-device .container {
        padding-left: 1rem;
        padding-right: 1rem;
      }
      
      .mobile-device textarea {
        font-size: 16px; /* Prevents zoom on iOS */
      }
      
      .mobile-device button {
        min-height: 44px; /* Touch-friendly size */
      }
      
      @media (max-width: 768px) {
        .mobile-device .max-w-4xl {
          max-width: 100%;
        }
        
        .mobile-device .max-w-[80%] {
          max-width: 90%;
        }
      }
    `;
    document.head.appendChild(style);
  }

  setupTouchGestures() {
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe(touchStartY, touchEndY);
    }, { passive: true });
  }

  handleSwipe(startY, endY) {
    const swipeThreshold = 50;
    const diff = startY - endY;

    if (Math.abs(diff) > swipeThreshold) {
      // Handle swipe gestures if needed
      if (diff > 0) {
        // Swipe up
        console.log('Swipe up detected');
      } else {
        // Swipe down
        console.log('Swipe down detected');
      }
    }
  }

  setupViewportOptimizations() {
    // Prevent zoom on input focus (iOS)
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('touchstart', () => {
        input.style.fontSize = '16px';
      });
    });

    // Optimize scrolling
    document.body.style.touchAction = 'pan-y';
    document.body.style.webkitOverflowScrolling = 'touch';
  }

  // Add haptic feedback if available
  hapticFeedback() {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }
}

// Initialize mobile enhancements
let mobileEnhancements;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    mobileEnhancements = new MobileEnhancements();
  });
} else {
  mobileEnhancements = new MobileEnhancements();
}

// Make it globally available
window.mobileEnhancements = mobileEnhancements;
