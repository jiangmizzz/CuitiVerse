package controller

import (
	"CVB/api/dto"
	"CVB/dao"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func GetObjsetCloudHandler(c *gin.Context) {
	// 假设有一个函数GetNoumenonCloud在dao包中实现
	cloudModel, err := dao.GetNoumenonCloud()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data":    nil, // 修改为nil，因为这里应当返回空的数据结构
			"errCode": http.StatusInternalServerError,
			"errMsg":  err.Error(),
		})
		return
	}

	// 使用map根据类型分类物象数据
	categorizedCloud := make(map[string][]dto.Data)
	for _, n := range cloudModel {
		// 如果名称中包含'&'，则跳过
		if strings.Contains(n.Name, "&") || n.TIMES == 0 {
			continue
		}
		// 初始化特定类型的数据切片
		categorizedCloud[n.Category] = append(categorizedCloud[n.Category], dto.Data{
			Value: n.TIMES,
			Name:  n.Name_e,
			NID:   n.NID,
		})
	}

	// 直接使用dto.ObjsetCloudResp作为返回的切片类型
	var cloudResp dto.ObjsetCloudResp
	for category, data := range categorizedCloud {
		// 定义一个变量来保存处理后的字符串
		var capitalizedType string

		// 检查category是否非空
		if len(category) > 0 {
			capitalizedType = strings.ToUpper(category[:1]) + category[1:]
		} else {
			capitalizedType = ""
		}
		cloudResp = append(cloudResp, struct {
			// type要首字母大写

			Type string     `json:"type"`
			Data []dto.Data `json:"data"`
		}{
			Type: capitalizedType,
			Data: data,
		})
	}

	// 发送响应
	c.JSON(http.StatusOK, dto.ResponseType[dto.ObjsetCloudResp]{
		Success: true,
		Data:    cloudResp,
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

		// 定义一个变量来保存处理后的字符串
		var Type_e string

		// 检查category是否非空
		if len(modelNode.Type) > 0 {
			Type_e = strings.ToUpper(modelNode.Type[:1]) + modelNode.Type[1:]
		} else {
			Type_e = ""
		}
		dtoResp.Nodes[i] = dto.Node{
			ID:    modelNode.ID,
			Value: modelNode.Value,
			Label: modelNode.Label,
			Type:  Type_e,
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
