<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useMessage,NButton,NInput,NTag,NSelect,NPopover,NSwitch } from 'naive-ui';
import { t } from '@/locales';
import { mlog, upImg } from '@/api';
import { homeStore } from '@/store';
import { getRandomInt } from '@/api/runwayml';
import { pixFeed, pixFetch } from '@/api/pixverse';
import { pixverseTask } from '@/api/pixverseStore';
import pixEffacts from "./pixEffact.json";
import pixCameras from "./pixCamera.json";


const vf=[{s:'width: 100%; height: 100%;',label:'1:1',value:'1:1'}
,{s:'width: 100%; height: 75%;',label:'4:3',value:'4:3'}
,{s:'width: 75%; height: 100%;',label:'3:4',value:'3:4'}
,{s:'width: 100%; height: 50%;',label:'16:9',value:'16:9'}
,{s:'width: 50%; height: 100%;',label:'9:16',value:'9:16'}
 ];

 const mvOption= [
{label:'Verion: V4.5',value: 'v4.5'}
,{label:'Verion: V4',value: 'v4'}
 ,{label:'Verion: V3.5',value: 'v3.5'}
// ,{label:'Verion: V3',value: 'v3'}
// ,{label:'Verion: v2.5',value: 'v2.5'}
 ]
const qualityOption= [
{label:'Quality:  360p Turbo',value: '360p'}
,{label:'Quality: 540p 1.5X',value: '540p'}
,{label:'Quality: 720p 2X',value: '720p'}
 ]

 const modeOption= [
{label:t('mj.mode')+': Normal',value: 'normal'}
 ]

  const styleOption= [
//{label:'Please select style, can null',value: ''} ,
{label:'Style: Cyberpunk',value: 'cyberpunk'}
,{label:'Style: Anime',value: 'anime'} 
,{label:'Style: Comic',value: 'comic'} 
,{label:'Style: Clay',value: 'clay'} 
,{label:'Style: 3D Animation',value: '3d_animation'} 
 ]
 
const durationOptions=[ {label:t('mj.duration')+':5s',value:5},{label:t('mj.duration')+':8s',value:8}]


const f= ref({pe_index:-1, style:null, prompt:'',quality:'360p',negative_prompt:'',image:'',image_tail:''
,aspect_ratio:'1:1',model:'v4.5', duration:5,motion_mode:'normal',camera_movement:''});
const st= ref({isLoading:false});
const fsRef= ref() ; 
const fsRef2= ref() ; 
const ms = useMessage();
const exItem= ref<pixverseTask>()
const clearInput = ()=>{
    f.value.prompt='';
    f.value.image= '';
    f.value.image_tail= '';
    f.value.style=null
    fsRef.value=''
    fsRef2.value='';
    f.value.pe_index= -1 ; 
    exItem.value= undefined
    f.value.camera_movement=''
}
function selectFile(input:any){
   // fsFile.value= input.target.files[0];
    upImg(input.target.files[0]).then(d=>{
        f.value.image= d;
        fsRef.value=''
    }).catch(e=>ms.error(e));
}
function selectFile2(input:any){ 
    
    upImg(input.target.files[0]).then(d=>{
        f.value.image_tail= d;
        fsRef2.value=''
        if(f.value.image==''){
            ms.info( t('mj.needImg'))
        }
    }).catch(e=>ms.error(e));
}

const create= async()=>{
    mlog('createImg', 'asdfdfd')
    st.value.isLoading= true
    let  obj={}
    let objY={
        "prompt": f.value.prompt,
        "model": f.value.model,
        "quality": f.value.quality,
        "duration": f.value.duration,
        "aspect_ratio": f.value.aspect_ratio,
        "motion_mode": f.value.motion_mode,
        "seed":  getRandomInt(648043228, 1648043228)
    }
    obj={...objY}
    if( f.value.image && f.value.image_tail){
        obj={...objY,'frame':[ f.value.image,f.value.image_tail]}
    }else if( f.value.image){
        obj={...objY,'img_url': f.value.image }
    }
    if (exItem.value ){
        obj={...obj,'original_video_id': exItem.value?.video_id, "extend": 1,  "platform": "web"}
    }
    if(f.value.style){
        obj={...obj,style:f.value.style}
    }
    if(f.value.pe_index>-1){
        try {
            let template_id= pixEffact.value[f.value.pe_index].template_id
            obj={...obj, template_id}
        } catch (error) { 
        }
         
    }
    if(f.value.camera_movement ){
        obj={...obj,camera_movement:f.value.camera_movement} 
    }
    try {
        const d:any= await pixFetch('/generate' , obj  )
        mlog('img', d );
        if(d.ErrCode==0){ 
            pixFeed(d.Resp.video_id)
        }
    } catch (error) {
        
    }
    st.value.isLoading= false

}
watch(()=>homeStore.myData.act, (n)=>{
     if(n=='pix.extend'){
       mlog("pix.extend", homeStore.myData.actData )
       exItem.value = homeStore.myData.actData as pixverseTask
     }
});

onMounted(() => {
    homeStore.setMyData({ms:ms}) 
     
});

const selecteffect = (i:number)=>{
    f.value.pe_index= i ; 
    
    f.value.prompt= pixEffact.value[i].display_prompt
}
const pixEffact= computed(()=>{
    
    return pixEffacts;
});

const pixCamera = computed(()=>{
    
    return pixCameras;
});

</script>
<template>
<div class="p-2">  
    <div class=" flex items-center justify-between space-x-1">
        <template  v-for="(item,index) in vf" >
            <section class="aspect-item flex-1 rounded border-2 dark:border-neutral-700 cursor-pointer"  :class="{'active':f.aspect_ratio==item.value}"  @click="f.aspect_ratio=item.value">
                <div class="aspect-box-wrapper mx-auto my-2 flex h-5 w-5 items-center justify-center">
                    <div class="aspect-box rounded border-2 dark:border-neutral-700" :style="item.s"></div>
                </div>
                <p class="mb-1 text-center text-sm">{{ item.label }}</p>
            </section>
        </template>
    </div>
    <div class="pt-1" >
      <n-input v-model:value="f.prompt" 
                :placeholder="$t('video.descpls')"  type="textarea"  size="small"   
                :autosize="{ minRows: 3, maxRows: 12  }"  />
    </div>
    <div  class="pt-1">
       <n-select v-model:value="f.model" :options="mvOption" size="small" />
    </div>
     <div  class="pt-1">
       <n-select v-model:value="f.quality" :options="qualityOption" size="small" />
    </div>
     <div  class="pt-1">
       <n-select v-model:value="f.motion_mode" :options="modeOption" size="small" />
    </div>
    <div  class="pt-1">
       <n-select v-model:value="f.duration" :options="durationOptions" size="small" />
    </div>
     <div  class="pt-1">
       <n-select v-model:value="f.style" :options="styleOption" size="small" clearable  placeholder="Please select style" />
    </div>
    <div class="pt-2">
        <div class="flex justify-start  items-end">
            <div> 
                <input type="file"  @change="selectFile"  ref="fsRef" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>
                <div   class="h-[80px] w-[80px]   overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer" @click=" fsRef.click()">
                    <img :src="f.image" v-if="f.image" />
                    <div class="text-center" v-else>{{ $t('video.selectimg') }}</div> 
                    
                </div>
            </div>
            <div class="pl-2"> 
                <input type="file"  @change="selectFile2"  ref="fsRef2" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>
                <div class="h-[80px] w-[80px] overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer" @click=" fsRef2.click()">
                    <img :src="f.image_tail" v-if="f.image_tail" />
                    <div class="text-center" v-else>{{ $t('video.endImg') }}</div> 
                </div>
            </div>
           
        </div>
    </div>  

    <div class="pt-2 flex items-end justify-between">
         <div>
            <NPopover trigger="hover">
                <template #trigger>
                    <div   class="h-[70px] w-[120px]  relative  overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer" >
                        <template v-if="f.pe_index>-1">
                            <img :src="pixEffact[f.pe_index].thumbnail_path"  />
                            <div class="absolute top-1 right-1 text-white/75 text-[14px]" >{{pixEffact[f.pe_index].display_name }}</div>
                        </template>
                        <div class="text-center" v-else>{{ $t('mj.selecteff') }}</div> 
                    </div>
                </template>
                <div class="w-[320px] h-[400px] overflow-y-auto overflow-hidden mx-[-4px]">
                    <div class="grid grid-cols-2 gap-2">
                        <div v-for="(item, index) in pixEffact" :key="index" >
                            <div class="relative   overflow-hidden cursor-pointer " @click="selecteffect(index)">
                                <!-- <video class="h-[72px] w-full rounded-md object-cover"  :src="item.video"  :poster="item.poster" 
                                 autoplay  loop  playsinline ></video> -->
                                  <img :src="item.thumbnail_path"  />
                                <div class="absolute top-1 right-1 text-white/75 text-[14px]" >{{ item.display_name }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </NPopover>
        </div>

        <div>
            <NPopover trigger="hover">
                <template #trigger>
                    <div   class="h-[70px] w-[120px]  relative  overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer" >
                        <template v-if="f.camera_movement!='' ">
                            <img :src="pixCamera.image[f.camera_movement]"  />
                            <div class="absolute top-1 right-1 text-white/75 text-[14px]" >{{ pixCamera.name[f.camera_movement]??f.camera_movement }}</div>
                        </template>
                        <div class="text-center" v-else>Perspective</div> 
                    </div>
                </template>
                <div class="w-[320px] h-[400px] overflow-y-auto overflow-hidden mx-[-4px]">
                    <div class="grid grid-cols-2 gap-2">
                         <div v-for="(item, index) in pixCamera.image" :key="index"  @click="f.camera_movement=index" >
                            <div class="relative   overflow-hidden cursor-pointer "  >
                                <!-- <video class="h-[72px] w-full rounded-md object-cover"  :src="item.video"  :poster="item.poster" 
                                 autoplay  loop  playsinline ></video> -->
                                  <img :src="item"  />
                                <div class="absolute bottom-1 right-1 text-white/75 text-[14px]" >{{ pixCamera.name[index]??index }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </NPopover>
        </div>
    </div>

    <div v-if="exItem && exItem.data" class="pt-2">
        <div class="flex justify-between items-center">
            <div  >
                <n-popover trigger="hover">
                    <template #trigger>
                    <div class="line-clamp-1">
                    {{ $t('video.extend') }}: 
                     <template   v-if="exItem.data.prompt">{{ exItem.data.prompt?exItem.data.prompt:exItem.video_id }}</template>
                     
                    </div>
                    </template>
                    <div v-if="exItem.video_id" >ID: {{ exItem.video_id }}</div>
                    <div v-if="exItem.data.video_duration" class=" justify-between flex" >
                        <div>{{ t('mj.duration') }}: {{exItem.data.video_duration}}s</div>
                        <div>Model: {{ exItem.data.model }}</div>
                    </div>
                    <div class=" justify-between flex">
                        <div>{{ t('mj.mode') }}: {{ exItem.data.motion_mode  }}</div>
                        <div>Quality:  {{ exItem.data.quality  }}</div>
                    </div>
                    <div v-if="exItem.data.created_at" >createdAt: {{ new Date( exItem.data.created_at).toLocaleString() }}</div>

                    
                    
                </n-popover>
            </div>
        </div>
        <div class="relative flex items-center justify-center bg-white bg-opacity-10 rounded-[5px] overflow-hidden aspect-[16/8.85] ">
            <video   loop  playsinline  controls  
                referrerpolicy="no-referrer" :poster="exItem.data.first_frame" 
                class="w-full h-full object-cover"  >
                <source  :src="exItem.data.url" referrerpolicy="no-referrer" type="video/mp4"  >
            </video>   
        </div>
            
    </div>

     <section class="pt-2 flex justify-between items-end" >
        <div class="relative"> 
            <div  class=" cursor-pointer pb-2" @click="clearInput"  v-if="f.image|| f.prompt || f.image_tail||f.camera_movement"><NTag type="success" size="small" :bordered="false" round  ><span class="cursor-pointer">{{$t('video.clear')}}</span></NTag></div>
        </div>
        <div class="text-right">

            <NButton :loading="st.isLoading" type="primary" @click="create()" :disabled="!f.prompt"  >{{$t('video.generate')}}</NButton>
        </div>
    </section>

    
    <div class="pt-2 text-[12px]" v-html="$t('mj.pixinfo')"></div>
</div>
</template>