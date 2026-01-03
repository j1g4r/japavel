import { defineComponent, h } from 'vue';
import { JButton, JCard } from '../jui/components';
import { css, glass, meshGradient, noise } from '../jui/core/styled';
import { theme } from '../jui/core/theme';
import { RouterLink } from 'vue-router';

export default defineComponent({
  name: 'Welcome',
  setup() {
    // Styles
    const rootStyle = css({
      minHeight: '100vh',
      background: meshGradient([
        'hsl(250, 60%, 15%)',
        'hsl(280, 60%, 20%)',
        'hsl(330, 60%, 15%)',
        'hsl(250, 60%, 10%)'
      ]),
      backgroundColor: 'hsl(250, 60%, 10%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#fff',
      padding: '4rem 2rem',
      fontFamily: '"Outfit", sans-serif',
      overflow: 'hidden',
    });

    const heroSection = css({
      maxWidth: '1000px',
      textAlign: 'center',
      marginTop: '8rem',
      marginBottom: '10rem',
      position: 'relative',
      zIndex: 1,
    });

    const badgeStyle = css({
      padding: '0.6rem 1.5rem',
      borderRadius: theme.radius.full,
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      fontSize: '0.875rem',
      fontWeight: '700',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      ...glass(0.1, 8),
      marginBottom: '2rem',
      display: 'inline-block',
    });

    const titleStyle = css({
      fontSize: '5.5rem',
      fontWeight: '900',
      letterSpacing: '-0.06em',
      lineHeight: '0.9',
      marginBottom: '2rem',
      background: 'linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.5) 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      '@media (max-width: 768px)': { fontSize: '3.5rem' },
    });

    const descStyle = css({
       fontSize: '1.25rem',
       maxWidth: '600px',
       margin: '0 auto 3.5rem auto',
       lineHeight: '1.6',
       color: 'rgba(255,255,255,0.7)',
       fontWeight: '500',
    });

    const featureGrid = css({
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 1fr)',
      gap: '2.5rem',
      maxWidth: '1200px',
      width: '100%',
      '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
    });

    const featureCard = css({
       ...glass(0.1, 20),
       padding: '2.5rem',
       borderRadius: theme.radius.xl,
       border: '1px solid rgba(255, 255, 255, 0.1)',
       transition: 'all 0.4s ease',
       ':hover': {
         background: 'rgba(255, 255, 255, 0.15)',
         transform: 'translateY(-12px)',
         boxShadow: theme.shadow.xl,
       }
    });

    const iconBox = (color: string) => css({
       width: '64px',
       height: '64px',
       borderRadius: '1.25rem',
       background: color,
       marginBottom: '1.5rem',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
       boxShadow: `0 8px 16px ${color}44`,
    });

    return () => h('div', { class: rootStyle }, [
      h('div', { class: heroSection }, [
        h('div', { class: badgeStyle }, '✨ Introducing Japavel 2.0'),
        h('h1', { class: titleStyle }, 'Build Beautifully. Ship Faster.'),
        h('p', { class: descStyle }, 'The ultimate full-stack boilerplate with a premium TypeScript design system, built for high-performance applications.'),
        h('div', { class: css({ display: 'flex', gap: '1.5rem', justifyContent: 'center' }) }, [
          h(RouterLink, { to: '/dashboard' }, () => 
            h(JButton, { variant: 'solid', size: 'xl' }, () => 'Get Started Free')
          ),
          h(JButton, { variant: 'glass', size: 'xl', color: 'neutral' }, () => 'View Documentation')
        ])
      ]),

      h('div', { class: featureGrid }, [
        { title: 'Extreme Performance', desc: 'Optimized styling engine for buttery smooth 60fps interactions.', color: theme.colors.brand.primary },
        { title: 'Premium Aesthetics', desc: 'Modern design tokens featuring glassmorphism and vibrant gradients.', color: theme.colors.brand.secondary },
        { title: 'Rapid Scaffolding', desc: 'CLI tools to generate components and modules in seconds.', color: theme.colors.brand.accent }
      ].map(f => h('div', { class: featureCard }, [
        h('div', { class: iconBox(f.color) }, '⚡'),
        h('h3', { class: css({ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }) }, f.title),
        h('p', { class: css({ color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }) }, f.desc)
      ])))
    ]);
  }
});
