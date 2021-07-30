<template>
  <div class="list-picker"
    ref="wrapper"
    @focusout="wrapperFocusout"
    @keydown.esc="opened = false"
  >

    <button
      type="button"
      class="option-button"
      ref="popperReference"
      @click.stop="opened = !opened"
    >
      <fa-icon icon="ellipsis-v" />
      <span>{{ selected.name }}</span>
    </button>

    <ul
      ref="popperElement"
      :style="{ display: opened ? 'block' : 'none' }"
      @click.stop="void 0 /* do nothing except stopPropagation */"
    >
      <li
        v-for="(info, i) in listInfo" :key="info.id"
        :class="{ 'selected-list': selected.id == info.id }"
      >

        <div v-if="info.id !== beingEdited" class="picker-box">

          <button
            type="button"
            class="name"
            :title="info.name"
            @click="select(info.id)"
          >{{ info.name }}</button>

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
            @keydown.esc.stop="stopEdit"
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
            @keydown.esc.stop="stopAdd"
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
import computeStyles from '@popperjs/core/lib/modifiers/computeStyles';
import offset from '@popperjs/core/lib/modifiers/offset';

import store from '@/store';
import { ListID, ListInfo } from '@/store/types';
import { defaults } from '@/store/helpers';


/**
 * Gets the padding from the computed styles of an element (in the most
 * convoluted way possible, instead of just grabbing the four properties; for
 * fun LOL)
 * @param el The element of which the styles should be parsed from
 * @returns An object with a property for each side, in pixels
 */
const getPadding = (el?: HTMLElement) => {
  if (!el) return { top: 0, right: 0, bottom: 0, left: 0 };

  type SidesUpper = 'Top' | 'Right' | 'Bottom' | 'Left';
  type SidesLower = 'top' | 'right' | 'bottom' | 'left';

  const styles = getComputedStyle(el);

  // For each 'Side'...
  return [ 'Top', 'Right', 'Bottom', 'Left' ].reduce((acc, cur) => {
    const key = `padding${cur}` as `padding${SidesUpper}`;
    const val = parseFloat(styles[key]);

    // ... set 'side' = styles['paddingSide']
    acc[cur.toLowerCase() as SidesLower] = val;

    return acc;
  }, { } as { [ k in SidesLower ]: number });
}


/**
 * Gets the current font-size of an element in pixels, to be used as a
 * multiplier for 'ems'
 * @param el The element to get the font size of
 * @return The element's font size in pixels.
 */
const getFontSize = (el?: HTMLElement) => {
  const styles = getComputedStyle(el ?? document.documentElement);
  return parseFloat(styles.fontSize);
}


function usePopper(opened: Ref<boolean>, bounds: Ref<HTMLElement | undefined>) {

  let instance: Instance | null = null;
  const reference = ref<HTMLButtonElement>();
  const element = ref<HTMLUListElement>();
  const wrapper = ref<HTMLDivElement>();

  /**
   * Closes the Popper. This event goes on the window itself.
   * @note We rely on the stopping of event propagation to stop this from firing
   * when we don't want it to.
   */
  const clickClose = () => void (opened.value = false);


  /**
   * Checks if the new focus target is within the wrapper, and closes the Popper
   * if it is not.
   */
  const wrapperFocusout = (event: FocusEvent) => {
    // let the 'click' handler handle things if we don't know what the new
    // target is:
    if (event.relatedTarget == null) return;

    // check if they transferred focus to something inside the wrapper
    else if (!wrapper.value?.contains(event.relatedTarget as Element)) {
      opened.value = false;
    }
  }


  /**
   * Generates the configuration for the Popper Instance. 
   * @note Needs to be generated every time because just "setting" the
   * 'eventListeners' to false option will make it the *only* "set" modifier,
   * causing popper to break upon re-opening.
   */
  const generateModifiers = (open: boolean) => {
    return [
      // We disable gpuAcceleration to force Popper to use 'inset' instead of
      // 'transform3d' to avoid the non-transformed "ghost" of the element from
      // expanding the viewport
      { ...computeStyles, options: { gpuAcceleration: false }},
      // preventOverflow
      { ...preventOverflow, enabled: true, options: {
        boundary: bounds.value ?? document.querySelector('#app'),
        padding: getPadding(bounds.value),
        rootBoundary: 'document'
      }},
      // offset
      { ...offset, enabled: true, options: {
        offset: [ 0, getFontSize(element.value) * 0.5 ]
      }},
      // eventListeners
      { ...eventListeners, enabled: open }
    ];
  }


  /**
   * Creates the Popper instance and adds the window event listener.
   */
  const mount = () => {
    if (!reference.value || !element.value)
      throw new Error("DOM refs to self somehow not established?");

    if (instance !== null) {
      instance.destroy();
      instance = null;
    }

    instance = createPopper(reference.value, element.value, {
      modifiers: generateModifiers(false),
      placement: 'bottom',
    });

    window.addEventListener('click', clickClose, { capture: false });
  }

  /**
   * Cleans up the popper instance and removes the window's close event
   * listener.
   */
  const unmount = () => {
    if (instance !== null) {
      instance.destroy();
      instance = null;
    }

    window.removeEventListener('click', close);
  }


  // Use watch instead of onMounted because the 'overflow-bounds' ref could
  // technically be reactive and change.
  watch(bounds, value => {
    if (value === undefined) {
      unmount();
    } else {
      // re-mount
      unmount();
      mount();
    }
  });


  // Update Popper position when opened
  watch(opened, async isOpen => {
    // toggle the modifiers depending on current state
    await instance?.setOptions({ modifiers: generateModifiers(isOpen) });
    if (isOpen) await instance?.update();
  });


  // Update popper's position if TheArmorInfo changes size (and popper is open).
  // This will happen when they have something selected and change list: when
  // the deselect happens, the dom is shunted upwards
  watch(toRef(store.state, 'selected'), () => {
    if (opened.value) instance?.update();
  });

  watch(toRef(store.state.settings, 'selectedList'), () => {
    if (opened.value) instance?.update();
  })

  onMounted(mount);
  onUnmounted(unmount);

  return {
    popperReference: reference,
    popperElement: element,
    wrapper, wrapperFocusout
  };
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

      // Use ?? because there's a chance that 'settings.selectedList' updates
      // from Firestore before the 'state.listInfo' array is downloaded --
      // meaning we won't have the list names.
      return store.state.listInfo.find(({ id }) => sel.value == id)
        ?? defaults.settings().selectedList;
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
  position: relative;
}

.name {
  height: 1em;
  font-weight: 400;
  @include dot-dot-dot;
}

.name, .picker-box input, .create-new {
  box-sizing: content-box;
  padding: 0.45em 0.55em;
}

.picker-box input, .create-new {
  height: 1em;
}

.selected-list {
  .picker-box { border: 0.15em solid $border-color; }
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
  @media (max-width: math.div($break-small + $break-tiny, 2)) {
    width: 16rem;
  }

  border-radius: 0.25em;
  border: 0.15em solid transparent;

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
    border-radius: 0.35em;
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

  // the 'form.picker-box' when they're entering a new name
  .picker-box { border: none; }

  // direct-child button, so only when it's not the input field
  >button {
    flex-grow: 1;
    svg { margin-right: 0.50em; }
  }
}
</style>