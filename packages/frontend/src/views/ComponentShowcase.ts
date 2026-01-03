import { defineComponent, h, ref } from 'vue';
import { 
  JLayout, JCard, JButton, JInput, JBadge, JAvatar, 
  JAlert, JModal, JDropdown, JTable 
} from '../jui/components';
import { css } from '../jui/core/styled';
import { theme } from '../jui/core/theme';
import { SparklesIcon, HeartIcon } from '@heroicons/vue/24/outline'; // Example icons

export default defineComponent({
  name: 'ComponentShowcase',
  setup() {
    // State
    const showModal = ref(false);
    const inputValue = ref('');
    const toggleValue = ref(false);

    // Data
    const dropdownItems = [
      { label: 'Profile', value: 'profile' },
      { label: 'Settings', value: 'settings' },
      { divider: true, label: '' },
      { label: 'Sign out', value: 'signout', danger: true },
    ];

    const tableColumns = [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'status', label: 'Status' },
    ];

    const tableData = [
      { name: 'John Doe', role: 'Admin', status: 'Active' },
      { name: 'Jane Smith', role: 'Editor', status: 'Active' },
      { name: 'Bob Wilson', role: 'Viewer', status: 'Inactive' },
    ];

    // Styles
    const pageContainer = css({
      paddingBottom: '4rem',
    });

    const headerStyle = css({
      marginBottom: '3rem',
      textAlign: 'center',
    });

    const titleStyle = css({
      fontSize: '2.25rem',
      fontWeight: '800',
      marginBottom: '1rem',
      color: theme.colors.neutral.gray900,
    });

    const subtitleStyle = css({
      fontSize: '1.125rem',
      color: theme.colors.neutral.gray500,
      maxWidth: '600px',
      margin: '0 auto',
    });

    const sectionStyle = css({
      marginBottom: '4rem',
      maxWidth: '1200px',
      margin: '0 auto 4rem',
      padding: '0 1.5rem',
    });

    const sectionHeader = css({
      marginBottom: '2rem',
      color: theme.colors.neutral.gray800,
      borderBottom: `1px solid ${theme.colors.neutral.gray200}`,
      paddingBottom: '0.5rem',
    });

    const gridStyle = css({
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2rem',
      '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
      '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
    });

    const flexWrap = css({
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      marginBottom: '1.5rem',
      alignItems: 'center',
    });

    return () => {
      return h(JLayout, null, {
        default: () => [
          h('div', { class: pageContainer }, [
            
            // Hero
            h('div', { class: headerStyle }, [
              h('h1', { class: titleStyle }, 'JUI Framework Showcase'),
              h('p', { class: subtitleStyle }, 'A comprehensive tour of the typescript-only, glassmorphism-ready component library.')
            ]),

            // 1. Buttons
            h('section', { class: sectionStyle }, [
              h('h2', { class: sectionHeader }, 'Buttons'),
              h(JCard, { padding: 'lg' }, {
                default: () => [
                  h('div', { class: css({ marginBottom: '1rem', fontWeight: '600' }) }, 'Variants'),
                  h('div', { class: flexWrap }, [
                    h(JButton, { variant: 'solid', color: 'primary' }, () => 'Primary'),
                    h(JButton, { variant: 'solid', color: 'secondary' }, () => 'Secondary'),
                    h(JButton, { variant: 'outline', color: 'primary' }, () => 'Outline'),
                    h(JButton, { variant: 'ghost', color: 'primary' }, () => 'Ghost'),
                    h(JButton, { variant: 'solid', color: 'primary' }, () => 'Gradient'),
                  ]),
                  
                  h('div', { class: css({ marginBottom: '1rem', fontWeight: '600' }) }, 'Sizes'),
                  h('div', { class: flexWrap }, [
                    h(JButton, { size: 'sm' }, () => 'Small'),
                    h(JButton, { size: 'md' }, () => 'Medium'),
                    h(JButton, { size: 'lg' }, () => 'Large'),
                    h(JButton, { size: 'xl' }, () => 'Extra Large'),
                  ]),

                  h('div', { class: css({ marginBottom: '1rem', fontWeight: '600' }) }, 'States & Icons'),
                  h('div', { class: flexWrap }, [
                    h(JButton, { loading: true }, () => 'Loading'),
                    h(JButton, { disabled: true }, () => 'Disabled'),
                    h(JButton, {}, () => 'Left Icon'),
                  ]),
                ]
              })
            ]),

            // 2. Inputs & Forms
            h('section', { class: sectionStyle }, [
              h('h2', { class: sectionHeader }, 'Inputs'),
              h('div', { class: gridStyle }, [
                h(JInput, { label: 'Default Input', placeholder: 'Type something...' }),
                h(JInput, { label: 'With State', state: 'success', helperText: 'Valid input!', placeholder: 'Success' }),
                h(JInput, { label: 'Password', type: 'password', placeholder: '******' }),
              ])
            ]),

            // 3. Badges, Avatars, Alerts
            h('section', { class: sectionStyle }, [
              h('h2', { class: sectionHeader }, 'Badges, Avatars & Alerts'),
              h('div', { class: gridStyle }, [
                
                h(JCard, { padding: 'md' }, {
                  header: () => h('h3', { class: css({ fontWeight: '600', marginBottom: '1rem' }) }, 'Badges'),
                  default: () => h('div', { class: flexWrap }, [
                     h(JBadge, { color: 'primary' }, () => 'Primary'),
                     h(JBadge, { color: 'success', variant: 'dot' }, () => 'Online'),
                     h(JBadge, { color: 'error', variant: 'soft' }, () => 'Error'),
                  ])
                }),

                h(JCard, { padding: 'md' }, {
                  header: () => h('h3', { class: css({ fontWeight: '600', marginBottom: '1rem' }) }, 'Avatars'),
                  default: () => h('div', { class: flexWrap }, [
                     h(JAvatar, { name: 'John Doe', size: 'lg', status: 'online' }),
                     h(JAvatar, { name: 'Alice Smith', size: 'lg', ring: true, ringColor: 'secondary' }),
                     h(JAvatar, { name: 'Bob', size: 'lg', squared: true }),
                  ])
                }),

                h('div', { class: css({ display: 'flex', flexDirection: 'column', gap: '1rem' }) }, [
                  h(JAlert, { variant: 'info', title: 'Info Alert' }, { default: () => 'This is an info alert.' }),
                  h(JAlert, { variant: 'warning', title: 'Warning' }, { default: () => 'Proceed with caution.' }),
                ])
              ])
            ]),

            // 4. Interactive (Modal, Dropdown, Table)
            h('section', { class: sectionStyle }, [
              h('h2', { class: sectionHeader }, 'Interactive Components'),
              
              h('div', { class: gridStyle }, [
                // Modal Trigger
                h(JCard, { padding: 'lg' }, {
                   header: () => h('h3', { class: css({ fontWeight: '600', marginBottom: '1rem' }) }, 'Modal'),
                   default: () => h(JButton, { onClick: () => showModal.value = true }, () => 'Open Demo Modal')
                }),

                // Dropdown
                h(JCard, { padding: 'lg' }, {
                   header: () => h('h3', { class: css({ fontWeight: '600', marginBottom: '1rem' }) }, 'Dropdown'),
                   default: () => h(JDropdown, { items: dropdownItems, label: 'Account Menu' })
                }),
              ]),

              // Table
              h('div', { class: css({ marginTop: '2rem' }) }, [
                 h('h3', { class: css({ fontWeight: '600', marginBottom: '1rem' }) }, 'Data Table'),
                 h(JTable, { 
                    columns: tableColumns, 
                    data: tableData, 
                    striped: true,
                    hoverable: true
                 }, {
                    'cell-status': ({ value }: { value: string }) => h(JBadge, { 
                       color: value === 'Active' ? 'success' : 'neutral',
                       variant: 'soft'
                    }, () => value)
                 })
              ])
            ]),

            // Modal Instance
            h(JModal, {
              open: showModal.value,
              'onUpdate:open': (v: boolean) => showModal.value = v,
              title: 'Welcome to JUI',
              description: 'This is a fully accessible modal component.',
              size: 'md'
            }, {
              default: () => h('p', { class: css({ color: theme.colors.neutral.gray600 }) }, 
                'Everything here is built with TypeScript and our custom styling engine.'
              ),
              footer: () => [
                 h(JButton, { variant: 'ghost', onClick: () => showModal.value = false }, () => 'Cancel'),
                 h(JButton, { variant: 'solid', color: 'primary', onClick: () => showModal.value = false }, () => 'Awesome!')
              ]
            })

          ])
        ]
      });
    };
  }
});
