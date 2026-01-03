import { defineComponent, h } from 'vue';
import { JLayout, JCard } from '../jui/components';
import { css } from '../jui/core/styled';
import { theme } from '../jui/core/theme';

export default defineComponent({
  name: 'Analytics',
  setup() {
    // Mock analytics data
    const metrics = [
      { label: 'Page Views', value: '24,567', change: '+12.5%', trend: 'up' },
      { label: 'Unique Visitors', value: '8,234', change: '+8.3%', trend: 'up' },
      { label: 'Bounce Rate', value: '32.1%', change: '-2.4%', trend: 'down' },
      { label: 'Avg Session', value: '4m 32s', change: '+15.2%', trend: 'up' },
    ];

    const chartData = [65, 78, 52, 91, 43, 87, 73, 95, 62, 81, 45, 88];

    // Styles
    const pageTitle = css({
      fontSize: '2.5rem',
      fontWeight: '900',
      letterSpacing: '-0.05em',
      color: theme.colors.neutral.gray900,
      marginBottom: '0.5rem',
    });

    const subtitle = css({
      fontSize: '1.125rem',
      color: theme.colors.neutral.gray500,
      fontWeight: '500',
      marginBottom: '3rem',
    });

    const metricsGrid = css({
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 1fr)',
      gap: '1.5rem',
      marginBottom: '3rem',
      '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
      '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(4, 1fr)' },
    });

    const metricLabel = css({
      fontSize: '0.875rem',
      fontWeight: '700',
      color: theme.colors.neutral.gray400,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginBottom: '0.5rem',
    });

    const metricValue = css({
      fontSize: '2.25rem',
      fontWeight: '900',
      color: theme.colors.neutral.gray900,
      letterSpacing: '-0.04em',
    });

    const trendBadge = (trend: string) => css({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      marginTop: '0.75rem',
      padding: '0.25rem 0.75rem',
      borderRadius: theme.radius.full,
      fontSize: '0.8125rem',
      fontWeight: '700',
      background: trend === 'up' ? 'hsla(142, 76%, 36%, 0.1)' : 'hsla(0, 84%, 60%, 0.1)',
      color: trend === 'up' ? theme.colors.status.success : theme.colors.status.error,
    });

    const chartCard = css({
      marginBottom: '2rem',
    });

    const cardTitle = css({
      fontSize: '1.5rem',
      fontWeight: '900',
      letterSpacing: '-0.03em',
      color: theme.colors.neutral.gray900,
      marginBottom: '1.5rem',
    });

    const chartContainer = css({
      height: '300px',
      display: 'flex',
      alignItems: 'flex-end',
      gap: '0.75rem',
      padding: '1rem 0',
    });

    const chartBar = (height: number, index: number) => css({
      flex: 1,
      height: `${height}%`,
      background: `linear-gradient(180deg, ${theme.colors.brand.primary}, ${theme.colors.brand.secondary})`,
      borderRadius: `${theme.radius.md} ${theme.radius.md} 0 0`,
      transition: 'all 0.3s ease',
      position: 'relative',
      opacity: 0.85 + (index * 0.01),
      ':hover': {
        opacity: 1,
        transform: 'scaleY(1.05)',
        transformOrigin: 'bottom',
      }
    });

    const chartLabel = css({
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '1rem',
      fontSize: '0.75rem',
      color: theme.colors.neutral.gray400,
    });

    const tableContainer = css({
      overflowX: 'auto',
    });

    const table = css({
      width: '100%',
      borderCollapse: 'collapse',
    });

    const tableHeader = css({
      fontSize: '0.75rem',
      fontWeight: '800',
      color: theme.colors.neutral.gray400,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      textAlign: 'left',
      padding: '1rem',
      borderBottom: `1px solid ${theme.surfaces.border}`,
    });

    const tableCell = css({
      padding: '1rem',
      fontSize: '0.9375rem',
      color: theme.colors.neutral.gray700,
      borderBottom: `1px solid ${theme.surfaces.border}`,
    });

    const tableRow = css({
      transition: 'background 0.2s ease',
      ':hover': {
        background: 'rgba(255,255,255,0.5)',
      }
    });

    const topPages = [
      { page: '/dashboard', views: '4,521', avgTime: '3m 12s', bounce: '24%' },
      { page: '/analytics', views: '3,234', avgTime: '5m 45s', bounce: '18%' },
      { page: '/settings', views: '2,876', avgTime: '2m 33s', bounce: '35%' },
      { page: '/users', views: '2,145', avgTime: '4m 18s', bounce: '22%' },
      { page: '/login', views: '1,987', avgTime: '1m 05s', bounce: '45%' },
    ];

    return () => {
      return h(JLayout, null, {
        default: () => [
          h('h1', { class: pageTitle }, 'Analytics'),
          h('p', { class: subtitle }, 'Track your application performance and user engagement.'),

          // Metrics Grid
          h('div', { class: metricsGrid },
            metrics.map(m => h(JCard, { variant: 'glass', padding: 'xl' }, {
              default: () => [
                h('div', { class: metricLabel }, m.label),
                h('div', { class: metricValue }, m.value),
                h('div', { class: trendBadge(m.trend) }, [
                  h('span', null, m.trend === 'up' ? '↑' : '↓'),
                  m.change
                ])
              ]
            }))
          ),

          // Chart
          h(JCard, { class: chartCard, padding: 'xl' }, {
            default: () => [
              h('h3', { class: cardTitle }, 'Visitor Trends (Last 12 Months)'),
              h('div', { class: chartContainer },
                chartData.map((value, index) => h('div', { class: chartBar(value, index) }))
              ),
              h('div', { class: chartLabel }, [
                h('span', null, 'Jan'),
                h('span', null, 'Dec'),
              ])
            ]
          }),

          // Top Pages Table
          h(JCard, { padding: 'xl' }, {
            default: () => [
              h('h3', { class: cardTitle }, 'Top Pages'),
              h('div', { class: tableContainer }, [
                h('table', { class: table }, [
                  h('thead', null, [
                    h('tr', null, [
                      h('th', { class: tableHeader }, 'Page'),
                      h('th', { class: tableHeader }, 'Views'),
                      h('th', { class: tableHeader }, 'Avg. Time'),
                      h('th', { class: tableHeader }, 'Bounce Rate'),
                    ])
                  ]),
                  h('tbody', null,
                    topPages.map(row => h('tr', { class: tableRow }, [
                      h('td', { class: css({
                        padding: '1rem',
                        fontSize: '0.9375rem',
                        fontWeight: '600',
                        color: theme.colors.brand.primary,
                        borderBottom: `1px solid ${theme.surfaces.border}`,
                      }) }, row.page),
                      h('td', { class: tableCell }, row.views),
                      h('td', { class: tableCell }, row.avgTime),
                      h('td', { class: tableCell }, row.bounce),
                    ]))
                  )
                ])
              ])
            ]
          })
        ]
      });
    };
  }
});
