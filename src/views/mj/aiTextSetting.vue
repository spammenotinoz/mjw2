<script setup lang="ts">

import { homeStore } from '@/store';
import {  computed ,ref } from 'vue'
import aiSetServer from './aiSetServer.vue';
import { NTag,NModal,NButton } from 'naive-ui'
const isHideServer= computed( ()=>homeStore.myData.session.isHideServer )
const st= ref({show:false})
</script>
<template>
<div class="whitespace-pre-wrap pb-10" v-if="!isHideServer"> 
</div>
<NModal v-model:show="st.show" :title="$t('mjset.server')" preset="card"  style="width: 95%; max-width: 640px">
    <aiSetServer v-if="st.show" @close="st.show=false"/>
</NModal>
</template>