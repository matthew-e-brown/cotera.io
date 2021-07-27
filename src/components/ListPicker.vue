<template>
  <div class="list-picker">

    <button type="button" class="option-button">
      <fa-icon icon="ellipsis-v" class="fa-fw" />
      <span>{{ selected.name }}</span>
    </button>

    <ul>
      <li v-for="(info, i) in listInfo" :key="info.id">

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

        <button type="button" @click="add">
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
            @keydown.esc="stopAdd"
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
import { defineComponent, Ref, toRef, ref, nextTick, computed } from 'vue';

import store from '@/store';
import { ListID, ListInfo } from '@/store/types';


export default defineComponent({
  setup() {
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
      listInfo, selected,
      edit, beingEdited, editingTemp, stopEdit, submitEdit, editInput,
      add, beingAdded, stopAdd, submitAdd, addInput,
      moveDown, moveUp, select, remove
    };
  }
});
</script>

<style scoped lang="scss">
.list-picker {
  color: $fg-color;
  position: relative;

  ul { display: none }
  &:focus-within ul { display: block; }
}

.option-button {
  width: 14rem;
  span { @include dot-dot-dot; }
}

button { color: inherit; }
button:disabled { opacity: 0.25; }

ul {
  list-style-type: none;
  position: absolute;
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

.picker-box {
  box-sizing: border-box;
  width: 20.00rem;

  padding-right: 0.25em;

  background-color: $bg-color-accent;

  display: grid;
  align-items: stretch;

  column-gap: 0.5em;
  @at-root div#{&} { grid-template-columns: 1fr repeat(4, 1.5em); }
  @at-root form#{&} { grid-template-columns: 1fr repeat(2, 1.5em); }

  // all buttons: name, and the little ones
  button { padding: 0.25em; }

  // .name and input
  >:first-child {
    margin-left: 0;
    text-align: left;
    padding-left: 0.55em + 0.25em;
  }

  .name { @include dot-dot-dot; }

  input {
    width: unset;
    border-radius: 0;
    background-color: $bg-color-accent;
  }

  >:last-child { margin-right: 0; }
}

.picker-button {
  color: $fg-color;
  background-color: transparent;

  display: flex;
  align-items: center;
  justify-content: center;
}

li:last-child {
  color: $fg-color-dimmer;
  display: flex;

  // direct-child button, so only when it's not the input field
  >button {
    flex-grow: 1;
    svg { margin-right: 0.50em; }
  }
}

// Set the heights of the inputs
.picker-box>:first-child, li:last-child>button {
  box-sizing: content-box;
  padding: 0.45em 0.55em;
  height: 1em;
}
</style>