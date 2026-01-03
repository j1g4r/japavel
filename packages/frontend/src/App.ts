import { defineComponent, h } from 'vue';
import { RouterView } from 'vue-router';
import './jui/styles/global.css';

export default defineComponent({
  name: 'App',
  setup() {
    return () => h('div', { class: 'app-root' }, [
      h(RouterView)
    ]);
  }
});
