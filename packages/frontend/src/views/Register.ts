import { defineComponent, h, ref, withModifiers } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { JCard, JInput, JButton } from '../jui/components';
import { css } from '../jui/core/styled';
import { theme } from '../jui/core/theme';

export default defineComponent({
  name: 'Register',
  setup() {
    const router = useRouter();
    const name = ref('');
    const email = ref('');
    const password = ref('');

    const register = () => {
      // Simulated registration
      router.push('/dashboard');
    };

    // Styles (reusing similar styles to Login for consistency)
    const pageStyle = css({
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.neutral.gray50,
      '.dark &': { backgroundColor: theme.colors.neutral.gray900 }
    });

    const wrapperStyle = css({
       width: '100%',
       maxWidth: '440px',
       padding: '1.5rem',
    });

    const headerStyle = css({
      textAlign: 'center',
      marginBottom: '2rem',
    });

    const titleStyle = css({
      fontSize: '1.875rem',
      fontWeight: '800',
      marginBottom: '0.5rem',
      background: `linear-gradient(to right, ${theme.colors.brand.primary}, ${theme.colors.brand.secondary})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    });

    const subtitleStyle = css({
      color: theme.colors.neutral.gray500,
    });

    const formStyle = css({
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
    });

    const termsStyle = css({
      fontSize: '0.75rem',
      color: theme.colors.neutral.gray400,
      textAlign: 'center',
    });

    const linkStyle = css({
      color: theme.colors.brand.secondary, // Pink for register link per original design logic or brand secondary
      fontWeight: '600',
      textDecoration: 'none',
      ':hover': { textDecoration: 'underline' }
    });

    const footerStyle = css({
      textAlign: 'center',
      marginTop: '1.5rem',
      fontSize: '0.875rem',
      color: theme.colors.neutral.gray500,
    });

    return () => {
      return h('div', { class: pageStyle }, [
        h('div', { class: wrapperStyle }, [
          h(JCard, { variant: 'glass', padding: 'lg' }, {
             default: () => [
               // Header
               h('div', { class: headerStyle }, [
                 h('h2', { class: titleStyle }, 'Create account'),
                 h('p', { class: subtitleStyle }, 'Join Japavel and start building today.')
               ]),

               // Form
               h('form', { class: formStyle, onSubmit: withModifiers(register, ['prevent']) }, [
                 h(JInput, {
                   modelValue: name.value,
                   'onUpdate:modelValue': (v: string) => name.value = v,
                   label: 'Full Name',
                   placeholder: 'John Doe',
                   required: true,
                 }),

                 h(JInput, {
                   modelValue: email.value,
                   'onUpdate:modelValue': (v: string) => email.value = v,
                   label: 'Email Address',
                   placeholder: 'name@company.com',
                   type: 'email',
                   required: true,
                 }),

                 h(JInput, {
                   modelValue: password.value,
                   'onUpdate:modelValue': (v: string) => password.value = v,
                   label: 'Password',
                   placeholder: '••••••••',
                   type: 'password',
                   required: true,
                 }),

                 h('div', { class: termsStyle }, [
                   'By signing up, you agree to our ',
                   h('a', { href: '#', class: linkStyle }, 'Terms of Service'),
                   '.'
                 ]),

                 h(JButton, { type: 'submit', size: 'lg', block: true, variant: 'solid', color: 'secondary' }, () => 'Create Account')
               ]),

               // Footer
               h('p', { class: footerStyle }, [
                 "Already have an account? ",
                 h(RouterLink, { to: '/login', class: linkStyle }, () => 'Sign in')
               ])
             ]
          })
        ])
      ]);
    };
  }
});
