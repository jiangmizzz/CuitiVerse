// import { useState } from "react";
import { targetItem } from "../../stores/static-data";
import TargetTag from "./TargetTag";
import "./TransferEntry.css";

interface TransferEntryProps {
  picPieces: string;
  source: string;
  targets: targetItem[];
  foreign: string;
}

export default function TransferEntry(props: TransferEntryProps) {
  return (
    <>
      <div className="transfer-entry-main">
        <div className="transfer-entry-img">
          <img src={props.picPieces}></img>
        </div>
        <div>
          <div className="transfer-entry-source">{props.source}</div>
        </div>
        <div className="transfer-entry-target">
          {props.targets.map((target, index) => {
            return (
              <div className="transfer-entry-target-item" key={target.text}>
                <TargetTag text={target.text} type={target.type} id={index} />
                <div style={{ alignSelf: "center" }}>---------</div>
                <TargetTag
                  text={target.text}
                  type={target.type}
                  id={index}
                  culture={props.foreign}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
