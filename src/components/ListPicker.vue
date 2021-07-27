<template>
  <div class="list-picker">

    <button
      type="button"
      class="option-button"
      ref="popperReference"
      @click="opened = !opened"
    >
      <fa-icon icon="ellipsis-v" class="fa-fw" />
      <span>{{ selected.name }}</span>
    </button>

    <ul ref="popperElement" :style="`display: ${opened ? 'block' : 'none'}`">
      <li
        v-for="(info, i) in listInfo" :key="info.id"
        :class="{ 'selected-list': selected.id == info.id }"
      >

        <div v-if="info.id !== beingEdited" class="picker-box">

          <button type="button" class="name" @click="select(info.id)">
            {{ info.name }}
          </button>

          <button
            type="button"
            class="picker-button"
            @click="moveUp(i)"
            :disabled="i <= 0"
          >
            <fa-icon icon="caret-up" class="fa-fw" />
          </button>
          <button
            type="button"
            class="picker-button"
            @click="moveDown(i)"
            :disabled="i >= listInfo.length - 1"
          >
            <fa-icon icon="caret-down" class="fa-fw" />
          </button>
          <button type="button" class="picker-button" @click="edit(info)">
            <fa-icon icon="pen" class="fa-fw" />
          </button>
          <button
            type="button"
            class="picker-button"
            @click="remove(info.id)"
            :disabled="info.id == selected.id"
          >
            <fa-icon icon="trash-alt" class="fa-fw" />
          </button>
        </div>

        <form v-else class="picker-box" @submit.prevent="submitEdit(info.id)">
          <input
            type="text"
            ref="editInput"
            v-model="editingTemp"
            @keydown.esc="stopEdit"
          />
          <button
            type="submit"
            class="picker-button"
            :disabled="editingTemp.length <= 0"
          >
            <fa-icon icon="check" class="fa-fw" />
          </button>
          <button type="button" class="picker-button" @click="stopEdit">
            <fa-icon icon="times" class="fa-fw" />
          </button>
        </form>

      </li>


      <li v-if="beingAdded === null">

        <button type="button" class="create-new" @click="add">
          <fa-icon icon="plus-circle" class="fa-fw" />
          <span>Create a new list</span>
        </button>

      </li>
      <li v-else>

        <form class="picker-box" @submit.prevent="submitAdd">
          <input
            type="text"
            ref="addInput"
            v-model="beingAdded"
            placeholder="New list name"
            @keydown.esc.capture="stopAdd"
          />
          <button
            type="submit"
            class="picker-button"
            :disabled="beingAdded.length <= 0"
          >
            <fa-icon icon="check" class="fa-fw" />
          </button>
          <button
            type="button"
            class="picker-button"
            @click="beingAdded = null"
          >
            <fa-icon icon="times" class="fa-fw" />
          </button>
        </form>

      </li>

    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, Ref, toRef, ref, computed, watch, nextTick, onMounted,
  onUnmounted, PropType
} from 'vue';

import { createPopper, Instance } from '@popperjs/core/lib/popper-lite';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import eventListeners from '@popperjs/core/lib/modifiers/eventListeners';
import offset from '@popperjs/core/lib/modifiers/offset';

import store from '@/store';
import { ListID, ListInfo } from '@/store/types';


function usePopper(opened: Ref<boolean>, bounds: Ref<HTMLElement | undefined>) {

  let instance: Instance | null = null;
  const reference = ref<HTMLButtonElement>();
  const element = ref<HTMLUListElement>();


  /**
   * Gets the padding from the computed styles of an element
   * @param el The element of which the styles should be parsed from
   * @returns An object with a property for each side, in pixels
   */
  const getPadding = (el?: HTMLElement) => {
    if (!el) return { top: 0, right: 0, bottom: 0, left: 0 };

    type SidesUpper = 'Top' | 'Right' | 'Bottom' | 'Left';
    type SidesLower = 'top' | 'right' | 'bottom' | 'left';

    const styles = getComputedStyle(el);

    // For each side...
    return [ 'Top', 'Right', 'Bottom', 'Left' ].reduce((acc, cur) => {
      const key = `padding${cur}` as `padding${SidesUpper}`;
      const val = parseFloat(styles[key]);

      // ... set 'side' = styles['paddingSide']
      acc[cur.toLowerCase() as SidesLower] = val;

      return acc;
    }, { } as { [ k in SidesLower ]: number });
  }

  const getEm = (el?: HTMLElement) => {
    const styles = getComputedStyle(el ?? document.documentElement);
    return parseFloat(styles.fontSize);
  }


  /**
   * Generates the configuration for the Popper Instance
   */
  const generateModifiers = (open: boolean) => {
    return [
      // preventOverflow
      { ...preventOverflow, enabled: true, options: {
        boundary: bounds.value, padding: getPadding(bounds.value)
      }},
      // offset
      { ...offset, enabled: true, options: {
        offset: [ 0, getEm(element.value) * 0.5 ]
      }},
      // eventListeners
      { ...eventListeners, enabled: open }
    ];
  }


  // nextTick is (for some reason?) needed to prevent DOM ref object from
  // parent from being undefined. My best guess is because the ref that is
  // being pointed to is a *parent* of where this component is: so, when Vue
  // is rendering this component, it has not completed rendering its parent
  // yet, and the ref is undefined.
  onMounted(() => nextTick(() => {
    if (!reference.value || !element.value || !bounds.value)
      throw new Error("DOM refs not established during onMounted hook");

    // just in case
    if (instance !== null) {
      instance.destroy();
      instance = null;
    }

    instance = createPopper(reference.value, element.value, {
      placement: 'bottom',
      modifiers: generateModifiers(false)
    });
  }));

  watch(opened, async isOpen => {
    // toggle the modifiers depending on current state
    await instance?.setOptions({ modifiers: generateModifiers(isOpen) });
    if (isOpen) await instance?.update();
  });

  onUnmounted(() => {
    if (instance !== null) {
      instance.destroy();
      instance = null;
    }
  });

  return { popperReference: reference, popperElement: element };
}


export default defineComponent({
  props: {
    overflowBounds: {
      type: Object as PropType<HTMLElement>,
      required: false
    }
  },
  setup(props) {
    const opened = ref(false);

    const listInfo: Ref<ListInfo[]> = toRef(store.state, 'listInfo');

    const beingEdited: Ref<ListID | null> = ref(null);
    const editingTemp = ref("");

    const beingAdded: Ref<string | null> = ref(null);

    const editInput = ref<HTMLInputElement>();
    const addInput = ref<HTMLInputElement>();

    const edit = (info: ListInfo) => {
      // stop the add
      beingAdded.value = null;
      // open up the editing field
      beingEdited.value = info.id;
      editingTemp.value = info.name;
      // nextTick to wait until its v-if has processed, otherwise 'ref' is not
      // established
      nextTick(() => {
        // put the old name in the placeholder, so they can see it if they
        // deleted it (don't use a reactive placeholder, it doesn't need to
        // change)
        if (editInput.value) editInput.value.placeholder = info.name;
        // focus the input
        editInput.value?.focus();
      });
    }

    const add = () => {
      beingEdited.value = null;
      editingTemp.value = "";
      beingAdded.value = "";
      nextTick(() => addInput.value?.focus())
    }

    const stopEdit = () => {
      beingEdited.value = null;
      editingTemp.value = "";
    }

    const stopAdd = () => {
      beingAdded.value = null;
    }

    const submitEdit = (id: ListID) => {
      if (beingEdited.value !== null && beingEdited.value.length > 0) {
        store.renameList(id, editingTemp.value);
        beingEdited.value = null;
        editingTemp.value = "";
      }
    }

    const submitAdd = () => {
      if (beingAdded.value !== null && beingAdded.value.length > 0) {
        store.addNewList(beingAdded.value);
        beingAdded.value = null;
      }
    }

    const moveDown = (index: number) => {
      if (index < store.state.listInfo.length - 1) {
        store.reorderListInfo(index, index + 1);
      }
    }

    const moveUp = (index: number) => {
      if (index > 0) {
        store.reorderListInfo(index, index - 1);
      }
    }

    const select = (id: ListID) => {
      if (id != store.state.settings.selectedList)
        store.setSetting('selectedList', id);
    }

    const remove = (id: ListID) => {
      if (id != store.state.settings.selectedList)
        store.removeList(id);
    }

    const selected = computed(() => {
      const sel = toRef(store.state.settings, 'selectedList');
      return store.state.listInfo.find(({ id }) => sel.value == id)!;
    });

    return {
      listInfo, selected, opened,
      edit, beingEdited, editingTemp, stopEdit, submitEdit, editInput,
      add, beingAdded, stopAdd, submitAdd, addInput,
      moveDown, moveUp, select, remove,
      ...usePopper(opened, toRef(props, 'overflowBounds')),
    };
  }
});
</script>

<style scoped lang="scss">
.option-button {
  // '...' when the list name gets too long
  span { @include dot-dot-dot; }
}

button { color: inherit; }
button:disabled { opacity: 0.25; }

.list-picker {
  color: $fg-color;
}

.name {
  height: 1em;
  font-weight: 400;
}

.name, .picker-box input, .create-new {
  box-sizing: content-box;
  padding: 0.45em 0.55em;
}

.picker-box input, .create-new {
  height: 1em;
}

.selected-list {
  .name { font-weight: 700; }
}

// The pop-out itself
ul {
  list-style-type: none;
  z-index: 3;

  margin: 0;
  padding: 1em 0.85em;

  background-color: $bg-color;

  @supports (backdrop-filter: blur(10px)) {
    background-color: $bg-color-transparent;
    backdrop-filter: blur(10px);
  }

  border-radius: 0.4em;
  border: 0.25em double $border-color;

  li { display: block; }
  li+li { margin-top: 0.75em; }
}

// Each element in the list; the box that holds the options for each list
.picker-box {
  box-sizing: border-box;
  width: 18rem;

  padding-right: 0.25em;

  background-color: $bg-color-accent;

  display: grid;
  align-items: stretch;

  column-gap: 0.5em;
  @at-root div#{&} { grid-template-columns: 1fr repeat(4, 1.5em); }
  @at-root form#{&} { grid-template-columns: 1fr repeat(2, 1.5em); }

  // .name and input
  >:first-child {
    margin-left: 0;
    text-align: left;
    padding-left: 0.55em + 0.25em;
  }

  input {
    width: unset;
    border-radius: 0;
    background-color: $bg-color-accent;
  }

  >:last-child { margin-right: 0; }
}

// The little buttons inside each .picker-box
.picker-button {
  color: $fg-color;
  background-color: transparent;

  padding: 0.25em;

  display: flex;
  align-items: center;
  justify-content: center;
}

// The 'Create new list' button
li:last-child {
  color: $fg-color-dimmer;
  display: flex;

  // direct-child button, so only when it's not the input field
  >button {
    flex-grow: 1;
    svg { margin-right: 0.50em; }
  }
}
</style>