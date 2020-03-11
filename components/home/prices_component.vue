<script>
export default {
  data() {
    return {
      price_plans: [
        {
          name: 'Free',
          subtitle: 'Simple, Easy, Fast.',
          price: '0.00',
          special: false,
          features: [
            'Access To All Layouts',
            'Access To All Themes',
            '100MB Storage',
            'Mobile Optimized Website',
            'Unlimited Bandwidth'
          ]
        },
        // {
        //   name: 'Plus',
        //   subtitle: 'All round package',
        //   price: '5',
        //   special: true,
        //   features: [
        //     'Access To All Layouts',
        //     'Access To All Themes',
        //     '300MB Storage',
        //     'Mobile Optimized Website',
        //     'Unlimited Bandwidth',
        //     'Temporary Site Add-On',
        //     'Automatic Site Backups (Monthly)',
        //     'Connect Your Domain',
        //     'Remove Kreoh Branding'
        //   ]
        // },
        {
          name: 'Premium',
          subtitle: 'You now have the high ground',
          price: '5.00',
          special: false,
          features: [
            'Access To All Layouts',
            'Access To All Themes',
            '300MB',
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
  <v-col
    cols="12"
    class="pricing--content"
    :class="{ 'm-pricing--content': $vuetify.breakpoint.smAndDown }"
  >
    <v-row
      v-if="!$vuetify.breakpoint.smAndDown"
      class="pricing--wrapper justify-center ma-0"
    >
      <v-col
        v-for="(plan, index) in price_plans"
        :key="index"
        cols="6"
        class="pricing--container d-flex flex-column align-center justify-center"
      >
        <div
          v-if="plan.special"
          cols="12"
          class="most-popular d-flex justify-center align-center info white--text"
        >
          <p class="font-weight-bold">Most Popular</p>
        </div>
        <v-row
          align-content="start"
          class="pricing--item elevation-3 ma-0 mx-1"
        >
          <v-col
            cols="12"
            class="pricing--item-header d-flex flex-column align-center justify-center pa-0 my-5"
          >
            <p style="font-size: 20px" class="font-weight-bold info--text">
              {{ plan.name }}
            </p>
            <p style="font-size: 52px" class="font-weight-bold">
              &euro;{{ plan.price }}
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
    <v-row v-else class="m-pricing--wrapper ma-0">
      <v-col
        v-for="(plan, index) in price_plans"
        :key="index"
        cols="12"
        class="m-pricing--container"
      >
        <v-card scrollable>
          <v-card-title class="d-flex flex-column align-start">
            <p
              v-if="plan.special"
              :style="{ fontSize: '16px' }"
              class="font-weight-bold special--tag text-center mb-3"
            >
              Most Popular
            </p>
            <p :style="{ fontSize: '18px' }" class="font-weight-bold">
              {{ plan.name }}
            </p>
            <p class="caption font-weight-light">{{ plan.subtitle }}</p>
          </v-card-title>
          <v-card-subtitle class="d-flex pt-3">
            <p
              :style="{ fontSize: '24px' }"
              class="black--text font-weight-bold"
            >
              &euro;{{ plan.price }}
            </p>
            <span class="font-weight-light caption">/month</span>
          </v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text class="pa-1">
            <v-expansion-panels focusable flat>
              <v-expansion-panel>
                <v-expansion-panel-header expand-icon="mdi-menu-down">
                  View Features
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <p
                    v-for="(feature, f_index) in plan.features"
                    :key="f_index"
                    class="my-3 font-weight-bold"
                  >
                    {{ feature }}
                  </p>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
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
  height: 65%;
  padding: 0 15%;
}

.m-pricing--content {
  height: auto;
  padding: 0 5%;
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

.special--tag {
  width: 100%;
  background-color: #bbdefb;
  color: #0d47a1;
  border-radius: 3px;
}
</style>
