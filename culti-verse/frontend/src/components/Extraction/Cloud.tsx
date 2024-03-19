import * as echarts from "echarts/core";
import { TooltipComponent } from "echarts/components";
import "echarts-wordcloud";
import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import icon from "../../assets/logo.png";
import { CloudData } from "../../vite-env";
import { seriesColorMap } from "../../stores/maps";

const seriesCfg = {
  type: "wordCloud",
  shape: "cardioid", //形状
  keepAspect: false, //图像比例

  // Text size range
  sizeRange: [8, 16],

  //文字旋转角, range [-90, 90] by rotationStep 45
  rotationRange: [0, 0],
  rotationStep: 0,
  //词间隔大小
  gridSize: 5,
  right: null,
  bottom: null,

  drawOutOfBound: false,
  // If perform layout animation.
  // NOTE disable it will lead to UI blocking when there is lots of words.
  layoutAnimation: true,

  // Global text style
  textStyle: {
    fontFamily: "sans-serif",
    fontWeight: "bold",
    // Color can be a callback function or a color string
    // 函数式赋值令随机生效
  },
  emphasis: {
    focus: "self",
  },
};

export default function Cloud(props: {
  data: CloudData[];
  select: (nid: string) => void;
}) {
  echarts.use([TooltipComponent]);
  useEffect(() => {
    const chartDom = document.getElementById("wordcloud");
    const myChart = echarts.init(chartDom);
    const maskImage = new Image();
    maskImage.src = icon;
    const option = {
      tooltip: {
        show: true,
        borderWidth: 0,
        padding: [5, 10, 5, 10],
        confine: true,
        backgroundColor: "rgba(255,255,255, 0.6)",
        textStyle: {
          // color: "black",
          lineHeight: 22,
        },
        extraCssText:
          "box-shadow: 0 4px 20px -4px rgba(199, 206, 215, .7);border-radius: 4px;",
      },
      series: [
        {
          ...seriesCfg,
          //图像在画布中的位置
          left: "20",
          top: "0",
          width: "50%",
          height: "60%",
          maskImage: maskImage, //遮罩图层
          // Data is an array. Each array item must have name and value property.
          textStyle: {
            color: function () {
              return seriesColorMap.get("Animal");
            },
          },
          data: props.data.filter((d) => d.type === "Animal")[0].data,
        },
        {
          ...seriesCfg,
          left: "20",
          top: "130",
          width: "60%",
          height: "30%",
          maskImage: maskImage,
          // Data is an array. Each array item must have name and value property.
          textStyle: {
            color: function () {
              return seriesColorMap.get("Plant");
            },
          },
          data: props.data.filter((d) => d.type === "Plant")[0].data,
        },
        {
          ...seriesCfg,
          left: "120",
          top: "100",
          width: "50%",
          height: "30%",
          maskImage: maskImage,
          textStyle: {
            color: function () {
              return seriesColorMap.get("Fruit");
            },
          },
          // Data is an array. Each array item must have name and value property.
          data: props.data.filter((d) => d.type === "Fruit")[0].data,
        },
        {
          ...seriesCfg,
          left: "120",
          top: "0",
          width: "70%",
          height: "50%",
          maskImage: maskImage,
          textStyle: {
            color: function () {
              return seriesColorMap.get("Other");
            },
          },
          // Data is an array. Each array item must have name and value property.
          data: props.data.filter((d) => d.type === "Other")[0].data,
        },
      ],
    };

    maskImage.onload = function () {
      if (chartDom && myChart) {
        myChart.setOption(option);
        //点击标签即可选中物像
        myChart.on("click", function (params) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          props.select(params.data!.nid);
        });
      }
    };

    return () => {
      if (myChart) {
        myChart.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Box id={"wordcloud"} w={250} h={200} />;
}
