<template>
  <div @click="handleClick" class="armor-item">
    <!-- If Armor: -->
    <template v-if="armor">
      <button class="item-container">
        <img :src="armorSprite" aria-hidden="true" alt="">
      </button>
      <span>{{ armor.base || armor.defense }}</span>
    </template>
    <!-- If Blank: -->
    <template v-else>
      <div class="item-container blank">
        <img src="@/assets/blank.png" aria-hidden="true" alt="">
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ArmorItem',
  props: {
    armor: {
      type: [ Object ],
      required: false
    }
  },
  computed: {
    armorSprite: function() {
      return require(`@/assets/${this.armorFolder}/${this.armor.id}.png`);
    },
    armorFolder: function() {
      return this.armor.id.substring(0, this.armor.id.indexOf('_'));
    }
  },
  methods: {
    handleClick: function() {
      if (this.armor === undefined) return false;
      console.log(`"${this.armor.name}" was clicked.`);
    }
  }
}
</script>

<style scoped>
img {
  display: block;
  width: 100%;
  height: 100%;
}

.armor-item {
  box-sizing: content-box;
  position: relative;
}

.item-container {
  padding: 0.65rem;
}

.item-container:not(.blank) {
  cursor: pointer;
}

span {
  text-align: center;
  display: block;
  position: absolute;
  font-size: 1.10rem;
  font-weight: 400;
  bottom: -0.15rem;
  right: -0.15rem;
  padding: 0.30rem;
  width: 2.25rem;
}

.item-container, span {
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px) brightness(60%);
}

.blank {
  background-color: rgba(45, 45, 45, 0.8);
}

.item-container::after, span::after {
  content: "";
  position: absolute;
  z-index: -1;
  top: 0.2rem;
  left: 0.2rem;
  right: 0.2rem;
  bottom: 0.2rem;
  border: 0.05rem solid rgba(204, 200, 196, 0.5);
}

.item-container {
  border-radius: 0.35rem;
}

span {
  border-radius: 0.45rem;
}

.item-container::after, span::after {
  border-radius: 0.25rem;
}
</style>