import { defineComponent, h } from 'vue';
import { JLayout, JCard, JButton } from '../jui/components';
import { css, glass, meshGradient } from '../jui/core/styled';
import { theme } from '../jui/core/theme';

export default defineComponent({
  name: 'Dashboard',
  setup() {
    const stats = [
      { label: 'Total Projects', value: '12', color: theme.colors.brand.primary, desc: '+2 this month' },
      { label: 'Active Users', value: '1,234', color: theme.colors.brand.secondary, desc: '98% retention' },
      { label: 'System Health', value: '98%', color: theme.colors.status.success, desc: 'Operational' },
      { label: 'Uptime', value: '99.9%', color: theme.colors.status.info, desc: 'Last 30 days' },
    ];

    // Styles
    const headerSection = css({
      marginBottom: '3rem',
    });

    const greetingStyle = css({
      fontSize: '2.5rem',
      fontWeight: '900',
      letterSpacing: '-0.05em',
      color: theme.colors.neutral.gray900,
      marginBottom: '0.5rem',
    });

    const subtitleStyle = css({
       fontSize: '1.125rem',
       color: theme.colors.neutral.gray500,
       fontWeight: '500',
    });

    const statsGrid = css({
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 1fr)',
      gap: '2rem',
      marginBottom: '3rem',
      '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
      '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(4, 1fr)' },
    });

    const statValue = (color: string) => css({
      fontSize: '2.5rem',
      fontWeight: '900',
      color: color,
      letterSpacing: '-0.04em',
    });

    const statLabel = css({
      fontSize: '0.875rem',
      fontWeight: '700',
      color: theme.colors.neutral.gray400,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginBottom: '0.25rem',
    });

    const statDesc = css({
      fontSize: '0.8125rem',
      color: theme.colors.neutral.gray500,
      marginTop: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
    });

    const mainGrid = css({
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2rem',
      '@media (min-width: 1024px)': { gridTemplateColumns: '3fr 2fr' },
    });

    const cardTitle = css({
      fontSize: '1.5rem',
      fontWeight: '900',
      letterSpacing: '-0.03em',
      color: theme.colors.neutral.gray900,
      marginBottom: '1.5rem',
    });

    const activityItem = css({
      display: 'flex',
      gap: '1.25rem',
      padding: '1.25rem',
      borderRadius: theme.radius.lg,
      transition: 'all 0.3s ease',
      ':hover': {
        background: 'rgba(255,255,255,0.5)',
        transform: 'translateX(8px)',
      }
    });

    const logViewer = css({
      background: 'hsl(210, 20%, 8%)',
      borderRadius: theme.radius.xl,
      padding: '1.5rem',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '0.875rem',
      height: '400px',
      overflowY: 'auto',
      color: 'hsl(210, 20%, 90%)',
      boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
      border: '1px solid rgba(255,255,255,0.1)',
    });

    return () => {
      return h(JLayout, null, {
        default: () => [
          // Header
          h('div', { class: headerSection }, [
            h('h1', { class: greetingStyle }, 'Welcome back, John'),
            h('p', { class: subtitleStyle }, 'Here is what happening with your projects today.')
          ]),

          // Stats
          h('div', { class: statsGrid }, 
            stats.map(stat => h(JCard, { variant: 'glass', padding: 'xl' }, {
              default: () => [
                h('div', { class: statLabel }, stat.label),
                h('div', { class: statValue(stat.color) }, stat.value),
                h('div', { class: statDesc }, [
                  h('span', { style: { color: theme.colors.status.success } }, '↑'),
                  stat.desc
                ])
              ]
            }))
          ),

          // Main Content
          h('div', { class: mainGrid }, [
            // Activity
            h(JCard, { padding: 'xl' }, {
               header: () => h('h3', { class: cardTitle }, 'Recent Activity'),
               default: () => h('div', { class: css({ display: 'flex', flexDirection: 'column', gap: '0.5rem' }) }, 
                 Array.from({ length: 5 }).map((_, i) => h('div', { class: activityItem }, [
                   h('div', { class: css({ 
                     width: '48px', height: '48px', borderRadius: '12px', 
                     background: i % 2 === 0 ? theme.colors.brand.primary : theme.colors.brand.secondary,
                     display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.25rem'
                   }) }, 'A'),
                   h('div', {}, [
                     h('p', { class: css({ fontWeight: '700', color: theme.colors.neutral.gray800 }) }, 
                       `Project ${['Alpha', 'Beta', 'Gamma'][i % 3]} update complete`
                     ),
                     h('span', { class: css({ fontSize: '0.875rem', color: theme.colors.neutral.gray400 }) }, 
                       `${i + 2} hours ago • John Doe`
                     )
                   ])
                 ]))
               )
            }),

            // Logs
            h(JCard, { padding: 'xl', variant: 'glass' }, {
              header: () => h('h3', { class: cardTitle }, 'System Intelligence'),
              default: () => h('div', { class: logViewer }, 
                Array.from({ length: 12 }).map((_, i) => h('div', { class: css({ marginBottom: '0.75rem', display: 'flex', gap: '1rem' }) }, [
                  h('span', { class: css({ color: theme.colors.brand.primaryLight, opacity: 0.6 }) }, `12:45:0${i}`),
                  h('span', { class: css({ color: theme.colors.status.success, fontWeight: '800' }) }, 'EXEC'),
                  h('span', { class: css({ opacity: 0.9 }) }, `Deployment of service mesh node #${i} successful.`)
                ]))
              )
            })
          ])
        ]
      });
    };
  }
});
