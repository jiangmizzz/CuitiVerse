package dto

type Painting struct {
	PID          string         `json:"pid"`
	Name         [2]string      `json:"name"`
	Src          string         `json:"src"`
	Noumenons    []Noumenons    `json:"noumenons"`
	Combinations []Combinations `json:"combinations"`
}

type Noumenons struct {
	NID       string          `json:"nid"`
	Name      [2]string       `json:"name"`
	Metaphors []MetaphorCount `json:"metaphors"`
	Position  [][]float32     `json:"positions"` // x, y, w, h
}

type Combinations struct {
	NID       string          `json:"nid"`
	Name      [2]string       `json:"name"`
	Metaphors []MetaphorCount `json:"metaphors"`
	Elements  []string        `json:"elements"` // 组合中包含的物像nid列表
}

type Noumenon struct {
	NID       string          `json:"nid"`
	Name      [2]string       `json:"name"`
	Metaphors []MetaphorCount `json:"metaphors"`
}

type MetaphorCount struct {
	Type  string `json:"type"`
	Count int    `json:"count"`
}

type Metaphor struct {
	MID      string    `json:"mid"`
	Text     [2]string `json:"text"`
	NormType string    `json:"normType"`
	Emotion  string    `json:"emotion"`
	Meaning  [2]string `json:"meaning"`
}

type Combination struct {
	Elements []string `json:"elements"` // 组合中包含的物像nid列表
}

// 物像集词云请求和响应
type ObjsetCloudResp []struct {
	Type string `json:"type"` // 物像类型
	Data []Data `json:"data"` // 物像数据
}

type Data struct {
	Value int    `json:"value"`
	Name  string `json:"name"`
	NID   string `json:"nid"`
}

// 获取单个物像的关系结构请求和响应
type ObjsetGetReq struct {
	NID string `json:"nid"` // 从URL路径参数获取
}

type ObjsetGetResp struct {
	Nodes []Node `json:"nodes"`
	Edges []Edge `json:"edges"`
}

type Node struct {
	ID    string `json:"id"`
	Value int    `json:"value"`
	Label string `json:"label"`
	Type  string `json:"type"`
}

type Edge struct {
	ID    string `json:"id"`
	Title string `json:"title"`
	From  string `json:"from"`
	To    string `json:"to"`
	Value int    `json:"value"`
}

// 画作列表请求和响应
type PicListReq struct {
	NID string `json:"nid"` // 从URL路径参数获取
}

type PicListResp []struct {
	PID  string    `json:"pid"`
	Name [2]string `json:"name"`
	Src  string    `json:"src"`
}

// 获取单个画作的请求和响应
type PicGetReq struct {
	PID string `json:"pid"` // 从URL路径参数获取
}

type PicGetResp struct {
	PID          string         `json:"pid"`
	Name         [2]string      `json:"name"`
	Src          string         `json:"src"`
	Noumenons    []Noumenons    `json:"noumenons"`
	Combinations []Combinations `json:"combinations"`
}

// 获取喻体
// - URL：/pic/metaphors？nid=xxx&name=xxx
// - 描述 ：获取一个物像或组合对应的若干个喻体
// - Method：GET
// - Request：nid为物像 id，如果是组合物像，则以+间隔nid
// - Response: Metaphor[]//没查询到就返回空数组

// 获取喻体的请求和响应
type PicMetaphorsReq struct {
	NID  string `json:"nid"`
	Name string `json:"name,omitempty"`
}

type PicMetaphorsResp []struct {
	MID      string    `json:"mid"`
	Text     [2]string `json:"text"`
	NormType string    `json:"normType"`
	Emotion  string    `json:"emotion"`
	Meaning  [2]string `json:"meaning"`
}

// 获取喻体定义的请求和响应
type PicMeaningReq struct {
	NID string `json:"nid"`
	MID string `json:"mid"`
}

type PicMeaningResp struct {
	Meaning string `json:"meaning"`
}

type PicInfoReq struct {
	PID string `json:"pid"` // 从URL路径参数获取
}

// 以下均为长度为2的字符串数组，index=0为zh, index=1为en
type PicInfoResp struct { //画作描述
	Name       [2]string `json:"name"`       //画作名
	Material   [2]string `json:"material"`   //材料
	Color      [2]string `json:"color"`      //色彩
	Size       [2]string `json:"size"`       //尺寸
	Dynasty    [2]string `json:"dynasty"`    //朝代
	Author     [2]string `json:"author"`     //作者
	Collection [2]string `json:"collection"` //馆藏地
}

type PicAddReq struct {
	NList string `json:"nList"`
}

type PicAddResp struct {
	NewNoumenon  Noumenon       `json:"newNoumenon"`
	Combinations []Combinations `json:"combinations"`
}
