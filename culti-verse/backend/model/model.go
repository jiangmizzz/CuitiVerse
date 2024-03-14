package model

type DetailedPainting struct {
	PID          string             `json:"pid"`
	Name         [2]string          `json:"name"`
	Src          string             `json:"src"`
	Noumenons    []DetailedNoumenon `json:"noumenons"`
	Combinations []Combination      `json:"combinations"`
}

type DetailedNoumenon struct {
	Noumenon  Noumenon    `json:"noumenon"`
	Metaphors []Metaphors `json:"metaphors"`
	Position  []float32   `json:"position"` // x, y, w, h
}

type Combination struct {
	Noumenon Noumenon `json:"noumenon"`
	Type     string   `json:"type"`
	Count    int      `json:"count"`
	Elements []string `json:"elements"` // 组合中包含的物像nid列表
}

type Metaphors struct {
	Type  string `json:"type"`
	Count int    `json:"count"`
}

type ObjsetGet struct {
	Nodes []Node `json:"nodes"`
	Edges []Edge `json:"edges"`
}

type Node struct {
	ID    string `json:"id"`
	Value int    `json:"value"`
	Label string `json:"label"`
}

type Edge struct {
	ID    string `json:"id"`
	Title string `json:"title"`
	From  string `json:"from"`
	To    string `json:"to"`
	Value int    `json:"value"`
}

type OnePicNoumenon struct {
	NID       string `json:"nid"`
	Name      string `json:"name"`
	Metaphors []struct {
		Type  string `json:"type"`
		Count int    `json:"count"`
	} `json:"metaphors"`
}

type Combinations struct {
	Noumenon OnePicNoumenon `json:"noumenon"`
	Elements []string       `json:"elements"` // 组合中包含的物像nid列表
}

type PicAdd struct {
	NewNoumenon OnePicNoumenon `json:"newNoumenon"`
	Combination []Combinations `json:"combination"`
}
