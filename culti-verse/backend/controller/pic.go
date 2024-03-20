package controller

import (
	"CVB/api/dto"
	"CVB/dao"
	"fmt"
	"net/http"
	"strings"

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
	var tempNoumenonsMap map[string]*dto.Noumenons = make(map[string]*dto.Noumenons)

	for _, n := range paintingDetail.Noumenons {
		var metaphors []dto.MetaphorCount
		// 假设 metaphors 是一个 dto.MetaphorCount 类型的切片
		// 创建一个映射来跟踪不同类型的隐喻和它们的数量
		metaphorMap := make(map[string]*dto.MetaphorCount)

		for _, m := range n.Metaphors {
			// 检查这个类型的隐喻是否已经在我们的映射中
			if _, exists := metaphorMap[m.Type]; exists {
			} else {
				// 定义一个变量来保存处理后的字符串
				var capitalizedtype string

				// 检查category是否非空
				if len(m.Type) > 0 {
					capitalizedtype = strings.ToUpper(m.Type[:1]) + m.Type[1:]
				} else {
					capitalizedtype = ""
				}
				// 如果不存在，创建一个新的条目并添加到映射中
				metaphorMap[m.Type] = &dto.MetaphorCount{
					Type:  capitalizedtype,
					Count: m.Count,
				}
			}
		}

		// 现在将映射转换回切片
		metaphors = make([]dto.MetaphorCount, 0, len(metaphorMap))
		for _, mc := range metaphorMap {
			metaphors = append(metaphors, *mc)
		}

		// 检查是否已经有了相同NID的物象
		if existing, found := tempNoumenonsMap[n.Noumenon.NID]; found {
			// 已有则添加position到positions数组
			existing.Position = append(existing.Position, n.Position)
		} else {
			// 没有则创建新的Noumenons并加入到map中
			tempNoumenonsMap[n.Noumenon.NID] = &dto.Noumenons{
				NID:       n.Noumenon.NID,
				Name:      [2]string{n.Noumenon.Name, n.Noumenon.Name_e},
				Metaphors: metaphors,
				Position:  [][]float32{n.Position}, // 新创建时直接使用一个包含当前position的二维数组
			}
		}
	}

	// 从map中提取所有values到slice
	var noumenons []dto.Noumenons
	for _, n := range tempNoumenonsMap {
		noumenons = append(noumenons, *n)
	}

	var combinations []dto.Combinations
	for _, comb := range paintingDetail.Combinations {
		var metaphors []dto.MetaphorCount
		// 假设 metaphors 是一个 dto.MetaphorCount 类型的切片
		// 创建一个映射来跟踪不同类型的隐喻和它们的数量
		metaphorMap := make(map[string]*dto.MetaphorCount)

		for _, m := range comb.Metaphors {
			// 检查这个类型的隐喻是否已经在我们的映射中
			if _, exists := metaphorMap[m.Type]; exists {
			} else {
				// 定义一个变量来保存处理后的字符串
				var capitalizedtype string

				// 检查category是否非空
				if len(m.Type) > 0 {
					capitalizedtype = strings.ToUpper(m.Type[:1]) + m.Type[1:]
				} else {
					capitalizedtype = ""
				}
				// 如果不存在，创建一个新的条目并添加到映射中
				metaphorMap[m.Type] = &dto.MetaphorCount{
					Type:  capitalizedtype,
					Count: m.Count,
				}
			}
		}

		// 现在将映射转换回切片
		metaphors = make([]dto.MetaphorCount, 0, len(metaphorMap))
		for _, mc := range metaphorMap {
			metaphors = append(metaphors, *mc)
		}

		combinations = append(combinations, dto.Combinations{
			NID:       comb.Noumenon.NID,
			Name:      [2]string{comb.Noumenon.Name, comb.Noumenon.Name_e},
			Metaphors: metaphors,
			Elements:  comb.Elements,
		})
	}

	// 如果combinations为空，则初始化为空数组
	if combinations == nil {
		combinations = []dto.Combinations{} // 根据CombinationType的具体类型修改
	}
	// Prepare the final DTO response
	paintingResp := dto.PicGetResp{
		PID:          paintingDetail.PID,
		Name:         paintingDetail.Name,
		Src:          paintingDetail.Src,
		Noumenons:    noumenons,
		Combinations: combinations,
	}

	c.JSON(http.StatusOK, dto.ResponseType[dto.PicGetResp]{
		Success: true,
		Data:    paintingResp,
		ErrCode: 0,
	})
}

// 获取图像信息
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
	singleFlag := 0
	req.NID = strings.ReplaceAll(req.NID, " ", "+")
	if !strings.Contains(req.NID, "+") {
		singleFlag = 1
	}
	fmt.Println(singleFlag)
	// Set default values if parameters are not provided
	if req.NID == "" {
		req.NID = "defaultNid"
	}
	if req.Name == "" {
		req.Name = "defaultName"
	}
	metaphors, err := dao.GetPicMetaphors(req)
	fmt.Println(metaphors)
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
	var metaphorsDTO dto.PicMetaphorsResp
	for _, m := range metaphors {
		// 创建一个新的 Metaphor 结构体实例，并设置其字段
		if strings.Contains(m.MID, "+") && singleFlag == 1 {

			continue
		}
		// 定义一个变量来保存处理后的字符串
		var capitalizedEmotion string

		// 检查category是否非空
		if len(m.Emotion) > 0 {
			capitalizedEmotion = strings.ToUpper(m.Emotion[:1]) + m.Emotion[1:]
		} else {
			capitalizedEmotion = ""
		}

		// 定义一个变量来保存处理后的字符串
		var capitalizedNormtype_e string

		// 检查category是否非空
		if len(m.NormType_e) > 0 {
			capitalizedNormtype_e = strings.ToUpper(m.NormType_e[:1]) + m.NormType_e[1:]
		} else {
			capitalizedNormtype_e = ""
		}

		newMetaphor := dto.Metaphor{
			MID:  m.MID,
			Text: [2]string{m.Symbol, m.Symbol_e},
			// Text:     m.Symbol + "/" + m.Symbol_e, // 假设 m.Custom 是正确的字段
			NormType: capitalizedNormtype_e, // 假设 m.NormType_e 是正确的字段
			Emotion:  capitalizedEmotion,
			Meaning:  [2]string{m.Custom, m.Custom_e},
		}
		// 使用 append 来添加新元素到切片
		metaphorsDTO = append(metaphorsDTO, newMetaphor)
	}

	// 将 DTO 数组包装到响应结构体中
	resp := metaphorsDTO

	// 如果没有找到喻体，则返回空数组
	if len(metaphors) == 0 {
		c.JSON(http.StatusOK, dto.ResponseType[dto.PicMetaphorsResp]{
			Success: true,
			Data:    dto.PicMetaphorsResp{}, // 返回空数组
			ErrCode: 0,
		})
		return
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
	// 使用一个map来存储每种类型的喻体及其计数
	metaphorCounts := make(map[string]int)
	for _, metaphor := range PicAddDB.NewNoumenon.Metaphors {
		// 标准化类型名称
		var capitalizedType string
		if len(metaphor.Type) > 0 {
			capitalizedType = strings.ToUpper(metaphor.Type[:1]) + metaphor.Type[1:]
		} else {
			continue // 如果类型为空，则跳过这个喻体
		}

		// 累加喻体的计数
		metaphorCounts[capitalizedType] = metaphor.Count
	}

	// 将累计的结果转换为MetaphorCount数组
	for typ, count := range metaphorCounts {
		newNoumenon.Metaphors = append(newNoumenon.Metaphors, dto.MetaphorCount{
			Type:  typ,
			Count: count,
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
		// 为当前Noumenon清空并重新计算MetaphorCounts
		metaphorCounts = make(map[string]int)
		for _, metaphor := range combo.Noumenon.Metaphors {
			// 标准化类型名称
			var capitalizedType string
			if len(metaphor.Type) > 0 {
				capitalizedType = strings.ToUpper(metaphor.Type[:1]) + metaphor.Type[1:]
			} else {
				continue // 如果类型为空，则跳过这个喻体
			}

			// 累加喻体的计数
			metaphorCounts[capitalizedType] = metaphor.Count
		}

		// 将累计的结果转换为MetaphorCount数组
		for typ, count := range metaphorCounts {
			convertedNoumenon.Metaphors = append(convertedNoumenon.Metaphors, dto.MetaphorCount{
				Type:  typ,
				Count: count,
			})
		}
		combinations = append(combinations, dto.Combinations{
			NID:       convertedNoumenon.NID,
			Name:      convertedNoumenon.Name,
			Metaphors: convertedNoumenon.Metaphors,
			Elements:  strings.Split(convertedNoumenon.NID, "+"),
		})
	}

	// 如果combinations为空，则初始化为空数组
	if combinations == nil {
		combinations = []dto.Combinations{} // 根据CombinationType的具体类型修改
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
