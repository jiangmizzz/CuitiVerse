package route

import (
	"CVB/controller"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 仅允许来自特定IP的请求
		if c.ClientIP() == "10.162.214.169" || c.ClientIP() == "10.194.85.133" || c.ClientIP() == "127.0.0.1" || c.ClientIP() == "10.195.92.221" || c.ClientIP() == "10.196.85.224" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", c.Request.Header.Get("Origin"))
		} else {
			c.Writer.Header().Set("Access-Control-Allow-Origin", "your_not_allowed_origin") // 或设置为不允许的源
		}
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		// 检查是否为预检请求
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// 应用CORS中间件
	r.Use(CORSMiddleware())

	apiRoutes := r.Group("/api")
	apiRoutes.GET("/objset/cloud", controller.GetObjsetCloudHandler)
	apiRoutes.GET("/objset/get/:nid", controller.GetObjsetGetHandler)
	apiRoutes.GET("/pic/list/:nid", controller.GetPicListHandler)
	apiRoutes.GET("/pic/get/:pid", controller.GetPicGetHandler)
	apiRoutes.GET("/pic/info/:pid", controller.GetPicInfoHandler)
	apiRoutes.GET("/pic/metaphors", controller.GetPicMetaphorsHandler)
	apiRoutes.GET("/pic/meaning", controller.GetPicMeaningHandler)
	apiRoutes.GET("/pic/add/:nList", controller.PicAddHandler)

	return r
}
