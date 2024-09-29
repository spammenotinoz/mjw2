module.exports = (req, res) => {
  console.log('session.js', req.body);
  try {
    let data = req.body.data; 
    let obj ={
        "status": "Success",
        "message": "",
        "data": {
            "isHideServer": false,
            "isUpload": false,
            "auth":   import.meta.env.VITE_AUTH_SECRET_KEY?true:false ,
            "model": "ChatGPTAPI",
            "amodel": import.meta.env.VITE_OPENAI_API_MODEL?? "gpt-3.5-turbo"
            ,isApiGallery:    import.meta.env.VITE_MJ_API_GALLERY ? true : false 
            ,cmodels : import.meta.env.VITE_CUSTOM_MODELS??'' 
            ,baiduId : import.meta.env.VITE_TJ_BAIDU_ID?? "" 
            ,googleId: import.meta.env.VITE_TJ_GOOGLE_ID?? ""
            , notify : import.meta.env.VITE_SYS_NOTIFY?? "" 
            ,disableGpt4 : import.meta.env.VITE_DISABLE_GPT4?? "" 
            ,isWsrv:  import.meta.env.VITE_MJ_IMG_WSRV?? "" 
            ,uploadImgSize: import.meta.env.VITE_UPLOAD_IMG_SIZE?? "1" 
            ,gptUrl : import.meta.env.VITE_GPT_URL?? ""
            ,theme : import.meta.env.VITE_SYS_THEME?? "dark"
            ,isCloseMdPreview : import.meta.env.VITE_CLOSE_MD_PREVIEW?true:false
            ,menuDisable: import.meta.env.VITE_MENU_DISABLE??""
            ,visionModel: import.meta.env.VITE_VISION_MODEL??""
            ,systemMessage: import.meta.env.VITE_SYSTEM_MESSAGE??""
            ,customVisionModel: import.meta.env.VITE_CUSTOM_VISION_MODELS??""

        }
    }
    res.writeHead(200).end(
        JSON.stringify( obj )
    );
  } catch (e) {
    console.error('session.js', e, req.body);
  }
}