import { gptServerStore, homeStore, useAuthStore } from "@/store";
import { mlog } from "./mjapi";
import { sleep } from "./suno";
import { RunwayTask, runwayStore } from "./runwayStore";
import { PikaTask, pikaStore } from "./pikaStore";
import { getUserEmail } from "@/utils/supabaseClient";

function getHeaderAuthorization(){
    let headers={}
    if( homeStore.myData.vtoken ){
        const  vtokenh={ 'x-vtoken':  homeStore.myData.vtoken ,'x-ctoken':  homeStore.myData.ctoken};
        headers= {...headers, ...vtokenh}
    }

    // Add user email header for cost tracking
    const userEmail = getUserEmail()
    if(userEmail){
        headers['X-OpenWebUI-User-Email'] = userEmail
    }

    if(!gptServerStore.myData.RUNWAY_KEY){ 
        const authStore = useAuthStore()
        if( authStore.token ) {
            const bmi= { 'x-ptoken':  authStore.token };
            headers= {...headers, ...bmi }
            return headers;
        }
        return headers
    }
    const bmi={
        'Authorization': 'Bearer ' +gptServerStore.myData.PIKA_KEY
    }
    headers= {...headers, ...bmi }
    return headers
}

export const  getUrl=(url:string)=>{
    if(url.indexOf('http')==0) return url;
    // Use custom server if configured, otherwise use local backend proxy
    const server = gptServerStore.myData.PIKA_SERVER;

    const pro_prefix= url.indexOf('/pro')>-1?'/pro':'';//homeStore.myData.is_luma_pro?'/pro':''
    url= url.replaceAll('/pro','')
    // If server URL is provided and contains /pika or /pro, use as-is
    if(server && (server.indexOf('/pika')>0 || server.indexOf('/pro')>0)){
        return `${server}/pika${url}`;
    }
    // If server URL is provided, add /pika prefix
    if(server){
        return `${server}${pro_prefix}/pika${url}`;
    }
    // Otherwise use local backend proxy with /pika prefix
    return `${pro_prefix}/pika${url}`;
}


export const pikaFetch=(url:string,data?:any,opt2?:any )=>{
    mlog('pikaFetch', url  );
    let headers= opt2?.upFile?{}: {'Content-Type':'application/json'}
     
    if(opt2 && opt2.headers ) headers= opt2.headers;

    headers={...headers,...getHeaderAuthorization()}
   
    return new Promise<any>((resolve, reject) => {
        let opt:RequestInit ={method:'GET'};
       
        opt.headers= headers ;
        if(opt2?.upFile ){
             opt.method='POST';
             opt.body=data as FormData ;
        }
        else if(data) {
            opt.body= JSON.stringify(data) ;
            opt.method='POST';
        }
        fetch(getUrl(url),  opt )
        .then( async (d) =>{
            if (!d.ok) { 
                let msg = '发生错误: '+ d.status
                try{ 
                  let bjson:any  = await d.json();
                  msg = '('+ d.status+')发生错误: '+(bjson?.error?.message??'' ) 
                }catch( e ){ 
                }
                homeStore.myData.ms &&  homeStore.myData.ms.error(msg )
                throw new Error( msg );
            }
     
            d.json().then(d=> resolve(d)).catch(e=>{ 
            
                homeStore.myData.ms &&  homeStore.myData.ms.error('发生错误'+ e )
                reject(e) 
            }
        )})
        .catch(e=>{ 
            if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
                homeStore.myData.ms &&  homeStore.myData.ms.error('跨域|CORS error'  )
            }
            else homeStore.myData.ms &&  homeStore.myData.ms.error('发生错误:'+e )
            mlog('e', e.stat )
            reject(e)
        })
    })

}

export const pikaFeed= async(id:string)=>{
    const sunoS = new pikaStore();
    for(let i=0; i<200;i++){
        try{
            let a= await pikaFetch('/feed/' +id )
            let task= a  as PikaTask;
            mlog("task",a )
            if(!task.videos || task.videos.length==0) continue;
            task.last_feed=new Date().getTime()
            
            
            sunoS.save( task )
            homeStore.setMyData({act:'PikaFeed'});
            if( task.videos[0].status=='error' || 'finished'== task.videos[0].status ){
                break;
            }
        }catch(e){
        }
        await sleep(5200)
    }

}

 