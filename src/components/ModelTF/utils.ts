import * as tf from "@tensorflow/tfjs";
import { CANVAS_ELEMENTS_LENGTH, COMPILER_CONFIG } from "./constants";
import { TrainDataType } from ".";

export const createModel = () => {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      units: 1,
      inputShape: [CANVAS_ELEMENTS_LENGTH],
    })
  );
  model.add(tf.layers.dense({ units: 1 }));

  model.compile(COMPILER_CONFIG);

  return model;
};

export const onDownload = (data: TrainDataType) => {
  const blob = new Blob([JSON.stringify({ data })], { type: "text/json" });

  const link = document.createElement("a");
  link.download = "train_data.json";
  link.href = window.URL.createObjectURL(blob);
  link.click();
  link.remove();
};
