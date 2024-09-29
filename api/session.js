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
            "auth":   process.env.VITE_AUTH_SECRET_KEY?true:false ,
            "model": "ChatGPTAPI",
            "amodel": process.env.VITE_OPENAI_API_MODEL?? "gpt-3.5-turbo"
            ,isApiGallery:    process.env.VITE_MJ_API_GALLERY ? true : false 
            ,cmodels : process.env.VITE_CUSTOM_MODELS??'' 
            ,baiduId : process.env.VITE_TJ_BAIDU_ID?? "" 
            ,googleId: process.env.VITE_TJ_GOOGLE_ID?? ""
            , notify : process.env.VITE_SYS_NOTIFY?? "" 
            ,disableGpt4 : process.env.VITE_DISABLE_GPT4?? "" 
            ,isWsrv:  process.env.VITE_MJ_IMG_WSRV?? "" 
            ,uploadImgSize: process.env.VITE_UPLOAD_IMG_SIZE?? "1" 
            ,gptUrl : process.env.VITE_GPT_URL?? ""
            ,theme : process.env.VITE_SYS_THEME?? "dark"
            ,isCloseMdPreview : process.env.VITE_CLOSE_MD_PREVIEW?true:false
            ,menuDisable: process.env.VITE_MENU_DISABLE??""
            ,visionModel: process.env.VITE_VISION_MODEL??""
            ,systemMessage: process.env.VITE_SYSTEM_MESSAGE??""
            ,customVisionModel: process.env.VITE_CUSTOM_VISION_MODELS??""

        }
    }
    res.writeHead(200).end(
        JSON.stringify( obj )
    );
  } catch (e) {
    console.error('session.js', e, req.body);
  }
}