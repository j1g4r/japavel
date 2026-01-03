import { defineComponent, h, type PropType } from 'vue';
import { css } from '../core/styled';
import { theme } from '../core/theme';

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  sortable?: boolean;
}

export default defineComponent({
  name: 'JTable',
  props: {
    columns: { type: Array as PropType<TableColumn[]>, required: true },
    data: { type: Array as PropType<any[]>, default: () => [] },
    striped: Boolean,
    hoverable: Boolean,
  },
  setup(props, { slots }) {
    
    const container = css({
       width: '100%',
       overflowX: 'auto',
       borderRadius: theme.radius.lg,
       border: `1px solid ${theme.colors.neutral.gray200}`,
       '.dark &': { borderColor: theme.colors.neutral.gray700 }
    });

    const tableStyle = css({
       width: '100%',
       borderCollapse: 'collapse',
       fontSize: '0.875rem',
       textAlign: 'left',
    });

    const thStyle = (align: string = 'left') => css({
       padding: '0.75rem 1.5rem',
       backgroundColor: theme.colors.neutral.gray50,
       color: theme.colors.neutral.gray500,
       fontWeight: '600',
       textTransform: 'uppercase',
       fontSize: '0.75rem',
       letterSpacing: '0.05em',
       textAlign: align,
       borderBottom: `1px solid ${theme.colors.neutral.gray200}`,
       '.dark &': {
          backgroundColor: theme.colors.neutral.gray800,
          color: theme.colors.neutral.gray400,
          borderColor: theme.colors.neutral.gray700,
       }
    });

    const tdStyle = (align: string = 'left') => css({
       padding: '1rem 1.5rem',
       color: theme.colors.neutral.gray900,
       borderBottom: `1px solid ${theme.colors.neutral.gray100}`,
       textAlign: align,
       '.dark &': {
          color: theme.colors.neutral.gray100,
          borderBottomColor: theme.colors.neutral.gray800,
       }
    });

    const trStyle = css({
       backgroundColor: theme.colors.neutral.white,
       transition: 'background-color 0.2s',
       '.dark &': { backgroundColor: theme.colors.neutral.gray900 },
       ...(props.striped ? {
          ':nth-child(even)': { 
             backgroundColor: theme.colors.neutral.gray50,
             '.dark &': { backgroundColor: 'rgba(31, 41, 55, 0.5)' } 
          }
       } : {}),
       ...(props.hoverable ? {
          ':hover': { 
             backgroundColor: theme.colors.neutral.gray50,
             '.dark &': { backgroundColor: theme.colors.neutral.gray800 } 
          }
       } : {})
    });

    return () => {
      return h('div', { class: container }, [
         h('table', { class: tableStyle }, [
            h('thead', {}, [
               h('tr', {}, props.columns.map(col => h('th', { class: thStyle(col.align) }, col.label)))
            ]),
            h('tbody', {}, props.data.map((row, rowIdx) => h('tr', { key: rowIdx, class: trStyle }, 
               props.columns.map(col => h('td', { class: tdStyle(col.align) }, 
                  slots[`cell-${col.key}`] ? slots[`cell-${col.key}`]!({ value: row[col.key], row }) : row[col.key]
               ))
            )))
         ])
      ]);
    };
  }
});
