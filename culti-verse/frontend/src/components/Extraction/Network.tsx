import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { Network } from "vis-network";
import { Node, Edge } from "../../vite-env";

export default function NetWork(props: {
  nodes: Node[];
  edges: Edge[];
  select: (nid: string) => void;
}) {
  const networkRef = useRef(null);
  useEffect(() => {
    const options = {
      nodes: {
        shape: "dot",
        scaling: {
          label: {
            min: 8,
            max: 20,
          },
        },
      },
    };
    //@ts-expect-error network's type can be transformed when render
    const network: Network =
      networkRef.current &&
      new Network(
        networkRef.current,
        { nodes: props.nodes, edges: props.edges },
        options
      );
    if (networkRef && network) {
      network!.on("click", function (params) {
        const node: string | undefined = params.nodes[0];
        const edge: string | undefined = params.edges[0];
        // console.log(node, edge);
        // console.log(params.nodes[0], params.edges[0]);
        if (node || edge) {
          if (node) {
            props.select(node);
          } else if (edge) props.select(edge);
        }
      });
    }
    //不能把整个props写进去，否则每次select导致图被重新渲染
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkRef, props.nodes, props.edges]);
  return <Box w={250} h={220} ref={networkRef} />;
}
