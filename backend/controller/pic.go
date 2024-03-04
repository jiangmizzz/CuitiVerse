package controller

import (
	"CVB/api/dto"
	"CVB/dao"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetPaintingListHandler 处理获取画作列表的请求
func GetPicListHandler(c *gin.Context) {

	nidReq := dto.PicListReq{
		NID: c.Param("nid"), // 从URL路径中获取nid
	}

	paintingsModel, err := dao.GetPicList(nidReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ResponseType[dto.PicListResp]{
			Success: false,
			Data:    dto.PicListResp{},
			ErrCode: http.StatusInternalServerError,
			ErrMsg:  err.Error(),
		})
		return
	}

	var paintings []struct { // 直接使用结构体切片，不需要预先定义的类型
		PID  string    `json:"pid"`
		Name [2]string `json:"name"`
		Src  string    `json:"src"`
	}
	// 转换模型数组到DTO数组
	for _, p := range paintingsModel {
		painting := struct {
			PID  string    `json:"pid"`
			Name [2]string `json:"name"`
			Src  string    `json:"src"`
		}{
			PID:  p.PID,
			Name: [2]string{p.Name, p.Name_e}, // 以数组形式设置中文名和英文名
			Src:  p.Src,
		}
		paintings = append(paintings, painting) // 追加单个结构体实例到切片中
	}

	c.JSON(http.StatusOK, dto.ResponseType[dto.PicListResp]{
		Success: true,
		Data:    paintings,
		ErrCode: 0,
	})
}

// 获取一幅画作
func GetPicGetHandler(c *gin.Context) {
	pid := dto.PicGetReq{
		PID: c.Param("pid"), // 从URL路径中获取pid
	}
	paintingDetail, err := dao.GetPaintingByID(pid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ResponseType[dto.PicGetResp]{
			Success: false,
			Data:    dto.PicGetResp{},
			ErrCode: http.StatusInternalServerError,
			ErrMsg:  err.Error(),
		})
		return
	}

	// 转化为dto的格式
	var noumenons []dto.Noumenons
	for _, n := range paintingDetail.Noumenons {
		var metaphors []dto.MetaphorCount
		for _, m := range n.Metaphors {
			metaphors = append(metaphors, dto.MetaphorCount{
				Type:  m.Type,
				Count: m.Count,
			})
		}
		noumenons = append(noumenons, dto.Noumenons{
			Noumenon: dto.Noumenon{
				NID:       n.Noumenon.NID,
				Name:      n.Noumenon.Name,
				Metaphors: metaphors,
			},
			Position: n.Position,
		})
	}

	var combinations []dto.Combinations
	for _, comb := range paintingDetail.Combinations {
		combinations = append(combinations, dto.Combinations{
			Noumenon: dto.Noumenon{
				NID:  comb.Noumenon.NID,
				Name: comb.Noumenon.Name,
				// Assuming Metaphors conversion if needed
			},
			Elements: comb.Elements,
		})
	}

	// Prepare the final DTO response
	painting := dto.Painting{
		PID:          paintingDetail.PID,
		Name:         paintingDetail.Name,
		Src:          paintingDetail.Src,
		Noumenons:    noumenons,
		Combinations: combinations,
	}

	paintingResp := dto.PicGetResp{
		Painting: painting,
	}
	c.JSON(http.StatusOK, dto.ResponseType[dto.PicGetResp]{
		Success: true,
		Data:    paintingResp,
		ErrCode: 0,
	})
}

func GetPicInfoHandler(c *gin.Context) {
	pid := dto.PicInfoReq{
		PID: c.Param("pid"), // 从URL路径中获取pid
	}
	paintingDetail, err := dao.GetPicInfoByID(pid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ResponseType[dto.PicInfoResp]{
			Success: false,
			Data:    dto.PicInfoResp{},
			ErrCode: http.StatusInternalServerError,
			ErrMsg:  err.Error(),
		})
		return
	}

	// 转化为dto的格式
	paintingResp := dto.PicInfoResp{
		Name:       [2]string{paintingDetail.Name, paintingDetail.Name_e},
		Material:   [2]string{paintingDetail.Material, paintingDetail.Material_e},
		Color:      [2]string{paintingDetail.Color, paintingDetail.Color_e},
		Size:       [2]string{paintingDetail.Size, paintingDetail.Size_e},
		Dynasty:    [2]string{paintingDetail.Dynasty, paintingDetail.Dynasty_e},
		Author:     [2]string{paintingDetail.Author, paintingDetail.Author_e},
		Collection: [2]string{paintingDetail.Collection, paintingDetail.Collection_e},
	}
	c.JSON(http.StatusOK, dto.ResponseType[dto.PicInfoResp]{
		Success: true,
		Data:    paintingResp,
		ErrCode: 0,
	})
}

// 获取喻体
func GetPicMetaphorsHandler(c *gin.Context) {
	req := dto.PicMetaphorsReq{
		NID:  c.Query("nid"),
		Name: c.Query("name"),
	}
	// Set default values if parameters are not provided
	if req.NID == "" {
		req.NID = "defaultNid"
	}
	if req.Name == "" {
		req.Name = "defaultName"
	}
	metaphors, err := dao.GetPicMetaphors(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ResponseType[dto.PicMetaphorsResp]{
			Success: false,
			Data:    dto.PicMetaphorsResp{},
			ErrCode: http.StatusInternalServerError,
			ErrMsg:  err.Error(),
		})
		return
	}

	// 创建 DTO 的 Metaphors 数组
	var metaphorsDTO []dto.Metaphor
	for _, m := range metaphors {
		metaphorDTO := dto.Metaphor{
			MID:      m.MID,
			Text:     m.Custom,     // 假设您想将 Symbol 和 SymbolE 合并
			NormType: m.NormType_e, // 直接使用 NormType，假设它已经是您想要的格式
		}
		metaphorsDTO = append(metaphorsDTO, metaphorDTO)
	}

	// 将 DTO 数组包装到响应结构体中
	resp := dto.PicMetaphorsResp{
		Metaphor: metaphorsDTO,
	}

	c.JSON(http.StatusOK, dto.ResponseType[dto.PicMetaphorsResp]{
		Success: true,
		Data:    resp,
		ErrCode: 0,
	})
}

// 获取喻体定义
func GetPicMeaningHandler(c *gin.Context) {
	req := dto.PicMeaningReq{
		NID: c.Query("nid"),
		MID: c.Query("mid"),
	}
	definition, err := dao.GetPicMeaning(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ResponseType[string]{
			Success: false,
			Data:    "",
			ErrCode: http.StatusInternalServerError,
			ErrMsg:  err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.ResponseType[string]{
		Success: true,
		Data:    definition,
		ErrCode: 0,
	})
}

// 手动添加物象
func PicAddHandler(c *gin.Context) {
	// 从请求中获取参数
	nList := c.Param("nList") // 注意这里的参数应保持大小写一致
	if nList == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "nList is required"})
		return
	}

	// 创建请求对象
	req := dto.PicAddReq{
		NList: nList,
	}

	// 调用dao层的方法 newGroupNoumenon
	PicAddDB, err := dao.PicAdd(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 转换NewNoumenon
	newNoumenon := dto.Noumenon{
		NID:       PicAddDB.NewNoumenon.NID,
		Name:      PicAddDB.NewNoumenon.Name,
		Metaphors: []dto.MetaphorCount{},
	}
	for _, metaphor := range PicAddDB.NewNoumenon.Metaphors {
		newNoumenon.Metaphors = append(newNoumenon.Metaphors, dto.MetaphorCount{
			Type:  metaphor.Type,
			Count: metaphor.Count,
		})
	}

	// 转换Combinations
	var combinations []dto.Combinations
	for _, combo := range PicAddDB.Combination {
		convertedNoumenon := dto.Noumenon{
			NID:       combo.Noumenon.NID,
			Name:      combo.Noumenon.Name,
			Metaphors: []dto.MetaphorCount{},
		}
		for _, metaphor := range combo.Noumenon.Metaphors {
			convertedNoumenon.Metaphors = append(convertedNoumenon.Metaphors, dto.MetaphorCount{
				Type:  metaphor.Type,
				Count: metaphor.Count,
			})
		}
		combinations = append(combinations, dto.Combinations{
			Noumenon: convertedNoumenon,
			Elements: combo.Elements,
		})
	}

	// 返回处理过后的响应
	c.JSON(http.StatusOK, dto.ResponseType[dto.PicAddResp]{
		Success: true,
		Data: dto.PicAddResp{
			NewNoumenon:  newNoumenon,
			Combinations: combinations,
		},
		ErrCode: 0,
	})
}
