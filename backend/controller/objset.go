package controller

import (
	"CVB/api/dto"
	"CVB/dao"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetObjsetCloudHandler 获取物像集词云
func GetObjsetCloudHandler(c *gin.Context) {
	// 假设有一个函数GetNoumenonCloud在dao包中实现
	cloudModel, err := dao.GetNoumenonCloud()
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ResponseType[dto.ObjsetCloudResp]{
			Success: false,
			Data:    dto.ObjsetCloudResp{},
			ErrCode: http.StatusInternalServerError,
			ErrMsg:  err.Error(),
		})
		return
	}

	// 转换模型数组到DTO数组
	var cloud dto.ObjsetCloudResp // 注意这里根据你的定义，ObjsetCloudResp应该是切片类型
	for _, n := range cloudModel {
		cloud = append(cloud, struct {
			Times int    `json:"times"`
			Name  string `json:"name"`
			NID   string `json:"nid"`
		}{
			Times: n.TIMES,
			Name:  n.Name,
			NID:   n.NID,
		})
	}
	c.JSON(http.StatusOK, dto.ResponseType[dto.ObjsetCloudResp]{
		Success: true,
		Data:    cloud,
		ErrCode: 0,
	})
}

// 获取单个物像的关系
func GetObjsetGetHandler(c *gin.Context) {
	nidReq := dto.ObjsetGetReq{
		NID: c.Param("nid"), // 从URL路径中获取nid
	}

	objset, err := dao.GetObjsetGet(nidReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ResponseType[dto.ObjsetGetResp]{
			Success: false,
			Data:    dto.ObjsetGetResp{},
			ErrCode: http.StatusInternalServerError,
			ErrMsg:  err.Error(),
		})
		return
	}

	// 转换 model.ObjsetGet 为 dto.ObjsetGetResp
	dtoResp := dto.ObjsetGetResp{
		Nodes: make([]dto.Node, len(objset.Nodes)),
		Edges: make([]dto.Edge, len(objset.Edges)),
	}

	// 填充 Nodes
	for i, modelNode := range objset.Nodes {
		dtoResp.Nodes[i] = dto.Node{
			ID:    modelNode.ID,
			Value: modelNode.Value,
			Label: modelNode.Label,
		}
	}

	// 填充 Edges
	for i, modelEdge := range objset.Edges {
		dtoResp.Edges[i] = dto.Edge{
			ID:    modelEdge.ID,
			Title: modelEdge.Title,
			From:  modelEdge.From,
			To:    modelEdge.To,
			Value: modelEdge.Value,
		}
	}

	c.JSON(http.StatusOK, dto.ResponseType[dto.ObjsetGetResp]{
		Success: true,
		Data:    dtoResp,
		ErrCode: 0,
	})
}
