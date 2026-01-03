import { defineComponent, h, ref } from 'vue';
import { JLayout, JCard, JButton, JInput } from '../jui/components';
import { css } from '../jui/core/styled';
import { theme } from '../jui/core/theme';

export default defineComponent({
  name: 'Users',
  setup() {
    const searchQuery = ref('');

    // Mock users data
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', lastActive: '2 mins ago' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'active', lastActive: '15 mins ago' },
      { id: 3, name: 'Mike Wilson', email: 'mike@example.com', role: 'Viewer', status: 'inactive', lastActive: '2 days ago' },
      { id: 4, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Editor', status: 'active', lastActive: '1 hour ago' },
      { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'Viewer', status: 'pending', lastActive: 'Never' },
      { id: 6, name: 'Lisa Davis', email: 'lisa@example.com', role: 'Admin', status: 'active', lastActive: '5 mins ago' },
    ];

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
      marginBottom: '2rem',
    });

    const headerSection = css({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      marginBottom: '2rem',
    });

    const searchBox = css({
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
    });

    const statsRow = css({
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      marginBottom: '2rem',
    });

    const statCard = css({
      textAlign: 'center',
    });

    const statNumber = (color: string) => css({
      fontSize: '2rem',
      fontWeight: '900',
      color: color,
    });

    const statLabel = css({
      fontSize: '0.875rem',
      color: theme.colors.neutral.gray500,
      fontWeight: '600',
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
      borderBottom: `2px solid ${theme.surfaces.border}`,
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

    const userInfo = css({
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    });

    const avatar = (name: string) => {
      const colors = [theme.colors.brand.primary, theme.colors.brand.secondary, theme.colors.status.info];
      const colorIndex = name.length % colors.length;
      return css({
        width: '40px',
        height: '40px',
        borderRadius: theme.radius.full,
        background: `linear-gradient(135deg, ${colors[colorIndex]}, ${colors[(colorIndex + 1) % colors.length]})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: '700',
        fontSize: '0.875rem',
      });
    };

    const userName = css({
      fontWeight: '700',
      color: theme.colors.neutral.gray900,
    });

    const userEmail = css({
      fontSize: '0.8125rem',
      color: theme.colors.neutral.gray500,
    });

    const badge = (type: string) => {
      const colors: Record<string, { bg: string; text: string }> = {
        active: { bg: 'hsla(142, 76%, 36%, 0.1)', text: theme.colors.status.success },
        inactive: { bg: 'hsla(0, 0%, 50%, 0.1)', text: theme.colors.neutral.gray500 },
        pending: { bg: 'hsla(38, 92%, 50%, 0.1)', text: theme.colors.status.warning },
        Admin: { bg: 'hsla(255, 85%, 60%, 0.1)', text: theme.colors.brand.primary },
        Editor: { bg: 'hsla(199, 89%, 48%, 0.1)', text: theme.colors.status.info },
        Viewer: { bg: 'hsla(0, 0%, 50%, 0.1)', text: theme.colors.neutral.gray600 },
      };
      const c = colors[type] || colors.inactive;
      return css({
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: theme.radius.full,
        fontSize: '0.75rem',
        fontWeight: '700',
        background: c.bg,
        color: c.text,
        textTransform: 'capitalize',
      });
    };

    const actionBtn = css({
      padding: '0.5rem 0.75rem',
      borderRadius: theme.radius.md,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      color: theme.colors.neutral.gray500,
      ':hover': {
        background: theme.surfaces.active,
        color: theme.colors.brand.primary,
      }
    });

    const activeCount = users.filter(u => u.status === 'active').length;
    const pendingCount = users.filter(u => u.status === 'pending').length;

    return () => {
      return h(JLayout, null, {
        default: () => [
          h('h1', { class: pageTitle }, 'Users'),
          h('p', { class: subtitle }, 'Manage your team members and their permissions.'),

          // Header with search and add button
          h('div', { class: headerSection }, [
            h('div', { class: searchBox }, [
              h(JInput, {
                modelValue: searchQuery.value,
                'onUpdate:modelValue': (v: string) => searchQuery.value = v,
                placeholder: 'Search users...',
                type: 'text'
              }),
            ]),
            h(JButton, { variant: 'solid' }, { default: () => '+ Add User' })
          ]),

          // Stats Row
          h('div', { class: statsRow }, [
            h(JCard, { variant: 'glass', padding: 'lg', class: statCard }, {
              default: () => [
                h('div', { class: statNumber(theme.colors.brand.primary) }, users.length.toString()),
                h('div', { class: statLabel }, 'Total Users'),
              ]
            }),
            h(JCard, { variant: 'glass', padding: 'lg', class: statCard }, {
              default: () => [
                h('div', { class: statNumber(theme.colors.status.success) }, activeCount.toString()),
                h('div', { class: statLabel }, 'Active'),
              ]
            }),
            h(JCard, { variant: 'glass', padding: 'lg', class: statCard }, {
              default: () => [
                h('div', { class: statNumber(theme.colors.status.warning) }, pendingCount.toString()),
                h('div', { class: statLabel }, 'Pending'),
              ]
            }),
          ]),

          // Users Table
          h(JCard, { padding: 'none' }, {
            default: () => [
              h('div', { class: tableContainer }, [
                h('table', { class: table }, [
                  h('thead', null, [
                    h('tr', null, [
                      h('th', { class: tableHeader }, 'User'),
                      h('th', { class: tableHeader }, 'Role'),
                      h('th', { class: tableHeader }, 'Status'),
                      h('th', { class: tableHeader }, 'Last Active'),
                      h('th', { class: tableHeader }, 'Actions'),
                    ])
                  ]),
                  h('tbody', null,
                    users.map(user => h('tr', { class: tableRow, key: user.id }, [
                      h('td', { class: tableCell }, [
                        h('div', { class: userInfo }, [
                          h('div', { class: avatar(user.name) }, user.name.charAt(0)),
                          h('div', null, [
                            h('div', { class: userName }, user.name),
                            h('div', { class: userEmail }, user.email),
                          ])
                        ])
                      ]),
                      h('td', { class: tableCell }, [
                        h('span', { class: badge(user.role) }, user.role)
                      ]),
                      h('td', { class: tableCell }, [
                        h('span', { class: badge(user.status) }, user.status)
                      ]),
                      h('td', { class: tableCell }, user.lastActive),
                      h('td', { class: tableCell }, [
                        h('button', { class: actionBtn, title: 'Edit' }, '✏️'),
                        h('button', { class: actionBtn, title: 'Delete' }, '🗑️'),
                      ]),
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
