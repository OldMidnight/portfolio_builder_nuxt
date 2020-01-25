<script>
export default {
  data() {
    return {
      price_plans: [
        {
          name: 'Basic',
          price: '3.50',
          special: false,
          features: [
            'Access To All Layouts',
            'Access To All Themes',
            '100MB Storage',
            'Mobile Optimized Website',
            'Unlimited Bandwidth'
          ]
        },
        {
          name: 'Plus',
          price: '5',
          special: true,
          features: [
            'Access To All Layouts',
            'Access To All Themes',
            '300MB Storage',
            'Mobile Optimized Website',
            'Unlimited Bandwidth',
            'Temporary Site Add-On',
            'Automatic Site Backups (Monthly)',
            'Connect Your Domain',
            'Remove Kreoh Branding'
          ]
        },
        {
          name: 'Pro',
          price: '8.50',
          special: false,
          features: [
            'Access To All Layouts',
            'Access To All Themes',
            '500MB - 1GB Storage*',
            'Mobile Optimized Website',
            'Priority Response',
            'Feature Requests',
            'Unlimited Bandwidth',
            'Temporary Site Add-On',
            'Automatic Site Backups (Monthly)',
            'Connect Your Domain',
            'Remove Kreoh Branding'
          ]
        }
      ]
    }
  }
}
</script>

<template>
  <v-col cols="12" class="pricing--content">
    <v-row class="pricing--wrapper">
      <v-col
        v-for="(plan, index) in price_plans"
        :key="index"
        cols="4"
        class="pricing--container d-flex flex-column align-center justify-center"
      >
        <div
          v-if="plan.special"
          cols="12"
          class="most-popular d-flex justify-center align-center info white--text"
        >
          <p class="font-weight-bold">Most Popular</p>
        </div>
        <v-row align-content="start" class="pricing--item elevation-3 mx-1 ">
          <v-col
            cols="12"
            class="pricing--item-header d-flex flex-column align-center justify-center"
          >
            <p style="font-size: 20px" class="font-weight-bold info--text">
              {{ plan.name }}
            </p>
            <p style="font-size: 52px" class="font-weight-bold">
              {{ plan.price }} <sup>&euro;</sup>
            </p>
            <p class="caption">per month</p>
          </v-col>
          <v-col cols="12" class="pricing--item-content">
            <div class="features" align="start">
              <div
                v-for="(feature, f_index) in plan.features"
                :key="f_index"
                class="feature pa-2"
              >
                <p style="font-size: 12px" class="font-weight-bold">
                  {{ feature }}
                </p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<style lang="scss" scoped>
.most-popular {
  position: absolute;
  height: 5%;
  top: -3%;
  border: 1px solid #e6e6e6;
  width: 92%;
  // z-index: 5;
  // border-radius: 5px;
}

.pricing--container {
  height: 100%;
  position: relative;
}

.pricing--content {
  height: 80%;
  padding: 0 15%;
}

.pricing--item-header {
  border-bottom: 1px solid #e6e6e6;
  height: 20%;
}

.pricing--item-content {
  // border: 1px solid;
  height: 70%;
  .features {
    height: 100%;
  }
}

.pricing--wrapper,
.pricing--item {
  height: 100%;
}

.feature {
  height: 10%;
}
</style>
