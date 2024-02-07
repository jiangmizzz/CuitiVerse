import { useEffect, useRef, useState } from "react";
import "./App.css";
import "./assets/reset.css";
import logo from "./assets/logo.png";
import mainPic1 from "./assets/main-pic1.png";
import gptLogo from "./assets/chat-gpt.svg";
import TransferEntry from "./components/TransferEntry/TransferEntry";
import { singleTrans, transferItem } from "./stores/static-data";
import ChatBox from "./components/ChatBox/ChatBox";

//静态选框数据
const rects = [
  {
    x: 70,
    y: 140,
    w: 140,
    h: 275,
  },
  {
    x: 210,
    y: 500,
    w: 80,
    h: 70,
  },
];

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [totalTrans, setTotalTrans] = useState<transferItem[]>(singleTrans);
  const [culture, setCulture] = useState<string>("English");
  const [isDraw, setDraw] = useState<boolean>(false);
  const [isEditing, setEdit] = useState<boolean>(false); //编辑文化背景
  const [inputCulture, setInput] = useState<string>(culture);
  const [isCombine, setCombine] = useState<boolean>(false); //组合转译
  const [combineArray, setArray] = useState<string[]>([]); //组合转译的本体数组
  const [isChat, setChat] = useState<boolean>(false); //是否打开聊天窗口
  //渲染canvas
  useEffect(() => {
    const canvas = canvasRef.current!;
    const context: CanvasRenderingContext2D = canvas.getContext("2d")!;
    const img = new Image();
    img.src = mainPic1;
    //设置 Canvas 的显示大小与实际大小一致

    img.onload = function () {
      // 清空画布
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      const imageWidth = img.width; //图像大小
      const imageHeight = img.height;

      canvas.width = imageWidth; //实际尺寸
      canvas.height = imageHeight;
      canvas.style.width = "100%"; //显示尺寸
      canvas.style.height = `${(canvas.height / canvas.width) * 100}%`;

      const scaleX = canvas.width / canvas.clientWidth;
      const scaleY = canvas.height / canvas.clientHeight;
      // console.log(scaleX, scaleY);

      // 绘制图片到画布
      context.drawImage(img, 0, 0, context.canvas.width, context.canvas.height);

      //绘制矩形选框
      context.lineWidth = 2 * scaleX;
      context.strokeStyle = "red";
      for (const rect of rects) {
        context.strokeRect(
          rect.x * scaleX,
          rect.y * scaleY,
          rect.w * scaleX,
          rect.h * scaleY
        );
      }
    };
  }, []);

  //编辑文化背景
  function handleEdit() {
    if (!isEditing) {
      setEdit(true);
    } else {
      if (inputCulture != "") {
        setCulture(inputCulture);
        setEdit(false);
      } else {
        alert("Your cultural background can not be empty!");
      }
    }
  }
  //组合转译
  function handleCombine() {
    if (combineArray.length == 0) {
      //empty
      alert("The selected array is empty!");
    } //TODO:这里之后还要添加重复判定
    else {
      /**给后端发请求, 现在是mock*/
      if (combineArray.includes("Monkey") && combineArray.includes("Bee")) {
        setTotalTrans([
          ...totalTrans,
          {
            picPieces: mainPic1,
            source: "Monkey&Bee",
            targets: [
              {
                type: "Homophony",
                text: "Enfeoffment",
              },
            ],
          },
        ]);
      } else {
        alert("Can not find the combination!");
      }
      setArray([]); //清空
      setCombine(false);
    }
  }

  //选中/取消选中
  function handleSelect(source: string) {
    if (isCombine) {
      if (source.indexOf("&") < 0) {
        if (!combineArray.includes(source)) {
          setArray([...combineArray, source]);
        } else {
          setArray(combineArray.filter((item) => item != source));
        }
      } else {
        //已经是组合转译，不能再组合
        alert("Can not select combined item!");
      }
    }
  }

  return (
    <>
      <ChatBox ifShow={isChat} closePop={() => setChat(false)} />
      <div className="main">
        <div className="app-header">
          <div className="app-logo">
            <img
              src={logo}
              style={{
                width: "2em",
                objectFit: "cover",
              }}
            />
            <span>{"Cultural Transfer"}</span>
          </div>
          <div
            className="app-chat"
            title="Chatbox with AI"
            onClick={() => setChat(!isChat)}
          >
            {/* <span>Chat</span> */}
            <img
              src={gptLogo}
              style={{
                width: "2em",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
        <div className="app-body">
          <div className="app-left">
            <canvas className="app-canvas" ref={canvasRef} />
            <div className="app-left-menu">
              <div className="app-left-menu-1">
                {/* <span>放大</span>
                <span>缩小</span> */}
              </div>
              <div className="app-left-menu-2">
                <div>
                  <div>框选</div>
                  <span style={{ fontSize: "13px" }}>框选图像进行选取</span>
                  <div
                    style={{ display: "flex", alignSelf: "end", gap: "0.5em" }}
                  >
                    <button onClick={() => setDraw(!isDraw)} disabled={true}>
                      {isDraw ? "添加" : "开始"}
                    </button>
                    <button
                      onClick={() => {
                        setDraw(false);
                      }}
                      disabled={true}
                    >
                      {"取消"}
                    </button>
                  </div>
                </div>
                {/* <div></div> */}
              </div>
            </div>
          </div>
          <div className="app-right">
            <div className="app-right-menu">
              <div>
                <span>{"Your cultural background: "}</span>
                <span className="app-right-edit">
                  {!isEditing && <span>{culture}</span>}
                  {isEditing && (
                    <input
                      type="text"
                      onChange={(e) => {
                        setInput(e.target.value);
                      }}
                      value={inputCulture}
                    />
                  )}
                </span>
                <button onClick={handleEdit}>
                  {isEditing ? "OK" : "edit"}
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    setCombine(!isCombine);
                    setArray([]);
                  }}
                  style={{ marginRight: "1em" }}
                >
                  {isCombine ? "退出选择" : "选择"}
                </button>
                <button
                  onClick={handleCombine}
                  disabled={!isCombine}
                  style={{ cursor: isCombine ? "pointer" : "not-allowed" }}
                >
                  组合转译
                </button>
              </div>
            </div>
            <div className="app-right-body">
              {totalTrans.map((transItem) => {
                return (
                  <div
                    key={transItem.source}
                    onClick={() => handleSelect(transItem.source)}
                    className={
                      combineArray.includes(transItem.source)
                        ? "app-right-selected-item"
                        : "app-right-default-item"
                    }
                  >
                    <TransferEntry
                      picPieces={transItem.picPieces}
                      source={transItem.source}
                      targets={[...transItem.targets]}
                      foreign={culture}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
