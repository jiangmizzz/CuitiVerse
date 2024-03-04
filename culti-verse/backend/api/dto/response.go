package dto

// ResponseType 定义了API的统一响应格式。
type ResponseType[T any] struct {
    Success bool   `json:"success"`
    Data    T      `json:"data"`
    ErrCode int    `json:"errcode"`
    ErrMsg  string `json:"errmsg"`
}
