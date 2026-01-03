import { defineComponent, h, ref } from 'vue';
import { JLayout, JCard, JButton } from '../jui/components';
import { css } from '../jui/core/styled';
import { theme } from '../jui/core/theme';

export default defineComponent({
  name: 'Settings',
  setup() {
    const notifications = ref(true);
    const darkMode = ref(false);

    // Styles
    const pageHeader = css({
      marginBottom: '3rem',
    });

    const titleStyle = css({
      fontSize: '2.5rem',
      fontWeight: '900',
      letterSpacing: '-0.05em',
      color: theme.colors.neutral.gray900,
      marginBottom: '0.5rem',
    });

    const sectionGrid = css({
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem',
      maxWidth: '800px',
    });

    const formGroup = css({
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      marginBottom: '1.5rem',
    });

    const labelStyle = css({
      fontSize: '0.875rem',
      fontWeight: '700',
      color: theme.colors.neutral.gray600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    });

    const inputStyle = css({
      padding: '1rem 1.25rem',
      borderRadius: theme.radius.lg,
      border: `1px solid ${theme.colors.neutral.gray200}`,
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      ':focus': {
        borderColor: theme.colors.brand.primary,
        boxShadow: `0 0 0 4px ${theme.colors.brand.primary}11`,
        outline: 'none',
      }
    });

    const toggleRow = css({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.25rem',
      borderRadius: theme.radius.lg,
      background: theme.colors.neutral.gray50,
      border: `1px solid ${theme.colors.neutral.gray100}`,
      transition: 'all 0.3s ease',
      ':hover': {
        background: theme.colors.neutral.white,
        boxShadow: theme.shadow.sm,
      }
    });

    return () => h(JLayout, null, {
      default: () => [
        h('div', { class: pageHeader }, [
          h('h1', { class: titleStyle }, 'Settings'),
          h('p', { class: css({ color: theme.colors.neutral.gray500, fontWeight: '500' }) }, 
            'Manage your account preferences and system configuration.'
          )
        ]),

        h('div', { class: sectionGrid }, [
          // Profile Section
          h(JCard, { padding: 'xl' }, {
            header: () => 'Profile Information',
            default: () => h('div', {}, [
              h('div', { class: formGroup }, [
                h('label', { class: labelStyle }, 'Full Name'),
                h('input', { class: inputStyle, value: 'John Doe', placeholder: 'Enter your name' })
              ]),
              h('div', { class: formGroup }, [
                h('label', { class: labelStyle }, 'Email Address'),
                h('input', { class: inputStyle, value: 'john@example.com', type: 'email' })
              ]),
              h(JButton, { variant: 'solid', color: 'primary' }, () => 'Save Profile Changes')
            ])
          }),

          // Preferences Section
          h(JCard, { padding: 'xl', variant: 'glass' }, {
            header: () => 'App Preferences',
            default: () => h('div', { class: css({ display: 'flex', flexDirection: 'column', gap: '1rem' }) }, [
              h('div', { class: toggleRow }, [
                h('div', {}, [
                  h('p', { class: css({ fontWeight: '700', color: theme.colors.neutral.gray800 }) }, 'Email Notifications'),
                  h('span', { class: css({ fontSize: '0.875rem', color: theme.colors.neutral.gray500 }) }, 'Receive updates about your projects.')
                ]),
                h('input', { type: 'checkbox', checked: notifications.value })
              ]),
              h('div', { class: toggleRow }, [
                h('div', {}, [
                  h('p', { class: css({ fontWeight: '700', color: theme.colors.neutral.gray800 }) }, 'Dark Mode'),
                  h('span', { class: css({ fontSize: '0.875rem', color: theme.colors.neutral.gray500 }) }, 'Switch to a dark UI theme.')
                ]),
                h('input', { type: 'checkbox', checked: darkMode.value })
              ])
            ])
          }),

          // Danger Zone
          h(JCard, { padding: 'xl', variant: 'outline', hover: false }, {
            header: () => h('span', { style: { color: theme.colors.status.error } }, 'Danger Zone'),
            default: () => h('div', { class: css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }) }, [
               h('div', {}, [
                 h('p', { class: css({ fontWeight: '700', color: theme.colors.neutral.gray800 }) }, 'Delete Account'),
                 h('p', { class: css({ fontSize: '0.875rem', color: theme.colors.neutral.gray500 }) }, 'Permanently remove your account and all data.')
               ]),
               h(JButton, { variant: 'outline', color: 'error' }, () => 'Terminate Account')
            ])
          })
        ])
      ]
    });
  }
});
