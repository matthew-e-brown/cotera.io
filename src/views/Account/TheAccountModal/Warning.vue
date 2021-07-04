<script lang="ts">
import { defineComponent, PropType, h } from 'vue';

export default defineComponent({
  emits: [ 'confirm', 'cancel' ],
  props: { swapped: { default: false, type: Boolean as PropType<boolean> } },
  setup(props, { slots, emit }) {

    // To be able to have the slots in one of two different places, we need to
    // use a render function.

    /*
     * TODO: double check that that's actually the case: try again with a
     * template and see if it works. The problem *actually* ended up being that
     * the slots were swapped in the parent component the *entire time*... UGH.
     */

    return () => [

      h(
        'p',
        slots.default?.()
      ),

      h(
        'div',
        { class: 'split-buttons' },
        [
          // Left button
          h(
            'button',
            {
              class: !props.swapped ? 'danger-button' : 'button',
              onClick: () => emit(!props.swapped ? 'confirm' : 'cancel')
            },
            !props.swapped ? slots.confirm?.() : slots.cancel?.()
          ),
          // Right button
          h(
            'button',
            {
              class: !props.swapped ? 'button' : 'danger-button',
              onClick: () => emit(!props.swapped ? 'cancel' : 'confirm')
            },
            !props.swapped ? slots.cancel?.() : slots.confirm?.()
          )
        ]
      )

    ];
  }
});
</script>