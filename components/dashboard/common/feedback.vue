<script>
export default {}
</script>

<template>
  <v-card class="w-100 border-rounded elevation-1 mx-1">
    <v-col cols="12">
      <p class="title">Leave us some feedback!</p>
      <p class="caption text-center">
        Heyo! Thanks so much for using Kreoh, seriously! This is a one man
        project so having you use this and knowing that it helps you feels great
        &#128513; ! If you have any tips on how I can make Kreoh better or you
        just wan't to hear a joke, use the button to send me a message.
      </p>
    </v-col>
    <v-col cols="12" class="d-flex justify-center">
      <v-btn color="info" nuxt to="/dashboard/message-center?support=true">
        <v-icon large class="mr-3">mdi-face-agent</v-icon> Send me a message!
      </v-btn>
    </v-col>
  </v-card>
</template>
