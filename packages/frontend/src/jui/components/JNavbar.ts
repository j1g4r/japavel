import { defineComponent, h, PropType } from 'vue';
import { css, glass } from '../core/styled';
import { theme } from '../core/theme';
import { RouterLink } from 'vue-router';
import { JButton } from './index';

export default defineComponent({
  name: 'JNavbar',
  props: {
    items: { type: Array as PropType<any[]>, default: () => [] }
  },
  setup(props) {
    const navStyle = css({
      position: 'fixed',
      top: '1.25rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '1200px',
      height: '72px',
      ...glass(0.7, 24),
      borderRadius: theme.radius.xl,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2.5rem',
      zIndex: 1000,
      border: `1px solid ${theme.surfaces.border}`,
      boxShadow: theme.shadow.lg,
    });

    const logoStyle = css({
       fontSize: '1.75rem',
       fontWeight: '900',
       background: `linear-gradient(135deg, ${theme.colors.brand.primary}, ${theme.colors.brand.secondary})`,
       WebkitBackgroundClip: 'text',
       WebkitTextFillColor: 'transparent',
       textDecoration: 'none',
    });

    const linkStyle = css({
       color: theme.colors.neutral.gray600,
       fontWeight: '700',
       textDecoration: 'none',
       fontSize: '0.9375rem',
       transition: 'all 0.3s ease',
       ':hover': { color: theme.colors.brand.primary }
    });

    return () => h('nav', { class: navStyle }, [
      h(RouterLink, { to: '/', class: logoStyle }, () => 'Japavel'),
      h('div', { class: css({ display: 'flex', gap: '2rem' }) }, 
        props.items.map(item => h(RouterLink, { to: item.href, class: linkStyle }, () => item.label))
      ),
      h(JButton, { variant: 'solid', size: 'md' }, () => 'Join Beta')
    ]);
  }
});
