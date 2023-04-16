<template>
  <v-row class="max-width-100 flex-nowrap">
    <v-col class="post_profile max-width-100 me-4 my-2 py-12 rounded-0" cols="2">
      <v-row justify="center" class="mb-4">
        <ProfilePictureComponent v-bind="data.users[post.user_id]" :user_id="post.user_id" size="60"/>
      </v-row>
      <v-row justify="center" class="my-2">
        {{ data.users[post.user_id].username }}
      </v-row>
      <v-row justify="center">
        {{ data.users[post.user_id].profile_tag }}
      </v-row>
    </v-col>
    <v-col class="mb-2 mt-6 pr-4 d-flex flex-column flex-nowrap flex-shrink-1" cols="10">
      <v-row class=" mb-2">
        <v-col class="">
          <!-- .ql-editor enables the styles that make the post look like in the editor-->
          <div v-html="post.content" class="ql-editor text-wrap flex-wrap" />
        </v-col>
      </v-row>
      <v-spacer />
      <v-row class="post_gutter max-width-100 px-4 pt-1 pb-1 flex-shrink-1 v-card-actions">
        <v-col>
          <v-chip-group class="mb-2">
            <v-chip v-for="(n, r) in post.reactions" :key="r"
                    v-on="store.userID !== 0 ? {
                              'click': () => n.reacted ? reactDec(post.post_id, r) : reactInc(post.post_id, r)
                            } : {}"
                    :class="{ 'reacted': n.reacted }" color="primary-darken-1">
              {{ r }} {{ n.count }}
            </v-chip>
            <v-menu content-class="react_menu d-flex flex-row flex-wrap" attach :scrim="false" location="top">
              <template #activator="{ props }">
                <v-chip v-if="store.userID !== 0" v-bind="props">
                  +
                </v-chip>
              </template>
              <v-chip v-for="i in 10" :key="i">😋</v-chip>
            </v-menu>
          </v-chip-group>
        </v-col>
        <v-spacer />
        <v-col v-if="post.post_id !== first_post && (store.userID === post.user_id || store.isAdmin)"
               cols="auto" class="pa-0">
          <v-dialog v-model="deleteDialog" width="400">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" variant="flat">Delete</v-btn>
            </template>
            <v-card>
              <v-card-title>Delete</v-card-title>
              <v-card-text>Are you sure you wish to delete this post?</v-card-text>
              <v-card-actions>
                <v-btn @click="delPost(post.post_id)">Delete</v-btn>
                <v-btn @click="deleteDialog = false">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col cols="auto" class="pa-0 mb-3">
          <v-btn icon @click="copyLink(post.post_id)" class="ml-4 mb-2">
            <v-icon icon="mdi-link-variant" size="30"></v-icon>
          </v-btn>

        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup>
</script>

<style scoped>

</style>
