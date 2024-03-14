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
	r.Run("10.194.31.175:80") // 在端口（:80）上监听
	// r.Run("10.194.85.133:80") // 在端口（:80）上监听
	// r.Run("10.195.92.221:80") // 在端口（:80）上监听
	//r.Run("10.196.83.155:80")
	// r.Run() // 在默认端口（:8080）上监听
}
