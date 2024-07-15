<script setup lang="ts">
import { SvgIcon } from '@/components/common';
import { homeStore } from '@/store'
import { computed,watch ,ref  } from 'vue'
import { router } from '@/router'

import aiDrawInput from './aiDrawInput.vue'; 
import {NDrawerContent,NDrawer} from "naive-ui";
import { isDisableMenu } from '@/api';
const st= ref({show:true})

const goHome =computed(  () => {
  //router.push('/')
  return router.currentRoute.value.name
});
function drawSent(e:any){
  st.value.show=false;
  //$emit('drawSent', e)
  homeStore.setMyData({act:'draw',actData:e});
}

watch(()=>homeStore.myData.act, (n:string)=>{
    if('draw'==n){
        router.push('/draw')
    }
    if('music'==n){
        router.push('/music')        
    }
    if('video'==n){
        router.push('/video')   
    }
});
</script>
<template>
  <div class=" bg-gray-100 dark:bg-[#282832] h-[55px] flex  justify-around  items-center dark:text-white/70 " >

      <div  v-if="!isDisableMenu ( 'draw')"  class="flex items-center justify-center flex-col "  @click="homeStore.setMyData({act:'draw'}) " >
        <SvgIcon icon="ic:outline-palette" class="text-3xl"></SvgIcon>
        <div class="text-[13px]">{{$t('mjtab.draw')}}</div>
      </div>

      <div  v-if="!isDisableMenu ( 'gallery')"  class="flex items-center justify-center flex-col " @click="homeStore.setMyData({act:'gallery'})" >
        <SvgIcon icon="material-symbols:imagesmode-outline" class="text-3xl"></SvgIcon>
        <div class="text-[13px]">{{$t('mjtab.gallery')}}</div>
      </div> 
	  
	  <div  v-if="!isDisableMenu ( 'music')"  class="flex items-center justify-center flex-col "  @click="homeStore.setMyData({act:'music'}) " >
        <SvgIcon icon="arcticons:wynk-music" class="text-3xl flex-1"></SvgIcon>
        <div class="text-[13px]">Music</div>
      </div>
	  
	  <div  v-if="!isDisableMenu ( 'video')"  class="flex items-center justify-center flex-col "  @click="homeStore.setMyData({act:'video'}) " >
        <SvgIcon icon="ri:video-on-line" class="text-3xl flex-1"></SvgIcon>
        <div class="text-[13px]">Video</div>
      </div>
  
  </div>

  <n-drawer v-model:show="st.show"  class="!h-[90vh] !max-h-[660px]"     placement="bottom" v-if="goHome=='draw'">
    <n-drawer-content   style="--n-body-padding:0" class="h-full">
      <aiDrawInput @draw-sent="drawSent" @close="st.show=false"  />
    </n-drawer-content>
  </n-drawer>
</template>