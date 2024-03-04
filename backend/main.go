package main

import (
	"CVB/dao"
	"CVB/route"
)

func main() {
	dao.InitDB() // 初始化数据库连接

	// 设置路由...
	r := route.SetupRouter()
	// 设置静态文件路由
	r.Static("/picture", "./pic")
	r.Run("192.168.89.1:80") // 在默认端口（:8080）上监听
}
