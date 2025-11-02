import { describe, it, expect } from 'vitest';
import {
  fadeInVariants,
  fadeInUpVariants,
  staggerContainerVariants,
  listItemVariants,
  scaleInVariants,
  slideInLeftVariants,
  slideInRightVariants,
  hoverScaleVariants,
} from '../../src/utils/animations/variants';
import {
  delayedTransition,
  springTransition,
  smoothTransition,
  fastTransition,
} from '../../src/utils/animations/transitions';
import {
  getConditionalVariants,
  getConditionalTransition,
  getConditionalAnimation,
} from '../../src/utils/animations/helpers';

describe('Animation Variants', () => {
  describe('fadeInVariants', () => {
    it('has correct structure', () => {
      expect(fadeInVariants).toHaveProperty('hidden');
      expect(fadeInVariants).toHaveProperty('visible');
    });

    it('starts with opacity 0', () => {
      expect(fadeInVariants.hidden).toEqual({ opacity: 0 });
    });

    it('ends with opacity 1', () => {
      expect(fadeInVariants.visible).toHaveProperty('opacity', 1);
    });
  });

  describe('fadeInUpVariants', () => {
    it('has correct structure', () => {
      expect(fadeInUpVariants).toHaveProperty('hidden');
      expect(fadeInUpVariants).toHaveProperty('visible');
    });

    it('starts with opacity 0 and y offset', () => {
      expect(fadeInUpVariants.hidden).toEqual({ opacity: 0, y: 20 });
    });

    it('ends with opacity 1 and y at 0', () => {
      expect(fadeInUpVariants.visible).toHaveProperty('opacity', 1);
      expect(fadeInUpVariants.visible).toHaveProperty('y', 0);
    });

    it('has transition configuration', () => {
      const visible = fadeInUpVariants.visible as any;
      expect(visible).toHaveProperty('transition');
      expect(visible.transition).toHaveProperty('duration');
      expect(visible.transition).toHaveProperty('ease');
    });
  });

  describe('staggerContainerVariants', () => {
    it('has correct structure', () => {
      expect(staggerContainerVariants).toHaveProperty('hidden');
      expect(staggerContainerVariants).toHaveProperty('visible');
    });

    it('has stagger children configuration', () => {
      const visible = staggerContainerVariants.visible as any;
      expect(visible).toHaveProperty('transition');
      expect(visible.transition).toHaveProperty('staggerChildren');
    });
  });

  describe('listItemVariants', () => {
    it('has correct structure', () => {
      expect(listItemVariants).toHaveProperty('hidden');
      expect(listItemVariants).toHaveProperty('visible');
    });

    it('animates from hidden to visible', () => {
      expect(listItemVariants.hidden).toHaveProperty('opacity', 0);
      expect(listItemVariants.visible).toHaveProperty('opacity', 1);
    });
  });

  describe('scaleInVariants', () => {
    it('has correct structure', () => {
      expect(scaleInVariants).toHaveProperty('hidden');
      expect(scaleInVariants).toHaveProperty('visible');
    });

    it('scales from 0.8 to 1', () => {
      expect(scaleInVariants.hidden).toHaveProperty('scale', 0.8);
      expect(scaleInVariants.visible).toHaveProperty('scale', 1);
    });
  });

  describe('slideInLeftVariants', () => {
    it('has correct structure', () => {
      expect(slideInLeftVariants).toHaveProperty('hidden');
      expect(slideInLeftVariants).toHaveProperty('visible');
    });

    it('slides from left to center', () => {
      expect(slideInLeftVariants.hidden).toHaveProperty('x');
      expect(slideInLeftVariants.visible).toHaveProperty('x', 0);
    });
  });
});

describe('Animation Transitions', () => {
  describe('delayedTransition', () => {
    it('creates transition with specified delay', () => {
      const transition = delayedTransition(0.5);

      expect(transition).toHaveProperty('delay', 0.5);
      expect(transition).toHaveProperty('duration');
      expect(transition).toHaveProperty('ease');
    });

    it('works with zero delay', () => {
      const transition = delayedTransition(0);

      expect(transition).toHaveProperty('delay', 0);
    });

    it('works with large delay', () => {
      const transition = delayedTransition(2.5);

      expect(transition).toHaveProperty('delay', 2.5);
    });
  });

  describe('springTransition', () => {
    it('has spring physics properties', () => {
      const transition = springTransition;

      expect(transition).toHaveProperty('type', 'spring');
      expect(transition).toHaveProperty('stiffness');
      expect(transition).toHaveProperty('damping');
    });

    it('has sensible spring values', () => {
      expect(springTransition.stiffness).toBeGreaterThan(0);
      expect(springTransition.damping).toBeGreaterThan(0);
      expect(springTransition.damping).toBeLessThan(springTransition.stiffness!);
    });
  });

  describe('smoothTransition', () => {
    it('has ease properties', () => {
      const transition = smoothTransition;

      expect(transition).toHaveProperty('duration');
      expect(transition).toHaveProperty('ease');
    });

    it('has reasonable duration', () => {
      expect(smoothTransition.duration).toBeGreaterThan(0);
      expect(smoothTransition.duration).toBeLessThan(2); // Not too slow
    });
  });
});

describe('Animation Helpers', () => {
  describe('getConditionalVariants', () => {
    const testVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };

    it('returns original variants when reduced motion is false', () => {
      const result = getConditionalVariants(false, testVariants);

      expect(result).toEqual(testVariants);
    });

    it('returns empty variants when reduced motion is true', () => {
      const result = getConditionalVariants(true, testVariants);

      expect(result).toEqual({
        hidden: {},
        visible: {},
      });
    });

    it('preserves variant structure', () => {
      const result = getConditionalVariants(false, testVariants);

      expect(result).toHaveProperty('hidden');
      expect(result).toHaveProperty('visible');
    });
  });

  describe('getConditionalTransition', () => {
    const testTransition = {
      duration: 0.5,
      ease: 'easeOut',
    };

    it('returns original transition when reduced motion is false', () => {
      const result = getConditionalTransition(false, testTransition);

      expect(result).toEqual(testTransition);
    });

    it('returns instant transition when reduced motion is true', () => {
      const result = getConditionalTransition(true, testTransition);

      expect(result).toHaveProperty('duration', 0);
    });

    it('handles transition without duration', () => {
      const transition = { ease: 'easeOut' };
      const result = getConditionalTransition(true, transition);

      expect(result).toHaveProperty('duration', 0);
    });
  });

  describe('getConditionalAnimation', () => {
    const testAnimation = {
      scale: 1.05,
      rotate: 5,
    };

    it('returns original animation when reduced motion is false', () => {
      const result = getConditionalAnimation(false, testAnimation);

      expect(result).toEqual(testAnimation);
    });

    it('returns empty object when reduced motion is true', () => {
      const result = getConditionalAnimation(true, testAnimation);

      expect(result).toEqual({});
    });

    it('handles complex animations', () => {
      const complexAnimation = {
        scale: 1.2,
        rotate: 180,
        x: 100,
        opacity: 0.5,
      };

      const resultEnabled = getConditionalAnimation(false, complexAnimation);
      const resultDisabled = getConditionalAnimation(true, complexAnimation);

      expect(resultEnabled).toEqual(complexAnimation);
      expect(resultDisabled).toEqual({});
    });
  });
});

describe('Animation Integration', () => {
  it('helpers work together correctly', () => {
    const prefersReducedMotion = false;
    const variants = getConditionalVariants(prefersReducedMotion, fadeInUpVariants);
    const transition = getConditionalTransition(prefersReducedMotion, delayedTransition(0.2));

    expect(variants).toEqual(fadeInUpVariants);
    expect(transition).toHaveProperty('delay', 0.2);
  });

  it('respects reduced motion across all helpers', () => {
    const prefersReducedMotion = true;
    const variants = getConditionalVariants(prefersReducedMotion, fadeInUpVariants);
    const transition = getConditionalTransition(prefersReducedMotion, springTransition);
    const animation = getConditionalAnimation(prefersReducedMotion, { scale: 1.1 });

    expect(variants).toEqual({ hidden: {}, visible: {} });
    expect(transition).toHaveProperty('duration', 0);
    expect(animation).toEqual({});
  });

  it('supports chaining transitions', () => {
    const delayed = delayedTransition(0.3);
    const conditional = getConditionalTransition(false, delayed);

    expect(conditional).toHaveProperty('delay', 0.3);
    expect(conditional).toHaveProperty('duration');
  });

  it('handles multiple variant types', () => {
    const allVariants = [
      fadeInVariants,
      fadeInUpVariants,
      staggerContainerVariants,
      scaleInVariants,
      slideInLeftVariants,
    ];

    allVariants.forEach(variant => {
      expect(variant).toHaveProperty('hidden');
      expect(variant).toHaveProperty('visible');
    });
  });
});

describe('Accessibility', () => {
  it('provides motion-safe alternatives', () => {
    const reduced = true;
    const variants = getConditionalVariants(reduced, fadeInUpVariants);
    const transition = getConditionalTransition(reduced, springTransition);

    // Should have no motion
    expect(variants.hidden).toEqual({});
    expect(variants.visible).toEqual({});
    expect(transition.duration).toBe(0);
  });

  it('respects user motion preferences', () => {
    const testCases = [
      { prefersReduced: true, shouldAnimate: false },
      { prefersReduced: false, shouldAnimate: true },
    ];

    testCases.forEach(({ prefersReduced, shouldAnimate }) => {
      const animation = getConditionalAnimation(prefersReduced, { scale: 1.1 });

      if (shouldAnimate) {
        expect(animation).toEqual({ scale: 1.1 });
      } else {
        expect(animation).toEqual({});
      }
    });
  });
});
