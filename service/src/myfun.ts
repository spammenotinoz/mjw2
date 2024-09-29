import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { isNotEmptyString } from './utils/is';
import FormData  from 'form-data'
import  proxy from "express-http-proxy"
import pkg from '../package.json'

 const API_BASE_URL = isNotEmptyString(process.env.VITE_OPENAI_API_BASE_URL)
    ? process.env.VITE_OPENAI_API_BASE_URL
    : 'https://api.openai.com'

export const lumaProxy=proxy(process.env.VITE_LUMA_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    //mlog("sunoapi")
    if ( process.env.VITE_LUMA_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.VITE_LUMA_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.VITE_OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
});

export const runwayProxy=proxy(process.env.VITE_RUNWAY_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    //mlog("sunoapi")
    if ( process.env.VITE_RUNWAY_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.VITE_RUNWAY_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.VITE_OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
});

export const klingProxy=proxy(process.env.VITE_KLING_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    //mlog("sunoapi")
    if ( process.env.VITE_KLING_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.VITE_KLING_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.VITE_OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
});

export const viggleProxy=proxy(process.env.VITE_VIGGLE_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    //mlog("sunoapi")
    if ( process.env.VITE_VIGGLE_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.VITE_VIGGLE_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.VITE_OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
})


export const ideoProxy=proxy(process.env.VITE_IDEO_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) { 
    if ( process.env.VITE_IDEO_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.VITE_IDEO_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.VITE_OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
})

//req, res, next
export const ideoProxyFileDo=async( req:Request, res:Response, next?:NextFunction)=>{ 
    console.log('req.originalUrl', req.originalUrl );
    let  API_BASE_URL = isNotEmptyString(process.env.VITE_OPENAI_API_BASE_URL)
    ? process.env.VITE_OPENAI_API_BASE_URL
    : 'https://api.openai.com'
    API_BASE_URL= process.env.VITE_IDEO_SERVER??  API_BASE_URL
    if(req.file.buffer) {
      const fileBuffer = req.file.buffer;
      const formData = new FormData();
      formData.append('image_file',  fileBuffer,  { filename:  req.file.originalname }  );
      formData.append('image_request',  req.body.image_request );
     try{
       let url = `${API_BASE_URL}${req.originalUrl}` ;
      let responseBody = await axios.post( url , formData, {
              headers: {
              Authorization: 'Bearer '+ (process.env.VITE_IDEO_KEY??process.env.VITE_OPENAI_API_KEY) ,
              'Content-Type': 'multipart/form-data',
              //'Mj-Version': pkg.version
            }
        })   ; 
       res.json(responseBody.data );
      }catch(e){ 
        res.status( 400 ).json( {error: e } );
      }

    }else{
      res.status(400).json({'error':'uploader fail'});
    }
    
}

export const viggleProxyFileDo= async( req:Request, res:Response, next?:NextFunction)=>{
    // if ( process.env.VITE_VIGGLE_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.VITE_VIGGLE_KEY;
    // else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.VITE_OPENAI_API_KEY;  
    console.log('req.originalUrl', req.originalUrl );
    let  API_BASE_URL = isNotEmptyString(process.env.VITE_OPENAI_API_BASE_URL)
    ? process.env.VITE_OPENAI_API_BASE_URL
    : 'https://api.openai.com'
    API_BASE_URL= process.env.VITE_VIGGLE_SERVER??  API_BASE_URL
    if(req.file.buffer) {
      const fileBuffer = req.file.buffer;
      const formData = new FormData();
      formData.append('file',  fileBuffer,  { filename:  req.file.originalname }  );
     // formData.append('model',  req.body.model );
     try{
       let url = `${API_BASE_URL}${req.originalUrl}` ;
      let responseBody = await axios.post( url , formData, {
              headers: {
              Authorization: 'Bearer '+ (process.env.VITE_VIGGLE_KEY??process.env.VITE_OPENAI_API_KEY) ,
              'Content-Type': 'multipart/form-data',
              //'Mj-Version': pkg.version
            }
        })   ; 
       res.json(responseBody.data );
      }catch(e){ 
        res.status( 400 ).json( {error: e } );
      }

    }else{
      res.status(400).json({'error':'uploader fail'});
    }
    
}