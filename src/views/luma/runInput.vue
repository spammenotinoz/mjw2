<script lang="ts" setup>
import { NTabs, NTabPane } from 'naive-ui';

import RunwayInput from './runwayInput.vue'
import RunmlInput from './runmlInput.vue'
import { gptServerStore } from '@/store';
import { mlog } from '@/api';
import { ref } from 'vue'; 

const st= ref({tab:'runway'});
const handleUpdateValue=(v:string)=>{
   mlog("handleUpdateValue",v)
   gptServerStore.setMyData({TAB_VIDEO:v})
}
const initLoad=()=>{
    st.value.tab='runway'
    if( gptServerStore.myData.TAB_VIDEO=='runwayml'){
         st.value.tab='runwayml'
    }
}

initLoad();


</script>
<template>
<div class="px-2">
	<RunwayInput/>
</div>
</template>