<template>
  <div @click="handleClick" class="armor-item">
    <button class="item-container">
      <img :src="armorSprite" class="item-sprite" aria-hidden="true" alt="">
    </button>
    <span>{{ armor.base || armor.defense }}</span>
  </div>
</template>

<script>
export default {
  name: 'ArmorItem',
  props: [ 'armor' ],
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
      console.log(`"${this.armor.name}" was clicked.`);
    }
  }
}
</script>

<style scoped>
.armor-item {
  box-sizing: border-box;
  position: relative;
  margin: 0.5rem;
}

.item-container {
  padding: 0.35em;
  cursor: pointer;
}

span {
  text-align: center;
  display: block;
  position: absolute;
  font-size: 1.10em;
  font-weight: 400;
  bottom: -0.15em;
  right: -0.15em;
  padding: 0.30em;
  width: 2.25em;
}

.armor-item, span {
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px) brightness(10%);
}

.armor-item::after, span::after {
  content: "";
  position: absolute;
  z-index: -1;
  top: 0.2em;
  left: 0.2em;
  right: 0.2em;
  bottom: 0.2em;
  border: 0.05em solid rgb(60, 60, 60);
}

.armor-item, .armor-item::after {
  border-radius: 0.35em;
}

span, span::after {
  border-radius: 0.25em;
}
</style>