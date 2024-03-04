package dao

import (
	"CVB/api/dto"
	"CVB/model"
	"fmt"
	"strings"
)

// GetNoumenonCloud 从数据库获取所有物象的信息
func GetNoumenonCloud() ([]model.Noumenon, error) {
	var noumenons []model.Noumenon
	err := db.Find(&noumenons).Error // 确保已经初始化gorm.DB这个全局变量
	if err != nil {
		return nil, err
	}
	return noumenons, nil
}

func GetPicList(nidReq dto.PicListReq) ([]model.Painting, error) {
	var paintingIDs []string
	var paintings []model.Painting

	// 首先，根据NID找到所有相关的PID
	rows, err := db.Table("painting_noumenon_boxes").Select("PID").Where("NID = ?", nidReq.NID).Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var pid string
		if err := rows.Scan(&pid); err != nil {
			return nil, err
		}
		paintingIDs = append(paintingIDs, pid)
	}

	// 检查是否有找到相关的PID
	if len(paintingIDs) == 0 {
		return []model.Painting{}, nil // 没有找到相关画作
	}

	// 然后，根据PID列表找到所有相关的画作信息
	err = db.Where("PID IN ?", paintingIDs).Find(&paintings).Error
	if err != nil {
		return nil, err
	}
	return paintings, nil
}

func GetPaintingByID(pid dto.PicGetReq) (*model.DetailedPainting, error) {
	// Step 1: 获取基本的画作信息
	var painting model.Painting
	PID := pid.PID
	sql1 := "SELECT * FROM paintings WHERE PID = ?"
	if err := db.Raw(sql1, PID).Scan(&painting).Error; err != nil {
		fmt.Println("err1")
		return nil, err
	}

	// Step 2: 获取画作中所有的物象信息
	var boxes []model.PaintingNoumenonBox
	if err := db.Table("painting_noumenon_boxes").Where("PID = ?", PID).Find(&boxes).Error; err != nil {
		print("err2")
		return nil, err
	}

	// 创建DetailedPainting实例
	detailedPainting := model.DetailedPainting{
		PID:  painting.PID,
		Name: painting.Name,
		Src:  painting.Src,
	}

	// Step 3: 遍历每个物象，获取详细信息
	for _, box := range boxes {
		var noumenon model.Noumenon
		sql3 := "SELECT * FROM noumenons WHERE NID = ?"
		if err := db.Raw(sql3, box.NID).Scan(&noumenon).Error; err != nil {
			fmt.Println("err3")
			return nil, err
		}

		// 获取这个物象相关的所有喻体信息
		var metaphors []model.NoumenonMetaphor
		if err := db.Table("noumenon_metaphors").Where("NID = ?", noumenon.NID).Find(&metaphors).Error; err != nil {
			print("err4")
			return nil, err
		}

		// 构造DetailedNoumenon
		detailedNoumenon := model.DetailedNoumenon{
			Noumenon: noumenon,
			Position: [4][]float32{{float32(box.PositionX), float32(box.PositionY), float32(box.Width), float32(box.Height)}}, // 根据实际情况可能需要调整
		}

		// 转换Metaphors
		for _, metaphor := range metaphors {
			detailedNoumenon.Metaphors = append(detailedNoumenon.Metaphors, model.Metaphors{
				Type:  metaphor.NormType,
				Count: metaphor.COUNT,
			})
		}

		// 添加到详细画作信息
		detailedPainting.Noumenons = append(detailedPainting.Noumenons, detailedNoumenon)
	}

	// TODO: Step 4: 处理Combinations，根据你的业务逻辑来填充
	var combinations []model.Combination
	detailedPainting.Combinations = combinations

	return &detailedPainting, nil
}

// 获取画作信息
func GetPicInfoByID(pid dto.PicInfoReq) (*model.Painting, error) {
	// Step 1: 获取基本的画作信息
	var painting model.Painting
	PID := pid.PID
	print(PID)
	if err := db.Raw("SELECT * FROM paintings WHERE PID = ?", PID).Scan(&painting).Error; err != nil {
		return nil, err
	}
	return &painting, nil
}

// 获取喻体
func GetPicMetaphors(nid dto.PicMetaphorsReq) ([]model.Metaphor, error) {
	var metaphors []model.Metaphor
	NID := nid.NID // 从请求中获取 NID
	Name := nid.Name
	if NID != "defaultNid" {
		// 构造一个正则表达式模式，以匹配确切的 NID 后跟一个点或加号
		// 这将确保 '11.' 不会与 '111.' 匹配
		regexpPattern := fmt.Sprintf("^%s(\\.|\\+).*", NID)

		// 在 metaphors 表中查找匹配的喻体
		if err := db.Table("metaphors").Where("MID REGEXP ?", regexpPattern).Find(&metaphors).Error; err != nil {
			return nil, err
		}
		return metaphors, nil
	} else {
		// 如果 NID 是 "defaultNid"，则根据 Name 查找喻体 默认为英文名
		// 先根据Name 到表NOUMENONS中查找NID
		var noumenon model.Noumenon
		if err := db.Table("noumenons").Where("Name_e = ?", Name).Find(&noumenon).Error; err != nil {
			return nil, err
		}
		regexpPattern := fmt.Sprintf("^%s(\\.|\\+).*", noumenon.NID)
		if err := db.Table("metaphors").Where("MID REGEXP ?", regexpPattern).Find(&metaphors).Error; err != nil {
			return nil, err
		}
		return metaphors, nil
	}
}

// 获取喻体定义
func GetPicMeaning(nidMid dto.PicMeaningReq) (string, error) {
	var custom string
	// NID := nidMid.NID
	MID := nidMid.MID
	err := db.Raw("SELECT Custom FROM metaphors WHERE MID = ?", MID).Scan(&custom).Error
	if err != nil {
		return "", err
	}
	return custom, nil
}

// GetObjsetGet 根据nid获取物象的关系结构
func GetObjsetGet(req dto.ObjsetGetReq) (model.ObjsetGet, error) {
	var objSet model.ObjsetGet
	nid := req.NID

	// 构造一个正则表达式模式，以匹配确切的 NID 开头或结尾，或者后跟一个加号或前面有一个加号
	regexpPattern := fmt.Sprintf("(^%[1]s$)|(^%[1]s\\+)|(\\+%[1]s$)|(\\+%[1]s\\+)", nid)

	// 查找与nid有关的所有物象组合
	var combinations []model.Noumenon
	// sql := fmt.Sprintf("SELECT * FROM noumenons WHERE NID REGEXP '%s'", regexpPattern)
	err := db.Raw("SELECT * FROM noumenons WHERE NID REGEXP ?", regexpPattern).Scan(&combinations).Error
	if err != nil {
		return objSet, err
	}

	nodeMap := make(map[string]model.Node)
	edgeMap := make(map[string]model.Edge)

	print("combinations:", combinations, "nodemap:", nodeMap, "edagmap:", edgeMap)
	// 处理nodes和edges
	for _, combo := range combinations {
		ids := strings.Split(combo.NID, "+")
		for _, id := range ids {
			// 避免重复添加节点
			if _, exists := nodeMap[id]; !exists {
				// 查询每个nid对应的TIMES和Name
				var noumenon model.Noumenon
				err := db.Raw("SELECT * FROM noumenons WHERE NID = ?", id).Scan(&noumenon).Error
				if err != nil {
					return objSet, err
				}
				nodeMap[id] = model.Node{ID: id, Value: noumenon.TIMES, Label: noumenon.Name}
			}
		}

		// 创建edges
		if len(ids) > 1 { // 确保是组合物象
			for i := 0; i < len(ids)-1; i++ {
				for j := i + 1; j < len(ids); j++ {
					edgeID := ids[i] + "+" + ids[j]
					edgeTitle := nodeMap[ids[i]].Label + "/" + nodeMap[ids[j]].Label
					edgeValue := combo.TIMES // 使用组合物象的TIMES
					edgeMap[edgeID] = model.Edge{ID: edgeID, Title: edgeTitle, From: ids[i], To: ids[j], Value: edgeValue}
				}
			}
		}
	}

	// 将map转换为切片
	for _, node := range nodeMap {
		objSet.Nodes = append(objSet.Nodes, node)
	}
	for _, edge := range edgeMap {
		objSet.Edges = append(objSet.Edges, edge)
	}

	return objSet, nil
}

// 手动添加物象
func PicAdd(PicAddNList dto.PicAddReq) (*model.PicAdd, error) {
	// 将NList字符串分割成单个物象的数组
	nList := strings.Split(PicAddNList.NList, ",")
	// 把nList中的物象名统一转换为小写（或大写，根据数据库实际情况决定），以便匹配
	for i, n := range nList {
		nList[i] = strings.ToLower(n) // 或使用 strings.ToUpper(n) 根据需要
	}
	fmt.Println(nList)
	// 从数据库中获取字符串最后一个名字对应的NID
	var lastNoumenon model.Noumenon
	err := db.Raw("select * from noumenons where Name_e = ?", nList[len(nList)-1]).Scan(&lastNoumenon).Error
	if err != nil {
		return nil, err
	}
	// 将新的NID添加到列表中
	nList = append(nList[:len(nList)-1], lastNoumenon.NID)
	fmt.Println("newnList:", nList)

	// 构建大集合，用于后续比较
	bigSet := make(map[string]bool)
	for _, nid := range nList {
		bigSet[nid] = true
	}

	fmt.Println("bigSet:", bigSet)
	// 获取所有包含新NID的组合
	var newGroupNoumenon []model.Noumenon
	regexpPattern := fmt.Sprintf("(^%[1]s\\+)|(\\+%[1]s$)|(\\+%[1]s\\+)", lastNoumenon.NID)
	err = db.Raw("SELECT * FROM noumenons WHERE NID REGEXP ?", regexpPattern).Scan(&newGroupNoumenon).Error
	if err != nil {
		return nil, err
	}

	// 过滤出所有有效的组合
	validGroupNoumenon := make([]string, 0)
	for _, comb := range newGroupNoumenon {
		parts := strings.Split(comb.NID, "+")
		allFound := true
		for _, part := range parts {
			if _, found := bigSet[part]; !found {
				allFound = false
				break
			}
		}
		if allFound {
			validGroupNoumenon = append(validGroupNoumenon, comb.NID)
		}
	}
	fmt.Println("validGroupNoumenon:", validGroupNoumenon)

	// 获取这个物象相关的所有喻体信息
	var metaphors []model.NoumenonMetaphor
	if err := db.Table("noumenon_metaphors").Where("NID = ?", lastNoumenon.NID).Find(&metaphors).Error; err != nil {
		return nil, err
	}
	// 创建一个Metaphor的切片来存储转换后的元素
	var transformedMetaphors []struct {
		Type  string `json:"type"`
		Count int    `json:"count"`
	}

	// 遍历原始的metaphors切片
	for _, metaphor := range metaphors {
		// 对每个元素，将其转换为新的结构，并添加到新的切片中
		transformed := struct {
			Type  string `json:"type"`
			Count int    `json:"count"`
		}{
			Type:  metaphor.NormType, // 将NormType映射到Type
			Count: metaphor.COUNT,    // 将COUNT映射到Count
		}
		// 将转换后的元素添加到切片中
		transformedMetaphors = append(transformedMetaphors, transformed)
	}

	var combinations []model.Combinations

	// 遍历validGroupNoumenon数组
	for _, nid := range validGroupNoumenon {
		var noumenonName string
		var metaphors []model.NoumenonMetaphor

		// 从noumenons表中根据NID获取Name
		err := db.Table("noumenons").Where("NID = ?", nid).Select("Name").Row().Scan(&noumenonName)
		if err != nil {
			return nil, err
		}

		// 从noumenon_metaphors表中根据NID获取Metaphors
		err = db.Table("noumenon_metaphors").Where("NID = ?", nid).Find(&metaphors).Error
		if err != nil {
			return nil, err
		}

		// 转换metaphors为所需的格式
		var transformedMetaphors []struct {
			Type  string `json:"type"`
			Count int    `json:"count"`
		}
		for _, metaphor := range metaphors {
			transformed := struct {
				Type  string `json:"type"`
				Count int    `json:"count"`
			}{
				Type:  metaphor.NormType, // 将NormType映射到Type
				Count: metaphor.COUNT,    // 将COUNT映射到Count
			}
			transformedMetaphors = append(transformedMetaphors, transformed)
		}

		// 构造OnePicNoumenon实例
		onePicNoumenon := model.OnePicNoumenon{
			NID:       nid,
			Name:      noumenonName,
			Metaphors: transformedMetaphors,
		}

		// 添加到Combinations切片
		combination := model.Combinations{
			Noumenon: onePicNoumenon,
			Elements: []string{nid}, // 在这个场景下，Elements直接为NID
		}
		combinations = append(combinations, combination)
	}
	// 构造响应体
	response := &model.PicAdd{
		NewNoumenon: model.OnePicNoumenon{
			NID:       lastNoumenon.NID,
			Name:      lastNoumenon.Name,
			Metaphors: transformedMetaphors,
		},
		Combination: combinations,
	}

	return response, nil
}
