package route

import (
	"CVB/controller"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.GET("/objset/cloud", controller.GetObjsetCloudHandler)
	r.GET("/objset/get/:nid", controller.GetObjsetGetHandler)
	r.GET("/pic/list/:nid", controller.GetPicListHandler)
	r.GET("/pic/get/:pid", controller.GetPicGetHandler)
	r.GET("/pic/info/:pid", controller.GetPicInfoHandler)
	r.GET("/pic/metaphors", controller.GetPicMetaphorsHandler)
	r.GET("/pic/meaning", controller.GetPicMeaningHandler)
	r.GET("/pic/add/:nList", controller.PicAddHandler)

	return r
}
