<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'

/**
 * JTable - Data Table Component
 * 
 * Features:
 * - Sortable columns
 * - Striped/hover rows
 * - Responsive with horizontal scroll
 * - Empty state
 * - Loading skeleton
 */

interface Column {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
}

interface Props {
  columns: Column[]
  data: Record<string, any>[]
  striped?: boolean
  hoverable?: boolean
  loading?: boolean
  emptyText?: string
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  striped: false,
  hoverable: true,
  loading: false,
  emptyText: 'No data available',
  compact: false,
})

const emit = defineEmits<{
  sort: [key: string, direction: 'asc' | 'desc']
  'row-click': [row: Record<string, any>, index: number]
}>()

const sortKey = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')

const alignClasses: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const cellPadding = computed(() => props.compact ? 'px-4 py-2' : 'px-6 py-4')
const headerPadding = computed(() => props.compact ? 'px-4 py-2' : 'px-6 py-3')

const handleSort = (column: Column) => {
  if (!column.sortable) return
  
  if (sortKey.value === column.key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = column.key
    sortDirection.value = 'asc'
  }
  
  emit('sort', column.key, sortDirection.value)
}

const handleRowClick = (row: Record<string, any>, index: number) => {
  emit('row-click', row, index)
}
</script>

<template>
  <div class="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
    <div class="overflow-x-auto j-scrollbar">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <!-- Header -->
        <thead class="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                headerPadding,
                alignClasses[column.align || 'left'],
                'text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400',
                column.sortable && 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none transition-colors',
              ]"
              :style="column.width ? { width: column.width } : {}"
              @click="handleSort(column)"
            >
              <div class="flex items-center gap-2" :class="alignClasses[column.align || 'left']">
                <span>{{ column.label }}</span>
                
                <!-- Sort indicator -->
                <span v-if="column.sortable" class="flex flex-col -space-y-1">
                  <ChevronUpIcon
                    :class="[
                      'w-3 h-3 transition-colors',
                      sortKey === column.key && sortDirection === 'asc'
                        ? 'text-indigo-600'
                        : 'text-gray-300 dark:text-gray-600'
                    ]"
                  />
                  <ChevronDownIcon
                    :class="[
                      'w-3 h-3 transition-colors',
                      sortKey === column.key && sortDirection === 'desc'
                        ? 'text-indigo-600'
                        : 'text-gray-300 dark:text-gray-600'
                    ]"
                  />
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <!-- Loading skeleton -->
          <template v-if="loading">
            <tr v-for="i in 5" :key="i">
              <td
                v-for="column in columns"
                :key="column.key"
                :class="cellPadding"
              >
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </td>
            </tr>
          </template>

          <!-- Empty state -->
          <tr v-else-if="data.length === 0">
            <td
              :colspan="columns.length"
              class="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
            >
              <slot name="empty">
                <div class="flex flex-col items-center gap-2">
                  <svg
                    class="w-12 h-12 text-gray-300 dark:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>{{ emptyText }}</p>
                </div>
              </slot>
            </td>
          </tr>

          <!-- Data rows -->
          <tr
            v-else
            v-for="(row, rowIndex) in data"
            :key="rowIndex"
            :class="[
              'transition-colors',
              striped && rowIndex % 2 === 1 && 'bg-gray-50/50 dark:bg-gray-900/25',
              hoverable && 'hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer',
            ]"
            @click="handleRowClick(row, rowIndex)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                cellPadding,
                alignClasses[column.align || 'left'],
                'text-sm text-gray-700 dark:text-gray-200',
              ]"
            >
              <slot :name="`cell-${column.key}`" :value="row[column.key]" :row="row" :index="rowIndex">
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
