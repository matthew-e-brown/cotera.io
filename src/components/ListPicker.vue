<template>
  <div class="list-picker">

    <div class="current-name">{{ selected.name }}</div>

    <ul>
      <li v-for="(info, i) in listInfo" :key="info.id">

        <div v-if="info.id !== beingEdited">

          <button type="button" @click="select(info.id)">
            <span>{{ info.name }}</span>
          </button>

          <button type="button" class="move" @click="moveDown(i)">
            <fa-icon icon="caret-down" />
          </button>
          <button type="button" class="move" @click="moveUp(i)">
            <fa-icon icon="caret-up" />
          </button>
          <button type="button" class="edit" @click="edit(info)">
            <fa-icon icon="pen" />
          </button>
          <button
            type="button"
            class="remove"
            @click="remove(info.id)"
            :disabled="info.id == selected.id"
          >
            <fa-icon icon="trash-alt" />
          </button>
        </div>

        <form v-else @submit.prevent="submitEdit(info.id)">
          <input
            type="text"
            ref="editInput"
            v-model="editingTemp"
            @keydown.esc="stopEdit"
          />
          <button type="submit">
            <fa-icon icon="check" />
          </button>
          <button type="button" @click="stopEdit">
            <fa-icon icon="times" />
          </button>
        </form>

      </li>


      <li v-if="beingAdded === null">

        <button type="button" @click="add">
          <fa-icon icon="plus-circle" />
          <span>Add a new list</span>
        </button>

      </li>
      <li v-else>

        <form @submit.prevent="submitAdd">
          <input
            type="text"
            ref="addInput"
            v-model="beingAdded"
            @keydown.esc="stopAdd"
          />
          <button type="submit">
            <fa-icon icon="check" />
          </button>
          <button type="button" @click="beingAdded = null">
            <fa-icon icon="times" />
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
    const editingTemp: Ref<string> = ref("");

    const beingAdded: Ref<string | null> = ref(null);

    const editInput = ref<HTMLInputElement>();
    const addInput = ref<HTMLInputElement>();

    const edit = (info: ListInfo) => {
      // stop the add
      beingAdded.value = null;
      // open up the editing field
      beingEdited.value = info.id;
      editingTemp.value = info.name;
      // select the input (nextTick to wait until its v-if has processed)
      nextTick(() => editInput.value?.focus());
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
        store.renameList(id, beingEdited.value);
        beingEdited.value = null;
        editingTemp.value = "";
      } else {
        throw new Error("Cannot rename to blank");
      }
    }

    const submitAdd = () => {
      if (beingAdded.value !== null && beingAdded.value.length > 0) {
        store.addNewList(beingAdded.value);
        beingAdded.value = null;
      } else {
        // TODO: make this do something for the user to see
        throw new Error("Cannot add blank list name");
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

</style>