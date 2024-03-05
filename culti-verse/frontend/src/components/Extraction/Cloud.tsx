import * as echarts from "echarts/core";
import { TooltipComponent } from "echarts/components";
import "echarts-wordcloud";
import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { cloudData } from "../../vite-env";

//字体配色
const fontColor = [
  "dbbe9a",
  "94617b",
  "a0c1d2",
  "96a48b",
  "939391",
  "eba79c",
  "b0a7d7",
  "d7c3b8",
];

export default function Cloud(props: {
  data: cloudData[];
  select: (nid: string) => void;
}) {
  echarts.use([TooltipComponent]);
  useEffect(() => {
    const chartDom = document.getElementById("wordcloud");
    const myChart = echarts.init(chartDom);
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
          type: "wordCloud",
          shape: "circle", //形状
          keepAspect: true, //图像比例
          //图像在画布中的位置
          left: "center",
          top: "center",
          width: "90%",
          height: "90%",
          right: null,
          bottom: null,

          // Text size range
          sizeRange: [8, 25],

          //文字旋转角, range [-90, 90] by rotationStep 45
          rotationRange: [0, 0],
          rotationStep: 0,
          //词间隔大小
          gridSize: 5,

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
            color: function () {
              return (
                "#" + fontColor[Math.floor(Math.random() * fontColor.length)]
              );
            },
          },
          emphasis: {
            focus: "self",
          },
          // Data is an array. Each array item must have name and value property.
          data: props.data,
        },
      ],
    };

    if (chartDom && myChart) {
      myChart.setOption(option);
      //点击标签即可选中物像
      myChart.on("click", function (params) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        props.select(params.data!.nid);
      });
    }

    return () => {
      if (myChart) {
        myChart.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Box id="wordcloud" w={250} h={220} />;
}
