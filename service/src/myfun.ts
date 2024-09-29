import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { isNotEmptyString } from './utils/is';
import FormData  from 'form-data'
import  proxy from "express-http-proxy"
import pkg from '../package.json'

 const API_BASE_URL = isNotEmptyString(import.meta.env.OPENAI_API_BASE_URL)
    ? import.meta.env.OPENAI_API_BASE_URL
    : 'https://api.openai.com'

export const lumaProxy=proxy(import.meta.env.LUMA_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    //mlog("sunoapi")
    if ( import.meta.env.LUMA_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+import.meta.env.LUMA_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+import.meta.env.OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
});

export const runwayProxy=proxy(import.meta.env.RUNWAY_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    //mlog("sunoapi")
    if ( import.meta.env.RUNWAY_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+import.meta.env.RUNWAY_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+import.meta.env.OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
});

export const klingProxy=proxy(import.meta.env.KLING_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    //mlog("sunoapi")
    if ( import.meta.env.KLING_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+import.meta.env.KLING_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+import.meta.env.OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
});

export const viggleProxy=proxy(import.meta.env.VIGGLE_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    //mlog("sunoapi")
    if ( import.meta.env.VIGGLE_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+import.meta.env.VIGGLE_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+import.meta.env.OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
})


export const ideoProxy=proxy(import.meta.env.IDEO_SERVER??  API_BASE_URL, {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return  req.originalUrl //req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) { 
    if ( import.meta.env.IDEO_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+import.meta.env.IDEO_KEY;
    else   proxyReqOpts.headers['Authorization'] ='Bearer '+import.meta.env.OPENAI_API_KEY;  
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['Mj-Version'] = pkg.version;
    return proxyReqOpts;
  },
  
})

//req, res, next
export const ideoProxyFileDo=async( req:Request, res:Response, next?:NextFunction)=>{ 
    console.log('req.originalUrl', req.originalUrl );
    let  API_BASE_URL = isNotEmptyString(import.meta.env.OPENAI_API_BASE_URL)
    ? import.meta.env.OPENAI_API_BASE_URL
    : 'https://api.openai.com'
    API_BASE_URL= import.meta.env.IDEO_SERVER??  API_BASE_URL
    if(req.file.buffer) {
      const fileBuffer = req.file.buffer;
      const formData = new FormData();
      formData.append('image_file',  fileBuffer,  { filename:  req.file.originalname }  );
      formData.append('image_request',  req.body.image_request );
     try{
       let url = `${API_BASE_URL}${req.originalUrl}` ;
      let responseBody = await axios.post( url , formData, {
              headers: {
              Authorization: 'Bearer '+ (import.meta.env.IDEO_KEY??import.meta.env.OPENAI_API_KEY) ,
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
    // if ( import.meta.env.VIGGLE_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+import.meta.env.VIGGLE_KEY;
    // else   proxyReqOpts.headers['Authorization'] ='Bearer '+import.meta.env.OPENAI_API_KEY;  
    console.log('req.originalUrl', req.originalUrl );
    let  API_BASE_URL = isNotEmptyString(import.meta.env.OPENAI_API_BASE_URL)
    ? import.meta.env.OPENAI_API_BASE_URL
    : 'https://api.openai.com'
    API_BASE_URL= import.meta.env.VIGGLE_SERVER??  API_BASE_URL
    if(req.file.buffer) {
      const fileBuffer = req.file.buffer;
      const formData = new FormData();
      formData.append('file',  fileBuffer,  { filename:  req.file.originalname }  );
     // formData.append('model',  req.body.model );
     try{
       let url = `${API_BASE_URL}${req.originalUrl}` ;
      let responseBody = await axios.post( url , formData, {
              headers: {
              Authorization: 'Bearer '+ (import.meta.env.VIGGLE_KEY??import.meta.env.OPENAI_API_KEY) ,
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