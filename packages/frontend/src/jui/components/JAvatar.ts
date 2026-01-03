import { defineComponent, h, computed, type PropType } from 'vue';
import { css } from '../core/styled';
import { theme } from '../core/theme';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

export default defineComponent({
  name: 'JAvatar',
  props: {
    src: String,
    alt: String,
    name: String,
    size: { type: String as PropType<AvatarSize>, default: 'md' },
    status: String as PropType<AvatarStatus>,
    ring: Boolean,
    ringColor: { type: String, default: 'white' },
    squared: Boolean,
  },
  setup(props) {
    
    // Utilities
    const initials = computed(() => {
      if (!props.name) return '?';
      const parts = props.name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    });

    const initialsGradient = computed(() => {
      if (!props.name) return `linear-gradient(135deg, ${theme.colors.neutral.gray400}, ${theme.colors.neutral.gray500})`;
      const gradients = [
        `linear-gradient(135deg, ${theme.colors.brand.primary}, #818cf8)`, // Indigo
        `linear-gradient(135deg, #f472b6, #fb7185)`, // Pink/Rose
        `linear-gradient(135deg, #22d3ee, #3b82f6)`, // Cyan/Blue
        `linear-gradient(135deg, #34d399, #14b8a6)`, // Emerald/Teal
        `linear-gradient(135deg, #fbbf24, #f97316)`, // Amber/Orange
      ];
      const hash = props.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return gradients[hash % gradients.length];
    });

    // Styles
    const containerStyle = computed(() => css({
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
      color: theme.colors.neutral.white,
      userSelect: 'none',
      overflow: 'hidden',
      flexShrink: 0,
      borderRadius: props.squared ? theme.radius.lg : '50%',
      backgroundColor: !props.src ? theme.colors.neutral.gray300 : undefined, // Fallback
      backgroundImage: !props.src ? initialsGradient.value : undefined,
      ...(props.ring ? {
         boxShadow: `0 0 0 2px ${props.ringColor === 'primary' ? theme.colors.brand.primary : 
                        props.ringColor === 'secondary' ? theme.colors.brand.secondary : 
                        theme.colors.neutral.white}`, // Approximate ring
      } : {}),
      // Sizes
      ...(props.size === 'xs' ? { width: '1.5rem', height: '1.5rem', fontSize: '0.625rem' } : {}),
      ...(props.size === 'sm' ? { width: '2rem', height: '2rem', fontSize: '0.75rem' } : {}),
      ...(props.size === 'md' ? { width: '2.5rem', height: '2.5rem', fontSize: '0.875rem' } : {}),
      ...(props.size === 'lg' ? { width: '3rem', height: '3rem', fontSize: '1rem' } : {}),
      ...(props.size === 'xl' ? { width: '4rem', height: '4rem', fontSize: '1.125rem' } : {}),
    }));

    const imgStyle = css({
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    });

    const statusStyle = computed(() => {
      const colorMap: Record<string, string> = {
         online: theme.colors.status.success,
         away: theme.colors.status.warning,
         busy: theme.colors.status.error,
         offline: theme.colors.neutral.gray400,
      };
      
      const sizeMap: Record<AvatarSize, string> = {
         xs: '0.375rem', sm: '0.5rem', md: '0.625rem', lg: '0.75rem', xl: '1rem'
      };

      return css({
         position: 'absolute',
         bottom: 0,
         right: 0,
         borderRadius: '50%',
         border: `2px solid ${theme.colors.neutral.white}`,
         backgroundColor: colorMap[props.status || 'offline'],
         width: sizeMap[props.size],
         height: sizeMap[props.size],
         '.dark &': { borderColor: theme.colors.neutral.gray800 }
      });
    });

    return () => {
      return h('div', { class: containerStyle.value }, [
         props.src ? h('img', { src: props.src, alt: props.alt || props.name || 'Avatar', class: imgStyle }) :
         h('span', {}, initials.value),
         props.status ? h('span', { class: statusStyle.value }) : null
      ]);
    };
  }
});
