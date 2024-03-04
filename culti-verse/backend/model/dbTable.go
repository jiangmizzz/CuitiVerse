package model

type Painting struct {
	PID          string `gorm:"primaryKey;size:255" json:"pid"`
	Name         string `gorm:"size:255" json:"name"`
	Name_e       string `gorm:"size:255" json:"name_e"`
	Src          string `gorm:"size:255;not null" json:"src"`
	Material     string `gorm:"size:255" json:"material"`
	Material_e   string `gorm:"size:255" json:"material_e"`
	Color        string `gorm:"size:255" json:"color"`
	Color_e      string `gorm:"size:255" json:"color_e"`
	Size         string `gorm:"size:255" json:"size"`
	Size_e       string `gorm:"size:255" json:"size_e"`
	Dynasty      string `gorm:"size:255" json:"dynasty"`
	Dynasty_e    string `gorm:"size:255" json:"dynasty_e"`
	Author       string `gorm:"size:255" json:"author"`
	Author_e     string `gorm:"size:255" json:"author_e"`
	Collection   string `gorm:"size:255" json:"collection"`
	Collection_e string `gorm:"size:255" json:"collection_e"`
}

type Noumenon struct {
	NID    string `gorm:"primaryKey;size:255" json:"nid"`
	Name   string `gorm:"size:255" json:"name"`
	Name_e string `gorm:"size:255" json:"name_e"`
	TIMES  int    `gorm:"not null" json:"times"`
}

type Metaphor struct {
	MID        string `gorm:"primaryKey;size:255" json:"mid"`
	Symbol     string `gorm:"size:255;not null" json:"symbol"`
	Symbol_e   string `gorm:"size:255" json:"symbol_e"`
	NormType   string `gorm:"size:255;not null" json:"NormType"`
	NormType_e string `gorm:"size:255" json:"NormType_e"`
	Custom     string `gorm:"size:1024;not null" json:"custom"`
	Custom_e   string `gorm:"size:1024" json:"custom_e"`
	Emotion    string `gorm:"size:255;not null" json:"emotion"`
}

type NoumenonMetaphor struct {
	NID        string `gorm:"primaryKey;size:255" json:"nid"`
	MID        string `gorm:"primaryKey;size:255" json:"mid"`
	COUNT      int    `json:"count"`
	NormType   string `gorm:"size:255;not null" json:"normType"`
	NormType_e string `gorm:"size:255" json:"normType_e"`
}

type PaintingNoumenonBox struct {
	PNBID     int     `gorm:"primaryKey;autoIncrement" json:"pnbid"`
	PID       string  `gorm:"size:255" json:"pid"`
	NID       string  `gorm:"size:255" json:"nid"`
	PositionX float64 `json:"positionX"`
	PositionY float64 `json:"positionY"`
	Width     float64 `json:"width"`
	Height    float64 `json:"height"`
}

type Group_noumenons struct {
	NID    string `gorm:"size:255" json:"nid"`
	PID    string `gorm:"size:255" json:"pid"`
	Name   string `gorm:"size:255" json:"name"`
	Name_e string `gorm:"size:255" json:"name_e"`
}
