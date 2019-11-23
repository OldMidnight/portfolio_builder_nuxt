<script>
// import goTo from 'vuetify/es5/services/goto'
export default {
  data() {
    return {
      current_view_item: 'item-intro'
    }
  },
  methods: {
    scrollDown() {
      let el
      switch (this.current_view_item) {
        case 'item-intro':
          el = document.querySelector('#item-layouts')
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          // console.log(goTo)
          // goTo(el, { duration: 300, offset: 0 })
          this.current_view_item = 'item-layouts'
          break

        case 'item-layouts':
          el = document.querySelector('#item-preview')
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          this.current_view_item = 'item-preview'
          break

        case 'item-preview':
          el = document.querySelector('#item-intro')
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          this.current_view_item = 'item-intro'
          break

        default:
          break
      }
    }
  }
}
</script>

<template>
  <v-container
    class="view-wrapper d-flex flex-column justify-center align-center pa-0"
    fluid
  >
    <v-layout class="top-nav d-flex align-center">
      <div class="d-flex justify-start align-center nav-links pl-4">
        <span class="headline blue--text text--darken-1 font-weight-bold">
          Kreoh
        </span>
        <v-btn color="#0066ff" class="font-weight-light ml-6  " text>
          Subscriptions
        </v-btn>
        <v-btn color="#0066ff" class="font-weight-light" text>
          Support
        </v-btn>
      </div>
      <div class="d-flex justify-end align-center nav-btns pr-6">
        <v-btn color="info" nuxt to="/auth/login" rounded class="white--text">
          Login
        </v-btn>
      </div>
    </v-layout>
    <v-layout class="view-container d-flex flex-column">
      <div class="item-container">
        <div id="item-intro" class="home-view-item">a</div>
        <div id="item-layouts" class="home-view-item">b</div>
        <div id="item-preview" class="home-view-item">c</div>
      </div>
    </v-layout>
    <v-layout
      class="d-flex flex-column justify-center align-center home-item-arrow-container"
    >
      <v-btn x-large icon @click="scrollDown()">
        <v-icon x-large>
          {{
            current_view_item !== 'item-preview'
              ? 'mdi-chevron-down'
              : 'mdi-chevron-up'
          }}
        </v-icon>
      </v-btn>
    </v-layout>
  </v-container>
</template>

<style lang="scss" scoped>
.test {
  border: 1px solid red;
}

.view-wrapper {
  height: 100%;
  // overflow: auto;
}

.view-container {
  height: 87%;
  width: 100%;
  padding: 4% 10% 1% 10%;
  overflow: auto;
}

.item-container {
  height: 100%;
  width: 100%;
}

.home-item-arrow-container {
  height: 8%;
  width: 100%;
  // background-color: #fafafa;
}

.top-nav {
  height: 5%;
  width: 100%;
  background-color: #fafafa;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.main-view {
  height: 100%;
  width: 100%;
}

.home-view-item {
  height: 100%;
  width: 100%;
  margin-bottom: 8%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.nav-links,
.nav-btns {
  height: 100%;
  width: 100%;
}
</style>
